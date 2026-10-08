# Angkop Matching Algorithm — How It Works

This document explains, step by step, how Angkop turns a user profile and a job posting
into a match score, a skill gap breakdown, and a plain-language explanation. It's written
to be turned into a visualization (e.g. an interactive diagram walking through each
stage). Every number, formula, and threshold below is pulled directly from the current
implementation in `ml/app/` — nothing is aspirational.

> Where this lives in the codebase: `ml/app/services/embedder.py`,
> `ml/app/services/ncf_service.py`, `ml/app/routers/recommendations.py`,
> `ml/app/routers/skill_gap.py`, `ml/app/models/ncf.py`, `ml/app/config.py`.

---

## 1. The big picture

A match score is not one model — it's two independent signals blended together:

```
┌─────────────────────┐       ┌──────────────────────────┐
│   Semantic Score     │       │   Collaborative Score     │
│  (Sentence-BERT      │       │  (Neural Collaborative    │
│   cosine similarity) │       │   Filtering — NeuMF)      │
│  "does the text      │       │  "do similar users like   │
│   actually match?"   │       │   this job?"              │
└──────────┬───────────┘       └─────────────┬────────────┘
           │                                  │
           └───────────────┬──────────────────┘
                            ▼
                   Hybrid Score (weighted blend)
                            │
                            ▼
              shown to the user as a % match
```

Separately, a **skill gap analyzer** compares the job's required skills against the
user's declared skills to find what's missing, and an **AI insight generator** (Gemini)
turns the raw numbers into a plain-language explanation. These two don't feed back into
the hybrid score — they're presentation layers built on top of it.

---

## 2. Step 1 — Turning text into vectors (embeddings)

**File:** `ml/app/services/embedder.py`

Both the user's skills text and the job's description text are converted into
**384-dimensional vectors** using the `all-MiniLM-L6-v2` Sentence-BERT model:

```python
embedding = model.encode(text, normalize_embeddings=True)  # → 384 floats, unit length
```

- `normalize_embeddings=True` means every vector has length 1 — this is what makes
  cosine similarity reduce to a simple dot product later.
- The model runs with `torch.set_num_threads(1)` plus a lock — embedding calls are
  serialized one at a time to avoid CPU thread contention under concurrent requests.
- The model loads once at service startup (`main.py` warm-up), not on first request.

**Inputs / Outputs**

| | Name | Type | Notes |
|---|---|---|---|
| Function | `embed_text(text)` | `str` → `list[float]` | single string in, one 384-float vector out |
| Function | `embed_texts(texts)` | `list[str]` → `list[list[float]]` | batch form, used by skill-gap (§6) |
| API route | `POST /embed` | `EmbedRequest{text: str}` → `EmbedResponse{embedding: list[float]}` | the raw endpoint (`ml/app/routers/embeddings.py`) |

**Visualization idea:** show a sentence ("React developer with 2 years experience")
collapsing into a point in a 384-dimensional space, simplified to 2D/3D (e.g. via a toy
PCA projection) so viewers can see "similar meaning → nearby points."

---

## 2b. Under the hood — what `model.encode(text)` actually does

`embed_text()` (§2) looks like one function call, but `all-MiniLM-L6-v2` is doing four
distinct things inside that call. This is the part worth visualizing in detail, because
it's the actual mechanism, not a black box:

