"use client";

import { useState } from "react";
import { Briefcase, Combine, Ruler, Scissors, Waypoints } from "lucide-react";
import { motion } from "framer-motion";
import { StepTabs } from "@/components/algorithms/step-tabs";
import { AnimatedNumber } from "@/components/algorithms/animated-number";
import {
  PROFILE_VECTOR,
  JOB_VECTOR,
  PROFILE_WORDS,
  JOB_WORDS,
  SEMANTIC_SCORE,
} from "@/components/algorithms/sbert-demo";
import { TARGET_SCORE, InteractionTable } from "@/components/algorithms/ncf-demo";
import { ALPHA } from "@/components/algorithms/hybrid-demo";
import {
  AngleDiagram,
  AttentionMatrix,
  DotProductWork,
  MechanismFlow,
  NetworkDiagram,
  SkillGapTable,
  StarRating,
  TallyGrid,
  VectorFingerprint,
  WeightBubbles,
  WordWeightPanel,
  cosineSim,
} from "@/components/presentation/mini-charts";

const A = PROFILE_VECTOR;
const B = JOB_VECTOR;
const COSINE = cosineSim(A, B);
const ANGLE_DEG = (Math.acos(Math.min(Math.max(COSINE, -1), 1)) * 180) / Math.PI;
const HYBRID = ALPHA * SEMANTIC_SCORE + (1 - ALPHA) * TARGET_SCORE;

const MECHANISM_STEPS = [
  {
    icon: Scissors,
    title: "1. Tokenize",
    description:
      "WordPiece subword tokens from BERT's ~30,000-piece vocabulary — e.g. “storefront” → [store, ##front].",
  },
  {
    icon: Waypoints,
    title: "2. Self-attention × 6 layers",
    description:
      "Every token repeatedly attends to every other token — a learned softmax(Q·Kᵀ) score. “L6” = 6 stacked layers.",
  },
  {
    icon: Combine,
    title: "3. Mean pooling",
    description: "All 384-dim token vectors are averaged into one fixed-length vector, regardless of sentence length.",
  },
  {
    icon: Ruler,
    title: "4. Normalize",
    description: "L2-normalized so cosine similarity compares meaning, not sentence length.",
  },
];

const ATTENTION_TOKENS = ["customer", "storefront", "components", "design", "backend"];
const ATTENTION_MATRIX = [
  [0.3, 0.2, 0.15, 0.2, 0.15],
  [0.15, 0.25, 0.35, 0.15, 0.1],
  [0.1, 0.3, 0.3, 0.2, 0.1],
  [0.15, 0.15, 0.2, 0.3, 0.2],
  [0.1, 0.1, 0.15, 0.25, 0.4],
];

const SKILL_GAP_ROWS = [
  { skill: "React / component architecture", profile: 0.85, job: 0.9 },
  { skill: "TypeScript", profile: 0.4, job: 0.75 },
  { skill: "GraphQL", profile: 0.1, job: 0.85 },
  { skill: "Automated testing (Jest)", profile: 0.35, job: 0.6 },
  { skill: "CI/CD pipelines", profile: 0.5, job: 0.55 },
  { skill: "System design", profile: 0.3, job: 0.7 },
];
const SKILL_GAPS = SKILL_GAP_ROWS.map((r) => r.job - r.profile);
const SKILL_GAP_INDEX = SKILL_GAPS.indexOf(Math.max(...SKILL_GAPS));

const TALLY_JOBS = [
  { label: "Frontend Dev — Shopee", hit: true },
  { label: "UI Engineer — Kumu", hit: true },
  { label: "Web Dev — PayMongo", hit: true },
  { label: "Product Designer — Canva", hit: true },
  { label: "Data Entry Clerk", hit: false },
];