```
"React developer with 2 years experience"
          │
          ▼
┌──────────────────────┐   WordPiece tokenizer (BERT-style, ~30k vocab).
│ 1. TOKENIZE           │   Splits on whitespace + subwords, adds [CLS]/[SEP].
└──────────┬────────────┘
          ▼
  [CLS] react develop ##er with 2 years experience [SEP]
   id=101 id=25...  id=... ...                    id=102
          │
          ▼
┌──────────────────────┐   Each token id → a learned 384-dim token embedding
│ 2. EMBED + ENCODE     │   + positional embedding, then through 6 stacked
│   (6 transformer      │   Transformer encoder layers (self-attention +
│    encoder layers)    │   feed-forward, per layer). Self-attention lets
└──────────┬────────────┘   "developer" absorb context from "React" and vice
          │                 versa — this is what makes the *contextual*
          │                 embedding different from a plain word lookup.
          ▼
  one 384-dim vector PER TOKEN, each now "aware" of the whole sentence:
  [CLS]→v₀   react→v₁   develop→v₂   ##er→v₃   with→v₄   2→v₅   years→v₆  …
  (each vᵢ is 384 numbers; shown here as one row per token)
          │
          ▼
┌──────────────────────┐   Average the per-token vectors together, masking
│ 3. MEAN POOLING       │   out padding tokens — this is specifically what
│                       │   sentence-transformers does for this model (NOT
└──────────┬────────────┘   just taking the [CLS] vector, which is a common
          │                 misconception carried over from plain BERT).
          ▼
  pooled = mean(v₀, v₁, v₂, v₃, v₄, v₅, v₆, …)   → one 384-dim vector
          │
          ▼
┌──────────────────────┐   Divide the pooled vector by its own length so
│ 4. L2 NORMALIZE       │   ‖pooled‖ = 1. This is the `normalize_embeddings=
│                       │   True` flag from §2 — it's what lets cosine
└──────────┬────────────┘   similarity collapse into a plain dot product.
          ▼
  final embedding: 384 floats, unit length — this is the `list[float]`
  returned by `embed_text()` and `POST /embed`
```

### Worked example (toy 4 dimensions, not real 384)

Say the model has already produced contextual vectors for 3 tokens (real token
vectors are 384-dim; shown here at 4-dim so the arithmetic is checkable by hand):

| Token | vector |
|---|---|
| `react` | `[0.80, 0.10, -0.20, 0.40]` |
| `develop##er` | `[0.60, 0.30, 0.10, 0.20]` |
| `experience` | `[0.20, 0.50, 0.00, 0.10]` |

**Step 3 — mean pooling** (average each column):

```
pooled = ( [0.80,0.10,-0.20,0.40]
         + [0.60,0.30, 0.10,0.20]
         + [0.20,0.50, 0.00,0.10] ) / 3

       = [1.60, 0.90, -0.10, 0.70] / 3

       = [0.5333, 0.3000, -0.0333, 0.2333]
```

**Step 4 — L2 normalize** (divide by the vector's own length):

```
‖pooled‖ = √(0.5333² + 0.3000² + 0.0333² + 0.2333²)
         = √(0.2844 + 0.0900 + 0.0011 + 0.0544)
         = √0.4299 = 0.6557

normalized = pooled / 0.6557
           = [0.8133, 0.4575, -0.0508, 0.3558]

check: 0.8133² + 0.4575² + 0.0508² + 0.3558² ≈ 1.000  ✓ unit length
```

That final `[0.8133, 0.4575, -0.0508, 0.3558]` is the shape of what `embed_text()`
returns — except with 384 numbers instead of 4. Because it's already unit-length, §3's
cosine similarity between two such vectors is just their dot product (`‖A‖×‖B‖ = 1×1`).

**Visualization idea:** an animated pipeline exactly like the diagram above, where each
stage visibly transforms a row of bars — tokens appearing one at a time, then token-bar
rows "melting" together into one averaged row (pooling), then that row visibly
shrinking/stretching to unit length (normalization). Pairs well with the existing
sbert demo's per-word weight bars, re-framed as "this is pooling," not as independent
per-word scores.

---

## 3. Step 2 — Semantic Score (cosine similarity)

**File:** `ml/app/services/embedder.py`, used in `ml/app/routers/recommendations.py`

Cosine similarity measures the angle between the user-embedding and job-embedding
vectors — not their raw distance, so wording length doesn't matter, only meaning:

```
cosine_similarity(A, B) = (A · B) / (‖A‖ × ‖B‖)
```

```python
semantic_score = max(0.0, cosine_similarity(user_embedding, job_embedding))
```

- Because unrelated sentences can produce a slightly negative cosine, the score is
  **clamped to a 0.0 floor** so it always reads as a clean 0–1 "match percentage."
- A score near 1.0 means the two texts are nearly identical in meaning; near 0 means
  unrelated.

**Inputs / Outputs**

| | Name | Type | Notes |
|---|---|---|---|
| Input | `a`, `b` | `list[float]`, `list[float]` | the two 384-dim embeddings being compared |
| Output | `cosine_similarity(a, b)` | `float` | raw cosine, can dip slightly negative |
| Output (used downstream) | `semantic_score` | `float`, clamped to `[0.0, 1.0]` | `max(0.0, cosine_similarity(...))` |

**Visualization idea:** two vectors drawn from the origin, the angle between them
shrinking as textual overlap increases, with the resulting cosine value shown live.

---

## 4. Step 3 — Collaborative Score (Neural Collaborative Filtering)

**Files:** `ml/app/models/ncf.py` (architecture), `ml/app/services/ncf_service.py`
(inference), `ml/scripts/train_ncf.py` (training)

This signal doesn't look at text at all — it looks at **behavior**: which users
interacted with which jobs, modeled as a NeuMF (Neural Matrix Factorization) network
per He et al. (2017), combining two parallel branches:

### Architecture

```
user_id ──┬──> [GMF user embedding (dim=8)] ──┐
          │                                     ×  (element-wise product)
job_id  ──┴──> [GMF item embedding (dim=8)] ──┘         │
                                                          │
user_id ──┬──> [MLP user embedding (dim=8)] ──┐          │
          │                                    concat    │
job_id  ──┴──> [MLP item embedding (dim=8)] ──┘          │
                         │                                │
                 Linear(16→16) → ReLU                     │
                 Linear(16→8)  → ReLU                      │
                         │                                 │
                         └──────────────┬────────────────┘
                                         ▼
                           concat(GMF output, MLP output)
                                         ▼
                              Linear(16 → 1) → sigmoid
                                         ▼
                           collaborative_score ∈ [0, 1]
```

- **GMF branch** (Generalized Matrix Factorization): element-wise product of user and
  item embeddings — captures linear user–item interaction patterns.
- **MLP branch**: concatenates user and item embeddings, passes through two
  fully-connected layers (16 → 8, ReLU activations) — captures non-linear patterns.
- The two branches' outputs are concatenated and passed through a final linear layer +
  sigmoid to produce a single score between 0 and 1.

### Training (`train_ncf.py`)

- **Labels from implicit feedback weights**: `apply = 5, save = 3, view = 1,
  dismiss = -2`, normalized into a [0, 1] label via `(weight + 2) / 7`.
- **Negative sampling**: for every observed (user, job) interaction, one random
  unobserved (user, job) pair is sampled as a negative example (label 0).

  **Worked example of the label formula**, `(weight + 2) / 7`:

  | Interaction | Raw weight `w` | Label = `(w + 2) / 7` |
  |---|---|---|
  | Apply | 5 | (5+2)/7 = **1.00** |
  | Save | 3 | (3+2)/7 = **0.71** |
  | View | 1 | (1+2)/7 = **0.43** |
  | Dismiss | −2 | (−2+2)/7 = **0.00** |

  The `+2` shifts the most-negative weight (dismiss, −2) up to exactly 0, and
  the `/7` rescales the most-positive weight (apply, 5) down to exactly 1 —
  `7` is simply `5 − (−2)`, the full span of the raw weights. This is only
  used to build **training labels**; it never runs at inference time (§4.1
  below doesn't use it at all — inference only does a forward pass through
  the already-trained network).
- Trained for 300 epochs with Adam (lr=0.01) and binary cross-entropy loss.
- Trained **offline** (per the thesis design — intended for Google Colab), then the
  resulting weights (`weights/ncf.pt`) and id mappings (`weights/id_mappings.json`) are
  loaded by the FastAPI service at startup.

### Cold start

```python
if loaded is None or user_id not in user_index or job_id not in item_index:
    return COLD_START_COLLABORATIVE_SCORE  # = 0.5, a neutral score
```

A user or job the model has never seen (new signup, newly ingested job, or weights not
yet trained/deployed) gets a **neutral 0.5** rather than a confident but fabricated
number. This is expected behavior, not a bug — it's the system acknowledging "no
behavioral data yet."

**Inputs / Outputs**

| | Name | Type | Notes |
|---|---|---|---|
| Input | `user_id`, `job_id` | `str`, `str` | looked up against `id_mappings.json`'s `userIndex`/`itemIndex` |
| Output | `predict_collaborative_score(user_id, job_id)` | `float` ∈ [0, 1] | `0.5` if either id is unmapped (cold start) |
| Model forward | `NeuMF.forward(user_idx, item_idx)` | `torch.Tensor` (int ids) → `torch.Tensor` (float, 0–1) | internal to the loaded model, after id → index lookup |

**Visualization idea:** a small network diagram with the two branches lighting up as
data flows through, and a toggle to show the cold-start fallback path.

---

## 4b. Under the hood — a worked NCF forward pass

Section 4's diagram shows the *shape* of the network. Here's an actual forward pass
through it, with real arithmetic, so it's clear this isn't a metaphor — it's matrix
multiplication. Real NCF uses **8-dimensional** embeddings and a 16→16→8 MLP; this
walkthrough uses **2 dimensions** and a 4→4→2 MLP instead (same architecture, same
ratios, small enough to compute by hand).

```
user_id = "u_42"          job_id = "j_17"
        │                        │
        ▼                        ▼
 id_mappings.json lookup  (userIndex / itemIndex)
        │                        │
   found → idx 5            found → idx 12
```

### Branch 1 — GMF (element-wise product)

```
GMF_user_embedding[5]  = [0.90, 0.20]   ──┐
                                           ×  (element-wise)
GMF_item_embedding[12] = [0.80, 0.40]   ──┘
                                           │
                                           ▼
                   GMF_output = [0.90×0.80, 0.20×0.40]
                              = [0.72, 0.08]
```

### Branch 2 — MLP (concat → Linear → ReLU → Linear → ReLU)

```
MLP_user_embedding[5]  = [0.60, -0.10]  ──┐
                                           concat
MLP_item_embedding[12] = [0.30,  0.50]  ──┘
                                           │
                                           ▼
                           x = [0.60, -0.10, 0.30, 0.50]      (4-dim)
                                           │
                                 Linear(4→4) + ReLU
                                           │
                        h1 = ReLU(W1·x + b1) = [0.34, 0.00, 0.00, 0.47]
                                           │
                                 Linear(4→2) + ReLU
                                           │
                        MLP_output = ReLU(W2·h1 + b2) = [0.371, 0.057]
```

(`W1`, `b1`, `W2`, `b2` are the layer's learned weights — picked here as fixed toy
numbers so the example is reproducible; in the real model they come from
`weights/ncf.pt` after the 300-epoch training run in §4.)

### Merge — concat both branches → final linear → sigmoid

```
concat(GMF_output, MLP_output) = [0.72, 0.08, 0.371, 0.057]      (4-dim)
                                           │
                                 Linear(4→1)
                                           │
              logit = W3·[0.72, 0.08, 0.371, 0.057] + b3 = 0.3666
                                           │
                                       sigmoid
                                           │
                                           ▼
                    collaborative_score = σ(0.3666) ≈ 0.591
```

```
sigmoid(x) = 1 / (1 + e^-x)
sigmoid(0.3666) = 1 / (1 + e^-0.3666) = 1 / (1 + 0.693) ≈ 0.591
```

So this (user, job) pair — one the model *has* seen in training — comes out at a
**59% collaborative score**. Compare against §4's cold-start path: if `"u_42"` or
`"j_17"` had **not** been in `id_mappings.json` (a brand-new signup, or a job ingested
after the model was last trained), none of the above runs at all — the service
short-circuits straight to the flat `0.5`:

```
                    ┌─────────────────────────┐
 user_id, job_id ──▶│ in id_mappings.json?     │
                    └────────────┬────────────┘
                     yes │               │ no
                         ▼               ▼
              run the forward pass   return 0.5 directly
              shown above  →  0.591      (cold start — no
                                           forward pass at all)
```

**Visualization idea:** let a viewer toggle between "seen pair" (plays the forward pass
above, bar-by-bar) and "unseen pair" (skips straight to a flat 0.5 bar with a label
explaining why) — makes concrete that cold start isn't a worse prediction, it's *no
prediction*, substituted with a neutral placeholder.

---

## 5. Step 4 — Hybrid Score (the blend)

**File:** `ml/app/routers/recommendations.py`, constants in `ml/app/config.py`

The two scores are combined with a weight that **shifts based on how much interaction
history the user has** — new users lean on semantic (text) matching; experienced users'
behavior counts for more:

```python
COLLABORATIVE_WEIGHT_FLOOR = 0.10            # minimum weight given to collaborative score
COLLABORATIVE_WEIGHT_CEILING = 0.60          # maximum weight given to collaborative score
COLLABORATIVE_WEIGHT_STEP_PER_INTERACTION = 0.05   # weight gained per past interaction

collaborative_weight = min(
    FLOOR + STEP_PER_INTERACTION * interaction_count,
    CEILING
)

hybrid_score = collaborative_weight * collaborative_score \
             + (1 - collaborative_weight) * semantic_score
```

Concretely:
| User's past interactions | Collaborative weight | Semantic weight |
|---|---|---|
| 0 (brand new) | 0.10 | 0.90 |
| 2 | 0.20 | 0.80 |
| 5 | 0.35 | 0.65 |
| 10+ | 0.60 (ceiling reached) | 0.40 |

This is a **linear ramp that saturates at a ceiling** — a simple, explainable way to
solve the cold-start problem without a separate model.

```
collaborative
weight
 0.60 ┤ceiling                              ●━━━━━━━━━━━━━━━●  (10+ interactions)
 0.55 ┤                                  ●
 0.50 ┤                              ●
 0.45 ┤                          ●
 0.40 ┤                      ●
 0.35 ┤                  ●
 0.30 ┤              ●
 0.25 ┤          ●
 0.20 ┤      ●
 0.15 ┤  ●
 0.10 ┤●  floor (brand-new user)
      └─┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬──▶
        0   1   2   3   4   5   6   7   8   9  10  interactions

each step right = +1 interaction = +0.05 collaborative weight,
clamped at 0.60 once interaction_count ≥ 10
```

Equivalently, the **semantic weight** is just `1 − collaborative_weight`, so it starts
at 0.90 and falls to a floor of 0.40 — never zero, because text-based matching never
stops being relevant even for a power user.

**Inputs / Outputs — `POST /recommend`** (the endpoint that ties §2–§5 together)

```python
class RecommendRequest(BaseModel):
    userId: str
    jobId: str
    userSkillsText: str       # fed into embed_text() → user_embedding
    jobText: str              # fed into embed_text() → job_embedding
    userInteractionCount: int # drives collaborative_weight

class RecommendResponse(BaseModel):
    semanticScore: float          # §3 output
    collaborativeScore: float     # §4 output
    hybridScore: float            # this section's output
    collaborativeWeight: float    # the w actually used, so the client can show it
```

| | Name | Type |
|---|---|---|
| Input | `userId`, `jobId` | `str`, `str` |
| Input | `userSkillsText`, `jobText` | `str`, `str` |
| Input | `userInteractionCount` | `int` |
| Output | `semanticScore`, `collaborativeScore` | `float`, `float` |
| Output | `collaborativeWeight` | `float` (the computed `w`) |
| Output | `hybridScore` | `float` (final blended match score) |

**Visualization idea:** a slider for "interaction count" that live-redraws a stacked bar
showing the two weights shifting, with the resulting hybrid score recalculating in
real time. This is probably the centerpiece visualization — it's the one formula that
ties the whole system together.

### Displaying the score

The actual thresholds live in shared code, consumed by both the web dashboard and the
browser extension overlay:

```ts
// packages/shared/src/index.ts
export const MATCH_SCORE_THRESHOLDS = { STRONG: 0.7, PARTIAL: 0.4 } as const
```

Per the dashboard's design rules (`.claude/rules/design.md`), the hybrid score is always
shown as a percentage with a color band:
- **≥ 70% (`STRONG`)** → green ("strong match")
- **40–69% (`PARTIAL`)** → yellow ("partial match")
- **< 40%** → red ("weak match")

---

## 6. Step 5 — Skill Gap Detection

**File:** `ml/app/routers/skill_gap.py`, constant in `ml/app/config.py`

The thesis's original design was "subtract the job embedding from the user embedding
and read off the top-k dimensions" — but Sentence-BERT's 384 output dimensions aren't
individually labeled (dimension #217 doesn't mean "knows Python"), so that subtraction
isn't actually interpretable. The implemented approach keeps the same spirit — a
genuine embedding-based comparison — applied per-skill instead of per-dimension:

```python
for each required_skill in job.requiredSkills:
    skill_embedding = embed(required_skill)
    best_similarity = max(
        cosine_similarity(skill_embedding, user_skill_embedding)
        for user_skill_embedding in user.declared_skill_embeddings
    )
    if best_similarity < SKILL_GAP_SIMILARITY_THRESHOLD:   # = 0.5
        confidence = round(1 - best_similarity, 4)
        missing_skills.append({ skill, confidence, courses: lookup_courses(skill) })

missing_skills.sort(by confidence, descending)
```

In words: for every skill the job asks for, find the user's closest-matching declared
skill by meaning (not exact string match — "JS" and "JavaScript" embed close together).
If even the *best* match falls below a 0.5 similarity threshold, that skill counts as a
gap. The further below threshold, the higher the reported "confidence" that it's truly
missing.

**Inputs / Outputs — `POST /skill-gap`**

```python
class SkillGapRequest(BaseModel):
    userSkills: list[str]         # the user's declared skill names
    jobRequiredSkills: list[str]  # the job posting's required skill names

class Course(BaseModel):
    title: str
    provider: str
    url: str
    thumbnail: str | None = None
    description: str | None = None

class SkillGap(BaseModel):
    skill: str          # the required skill the user doesn't have, by name
    confidence: float   # 1 − best_similarity, rounded to 4 decimals; higher = bigger gap
    courses: list[Course]

class SkillGapResponse(BaseModel):
    missingSkills: list[SkillGap]  # sorted by confidence, descending
```

| | Name | Type |
|---|---|---|
| Input | `userSkills` | `list[str]` |
| Input | `jobRequiredSkills` | `list[str]` |
| Output | `missingSkills` | `list[SkillGap]`, each with `skill: str`, `confidence: float`, `courses: list[Course]` |

No `k` cap exists in the ML service itself — every required skill below the 0.5
threshold is returned; pagination (10 per page, 50 max) happens one layer up, in the
Express GraphQL resolver.

### Mapping gaps to courses

**File:** `ml/app/data/course_index.py`

- A curated static dictionary (`COURSE_INDEX`) maps ~35 common skills (React,
  TypeScript, SQL, Docker, Figma, etc.) to one hand-picked, trusted course link each.
- Any skill not in that list falls back to a **YouTube Data API v3 search**
  (`"{skill} course tutorial"`, top 3 results), cached in-process per skill so the
  YouTube free-tier quota (~100 searches/day) is spent once per distinct skill ever
  searched, not once per request.
- If YouTube isn't configured or returns nothing, it falls back further to a generic
  Coursera search-results link for that skill name.

Per the design rules, gaps are framed constructively in the UI — "Add React," never
"Missing React."

**Visualization idea:** a radar/bar chart of required vs. user skills, with the gaps
highlighted and a similarity-threshold line the viewer can drag to see which skills
cross into "gap" territory.

### Worked example

User's declared skills: `["JavaScript", "React", "HTML/CSS"]`. Job requires:
`["TypeScript", "Figma", "Docker"]`. Each required skill is compared against the
user's *best*-matching declared skill — not summed or averaged:

```
required: "TypeScript"
  vs "JavaScript" → 0.81  ←  closest (TS and JS embed close — related syntax/ecosystem)
  vs "React"       → 0.42
  vs "HTML/CSS"    → 0.30
  best_similarity = 0.81  →  0.81 ≥ 0.50 threshold  →  NOT a gap

required: "Figma"
  vs "JavaScript"  → 0.12
  vs "React"       → 0.15
  vs "HTML/CSS"    → 0.22
  best_similarity = 0.22  →  0.22 < 0.50 threshold  →  GAP
  confidence = 1 − 0.22 = 0.78

required: "Docker"
  vs "JavaScript"  → 0.18
  vs "React"       → 0.14
  vs "HTML/CSS"    → 0.10
  best_similarity = 0.18  →  0.18 < 0.50 threshold  →  GAP
  confidence = 1 − 0.18 = 0.82

missingSkills sorted by confidence, descending:
  1. Docker  (confidence 0.82)
  2. Figma   (confidence 0.78)
  → "TypeScript" is correctly excluded: close enough to "JavaScript" to not
    count as missing, even though the strings don't match at all.
```

Note TypeScript survives specifically *because* of semantic closeness to JavaScript —
a plain string-match gap detector would have flagged all three as missing.

---

## 7. Step 6 — AI Match Insight (explaining the numbers)

**File:** `ml/app/services/match_insight.py`, router `ml/app/routers/insight.py`

This step does **not** change any score — it takes the already-computed
`semanticScore`, `collaborativeScore`, and `hybridScore` as ground truth and asks
**Gemini** to translate them into plain language for a non-technical audience:

**Inputs / Outputs — `POST /insight/explain`**

```python
class MatchInsightRequest(BaseModel):
    jobTitle: str
    jobCompany: str
    jobDescription: str
    jobRequiredSkills: list[str]
    userSkillsText: str
    semanticScore: float        # passed through from §3, treated as ground truth
    collaborativeScore: float   # passed through from §4, treated as ground truth
    hybridScore: float          # passed through from §5, treated as ground truth

class MatchInsightResult(BaseModel):
    explanation: str              # 2-4 sentences, written directly to the candidate
    skillsReason: str             # one sentence grounding the skills score in specifics
    activityReason: str           # one sentence framing the collaborative score
    matchingSkills: list[str] = []  # overlapping skills, in the job's own wording
    missingSkills: list[str] = []   # gaps, phrased as skills worth building
```

| | Name | Type |
|---|---|---|
| Input | `jobTitle`, `jobCompany`, `jobDescription`, `jobRequiredSkills` | `str`, `str`, `str`, `list[str]` |
| Input | `userSkillsText` | `str` |
| Input | `semanticScore`, `collaborativeScore`, `hybridScore` | `float`, `float`, `float` — the numbers this step explains, never recomputes |
| Output | `explanation`, `skillsReason`, `activityReason` | `str`, `str`, `str` |
| Output | `matchingSkills`, `missingSkills` | `list[str]`, `list[str]` |

Notable constraints baked into the prompt:
- Explicitly forbidden from using algorithmic vocabulary ("embedding," "vector,"
  "collaborative filtering," "hybrid," etc.) — it must sound like a helpful friend, not
  a data scientist.
- If `hybrid_score < 0.4`, it's instructed to be upfront that it's a stretch match
  rather than overselling it.
- The job description and candidate skills are explicitly marked as **untrusted data,
  not instructions** in the prompt — a prompt-injection guard, since both come from
  content Angkop doesn't fully control (job postings, resume text).
- Result is generated once per `(userId, jobId)` pair and persisted
  (`MatchInsight` table) rather than regenerated on every dialog open — it's
  soft-deleted and recomputed only if the user's skills text changes.

**Visualization idea:** this is a good place for a "before/after" panel — raw numbers on
one side, the generated plain-language explanation on the other — to show what the AI
layer adds on top of the math.

---

## 8. End-to-end flow for one (user, job) pair

```
1. User's declared skills text + Job's description text
         │
         ├──> Sentence-BERT embed both ──> cosine similarity ──> semantic_score
         │
         ├──> (user_id, job_id) ──> NeuMF forward pass ──> collaborative_score
         │                          (or 0.5 if either id is unseen — cold start)
         │
         ├──> blend by collaborative_weight(interaction_count) ──> hybrid_score
         │
         ├──> [separately] per-required-skill embedding comparison ──> skill gaps
         │                                                              + course links
         │
         └──> [separately] Gemini explains semantic/collaborative/hybrid
                            in plain language ──> MatchInsight (persisted)
```

The Express API orchestrates this via a thin client (`apps/server/src/lib/ml-client.ts`)
that wraps each FastAPI route:

```ts
export function embed(req): Promise<EmbedResponse>              // POST /embed
export function recommend(req): Promise<RecommendResponse>      // POST /recommend
export function skillGap(req): Promise<SkillGapResponse>        // POST /skill-gap
export function matchInsight(req): Promise<MatchInsightResponse>// POST /insight/explain
```

The ML service itself never touches the database — Express owns Postgres (via Prisma)
and Redis, and passes whatever text/ids each route needs (see `ml/README.md`).

**Redis caching** (`apps/server/src/lib/redis.ts`):

```ts
const MATCH_SCORE_TTL_SECONDS = 60 * 60 * 24   // 24h
const key = `match-score:${userId}:${jobId}`
// cache miss -> call recommend() -> cache the full RecommendResponse under `key`
```

The whole `RecommendResponse` (all four fields) is cached per `(userId, jobId)`, and
explicitly invalidated — not just left to expire — whenever one of the hybrid formula's
real inputs changes: on profile completion/edit (`skillsText` changed → `semanticScore`
would change) and on every logged interaction (`userInteractionCount` changed →
`collaborativeWeight` would change).

**GraphQL resolvers** (`apps/server/src/graphql/resolvers/`) call this orchestration
layer: `jobMatches` fans `recommend()` out over a user's job feed (3-way concurrency,
since the ML service serializes inference internally); `jobMatchInsight` checks the
persisted `MatchInsight` row first, otherwise calls `recommend()` then `matchInsight()`
(with retry on 429/5xx) and upserts the result; `skillGaps` calls `skillGap()` and
persists each gap to `SkillGapRecord` before paginating.

---

## 9. Key constants at a glance

| Constant | Value | Meaning |
|---|---|---|
| Embedding model | `all-MiniLM-L6-v2` | Sentence-BERT, 384-dim output |
| `COLLABORATIVE_WEIGHT_FLOOR` | 0.10 | Min weight for collaborative score (new users) |
| `COLLABORATIVE_WEIGHT_CEILING` | 0.60 | Max weight for collaborative score |
| `COLLABORATIVE_WEIGHT_STEP_PER_INTERACTION` | 0.05 | Weight gained per logged interaction |
| `COLD_START_COLLABORATIVE_SCORE` | 0.50 | Neutral fallback for unseen user/job |
| `SKILL_GAP_SIMILARITY_THRESHOLD` | 0.50 | Below this cosine similarity, a skill counts as a gap |
| NCF embedding dim | 8 | Per He et al. (2017) NeuMF, GMF + MLP branches |
| NCF MLP layers | (16, 8) | Hidden layer sizes |
| NCF training | 300 epochs, Adam lr=0.01, BCE loss | Offline training (`train_ncf.py`) |
| Interaction weights (for training labels) | apply=5, save=3, view=1, dismiss=-2 | Normalized to [0,1] via `(w+2)/7` |
| Redis TTL for cached scores | 24h | Per `(userId, jobId)` pair |
| Match score color bands | ≥70% green, 40–69% yellow, <40% red | UI display rule |

---

## 10. What's documented here vs. what's not actually built yet

To keep this doc honest for a visualization meant to represent the *real* system:

- **Application Draft Generator** (Gemini drafting a cover letter/application email,
  per `CLAUDE.md`) — **not implemented**. No route, service, or commit for it exists
  anywhere in the repo; it's referenced only as a forward-looking comment. What *is*
  built and does call Gemini: the **Resume Parser** (`POST /resume/parse`) and the
  **Match Insight generator** (`POST /insight/explain`, documented in §7).
- **`UserProfile.embedding` and `Job.embedding`** (Prisma `Float[]` columns) — present
  in the schema but not part of the live scoring path. `Job.embedding` is written at
  ingest time but never read back; `UserProfile.embedding` is always set to `[]` and
  never populated. The real `/recommend` flow (§5) re-embeds `userSkillsText` and
  `jobText` fresh on every call rather than reading either stored vector — don't show
  these columns as part of the active pipeline.

## 11. Notes for building the visualization

- The **hybrid weight ramp** (§5) is the single most "visualizable" piece of novel logic
  — a live, interactive slider showing cold-start → experienced-user weight shift would
  communicate the whole cold-start design decision in one widget.
- The **cosine similarity** step (§3) is well-suited to a simple 2D vector/angle diagram
  — don't try to literally render 384 dimensions.
- The **NCF architecture** (§4) is a reasonably standard two-tower diagram; the
  interesting part to call out is the cold-start fallback, not the network itself.
- The **skill gap** step (§6) is worth noting as a deliberate deviation from the
  thesis's original "vector subtraction" description — call that out explicitly if the
  visualization is meant to document the actual system rather than the proposal.