const LIKERT_BUCKETS = [
  { rating: 1, freq: 0 },
  { rating: 2, freq: 1 },
  { rating: 3, freq: 4 },
  { rating: 4, freq: 15 },
  { rating: 5, freq: 20 },
];
const LIKERT_TOTAL = LIKERT_BUCKETS.reduce((sum, b) => sum + b.freq, 0);
const LIKERT_MEAN = LIKERT_BUCKETS.reduce((sum, b) => sum + b.rating * b.freq, 0) / LIKERT_TOTAL;

const STEPS = [
  {
    key: "embed",
    label: "1. Embeddings",
    title: "Step 1 — Embedding Generation (SBERT)",
    formula: [
      "embed(user_skills) = U ∈ ℝ³⁸⁴",
      "embed(job_description) = J ∈ ℝ³⁸⁴",
    ],
    note: "Both the user's skill profile text and the job description text pass through pretrained SBERT (all-MiniLM-L6-v2). Each word contributes to the final 384-number vector roughly in proportion to how specifically it names a skill, tool, or role.",
    visual: (
      <div>
        <div className="grid gap-6 sm:grid-cols-2">
          <WordWeightPanel title="U — profile words" words={PROFILE_WORDS} accent="text-chart-4" />
          <WordWeightPanel title="J — job words" words={JOB_WORDS} accent="text-chart-1" />
        </div>
        <p className="mt-5 text-xs text-muted-foreground">Folded into the embedding (8 of the real 384 dimensions):</p>
        <div className="mt-3 grid gap-6 sm:grid-cols-2">
          <VectorFingerprint vector={A} colorVar="var(--color-chart-4)" />
          <VectorFingerprint vector={B} colorVar="var(--color-chart-1)" />
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Inside all-MiniLM-L6-v2: where a weight like 0.93 comes from
          </p>
          <div className="mt-4">
            <MechanismFlow steps={MECHANISM_STEPS} />
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Layer 2 (self-attention) is illustrated below for 5 tokens from
            the job posting — each row is one token deciding how much of
            every other token to borrow from before the layer output is
            passed to the next of the 6 stacked layers:
          </p>
          <div className="mt-4 flex justify-center">
            <AttentionMatrix
              tokens={ATTENTION_TOKENS}
              matrix={ATTENTION_MATRIX}
              note="darker cell = row token attends more strongly to that column token"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            &ldquo;components&rdquo; attends most to &ldquo;storefront&rdquo;
            (0.35) — after 6 layers of this, its vector encodes
            &ldquo;e-commerce UI parts,&rdquo; not just &ldquo;generic UI
            parts.&rdquo; Mean-pool that across every token (Step 3) and the
            words that ended up most central to the sentence&rsquo;s meaning
            dominate the final vector — that dominance is what the
            illustrative 0–1 weight above approximates.
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "cosine",
    label: "2. Cosine similarity",
    title: "Step 2 — Semantic Similarity Score",
    formula: ["sim(U, J) = (U · J) / (‖U‖ × ‖J‖)"],
    note: "U · J is the dot product of the two vectors; ‖U‖ and ‖J‖ are their Euclidean norms. The result sits between −1 and 1 — semantically related SBERT embeddings land closer to 1. Worked out below using the same 8 words from Step 1.",
    visual: (
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
        <div>
          <AngleDiagram angleDeg={ANGLE_DEG} nameA="U" nameB="J" />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <span className="text-xl font-semibold text-foreground">
              <AnimatedNumber value={SEMANTIC_SCORE} duration={0.8} />%
            </span>{" "}
            similar
          </p>
        </div>
        <DotProductWork profileWords={PROFILE_WORDS} jobWords={JOB_WORDS} />
      </div>
    ),
  },
  {
    key: "neumf",
    label: "3. NeuMF",
    title: "Step 3 — Personalized Behavioral Score (NeuMF)",
    formula: [
      "φ_GMF = p_u ⊙ q_j",
      "φ_MLP = ReLU(W_L · z_(L−1) + b_L)",
      "ŷ(u, j) = sigmoid(hᵀ · [φ_GMF ; φ_MLP])",
    ],
    note: "A user latent vector p_u and a job latent vector q_j feed two branches — a Generalized Matrix Factorization term and a Multi-Layer Perceptron — combined and squashed by sigmoid into a 0–1 preference score. p_u and q_j themselves are learned from the labeled interaction history in Step 4.",
    visual: (
      <div>
        <NetworkDiagram
          layers={[
            { count: 2, label: "p_u, q_j", colorClass: "bg-chart-2" },
            { count: 3, label: "GMF ⊙ + MLP hidden", colorClass: "bg-chart-2" },
            { count: 1, label: "ŷ(u, j)", colorClass: "bg-primary" },
          ]}
        />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          predicted preference:{" "}
          <span className="text-lg font-semibold text-foreground">
            <AnimatedNumber value={TARGET_SCORE} duration={0.8} />%
          </span>
        </p>
      </div>
    ),
  },
  {
    key: "labels",
    label: "4. Feedback labels",
    title: "Step 4 — Weighted Implicit Feedback Labels",
    formula: [
      "w(view) = 1",
      "w(save) = 3",
      "w(applied) = 5",
      "w(dismissed) = −1",
    ],
    note: "The training signal for NeuMF: an ordinal weighting where an application counts more than a save, which counts more than a view, with a dismissal treated as an explicit negative signal. This is the actual per-job history NeuMF's p_u, q_j vectors in Step 3 are trained on.",
    visual: <InteractionTable showWeights />,
  },
  {
    key: "hybrid",
    label: "5. Hybrid score",
    title: "Step 5 — Hybrid Ranking Score",
    formula: ["final_score(u, j) = α × sim(U, J) + (1 − α) × ŷ(u, j)"],
    note: "For a brand-new user, α ≈ 1 (semantic-only, solving cold start). As logged interactions accumulate, α decreases so the personalized NCF score contributes more. Jobs are then sorted by final_score.",
    visual: (
      <div>
        <WeightBubbles
          items={[
            { label: "Semantic (α)", value: ALPHA, display: `${Math.round(ALPHA * 100)}%`, colorClass: "bg-chart-1" },
            { label: "Behavioral (1 − α)", value: 1 - ALPHA, display: `${Math.round((1 - ALPHA) * 100)}%`, colorClass: "bg-chart-2" },
          ]}
        />
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {ALPHA} × {SEMANTIC_SCORE} (from Step 2) + {1 - ALPHA} × {TARGET_SCORE} (from Step 3)
        </p>
        <p className="text-center text-3xl font-semibold tabular-nums text-foreground">
          <AnimatedNumber value={HYBRID} duration={0.8} decimals={1} />%
        </p>
        <p className="text-center text-xs text-muted-foreground">final_score — same profile and job as Steps 1–4</p>
      </div>
    ),
  },
  {
    key: "gap",
    label: "6. Skill gap",
    title: "Step 6 — Skill Gap Computation",
    formula: ["gap_vector = J − U"],
    note: "The dimensions of the resulting vector with the largest positive magnitude correspond to job requirements least represented in the user's profile — mapped to skill clusters, then to course recommendations. A different example role is used below since it names the skills directly.",
    visual: (
      <div>
        <SkillGapTable rows={SKILL_GAP_ROWS} gapIndex={SKILL_GAP_INDEX} />
        <p className="mt-4 text-sm text-muted-foreground">
          gap[{SKILL_GAP_ROWS[SKILL_GAP_INDEX].skill}] ={" "}
          {SKILL_GAPS[SKILL_GAP_INDEX].toFixed(2)} — the largest missing
          dimension, mapped to a course recommendation.
        </p>
      </div>
    ),
  },
  {
    key: "eval",
    label: "7. Evaluation",
    title: "Step 7 — Evaluation Computations",
    formula: [
      "Precision@K = relevant in top K / K",
      "Recall@K = relevant in top K / total relevant",
      "Weighted Mean = Σ(f × w) / Σf",
    ],
    note: "Precision@K and Recall@K measure ranking quality; the Weighted Mean is the ISO/IEC 25010 treatment applied to the 40 respondents' (30 job seekers, 10 IT/AI experts) Likert-scale evaluation scores.",
    visual: (
      <div>
        <div className="grid gap-6 sm:grid-cols-2">
          <TallyGrid
            items={TALLY_JOBS}
            icon={Briefcase}
            resultValue="4 / 5 = 80%"
            resultLabel="Precision@5 — of the top 5 shown, 4 are actually relevant"
          />
          <TallyGrid
            total={12}
            highlighted={4}
            icon={Briefcase}
            resultValue="4 / 12 = 33%"
            resultLabel="Recall@5 — of 12 relevant jobs in the full catalog, 4 made the top 5"
          />
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
            <StarRating mean={LIKERT_MEAN} label="Excellent" />
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              {LIKERT_BUCKETS.map((b) => (
                <p key={b.rating}>
                  {b.rating}★ × {b.freq} respondents
                </p>
              ))}
              <p className="border-t border-border pt-1.5 text-foreground">
                Σ(f×w) = {LIKERT_BUCKETS.map((b) => `${b.rating}×${b.freq}`).join(" + ")} ={" "}
                {LIKERT_BUCKETS.reduce((s, b) => s + b.rating * b.freq, 0)}
              </p>
              <p className="text-foreground">
                mean = {LIKERT_BUCKETS.reduce((s, b) => s + b.rating * b.freq, 0)} / {LIKERT_TOTAL} ={" "}
                <span className="font-semibold text-primary">{LIKERT_MEAN.toFixed(2)}</span> (n = {LIKERT_TOTAL})
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const SUMMARY = [
  { computation: "Cosine similarity", purpose: "Measures semantic (meaning-based) fit", usedIn: "Ranking criterion 1" },
  { computation: "NeuMF (GMF + MLP)", purpose: "Predicts personalized preference from behavior", usedIn: "Ranking criterion 2" },
  { computation: "Weighted hybrid sum", purpose: "Combines both scores into one ranking", usedIn: "Final job ranking" },
  { computation: "Vector subtraction", purpose: "Finds missing skill dimensions", usedIn: "Skill gap detection" },
  { computation: "Precision@K / Recall@K", purpose: "Measures ranking quality", usedIn: "System evaluation" },
  { computation: "Weighted Mean", purpose: "Aggregates Likert-scale survey data", usedIn: "ISO 25010 evaluation" },
];

export default function ComputationsPage() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Question 3
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          The computations, formally
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          The actual mathematical operations behind a single match request,
          in the order they run — each one worked out below with real
          numbers, not just the final percentage.
        </p>
      </motion.div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-8">
        <StepTabs steps={STEPS} step={step} onSelect={setStep} />

        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-semibold text-foreground">{current.title}</h2>
          <div className="mt-3 space-y-1.5 rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground">
            {current.formula.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{current.note}</p>

          <div className="mt-5 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
            {current.visual}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
        className="mt-8"
      >
        <h2 className="text-sm font-semibold text-foreground">Quick-reference summary</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Computation</th>
                <th className="px-4 py-2.5 font-medium">Purpose</th>
                <th className="px-4 py-2.5 font-medium">Where it&rsquo;s used</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY.map((row, index) => (
                <tr
                  key={row.computation}
                  className={index % 2 === 1 ? "bg-muted/20" : undefined}
                >
                  <td className="border-t border-border px-4 py-2.5 font-medium text-foreground">
                    {row.computation}
                  </td>
                  <td className="border-t border-border px-4 py-2.5 text-muted-foreground">
                    {row.purpose}
                  </td>
                  <td className="border-t border-border px-4 py-2.5 text-muted-foreground">
                    {row.usedIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
