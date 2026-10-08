"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, GitMerge, Layers, Network, ScanText } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/algorithms/animated-number";
import {
  PROFILE_VECTOR,
  JOB_VECTOR,
  PROFILE_WORDS,
  JOB_WORDS,
  SEMANTIC_SCORE,
} from "@/components/algorithms/sbert-demo";
import { TARGET_SCORE, InteractionTable } from "@/components/algorithms/ncf-demo";
import {
  DotProductWork,
  SkillGapTable,
  SKILL_GAP_SIMILARITY_THRESHOLD,
  VectorFingerprint,
  WeightBubbles,
  cosineSim,
} from "@/components/presentation/mini-charts";

const COSINE = cosineSim(PROFILE_VECTOR, JOB_VECTOR);

// Per required skill: its BEST cosine similarity against any of the user's
// declared skills (ml/app/routers/skill_gap.py) — not a raw per-dimension
// subtraction. Below SKILL_GAP_SIMILARITY_THRESHOLD (0.5) counts as a gap.
const SKILL_GAP_ROWS = [
  { skill: "React / component architecture", bestMatch: "React", similarity: 0.91 },
  { skill: "TypeScript", bestMatch: "JavaScript", similarity: 0.62 },
  { skill: "System design", bestMatch: "React", similarity: 0.48 },
  { skill: "Automated testing (Jest)", bestMatch: "JavaScript", similarity: 0.41 },
  { skill: "CI/CD pipelines", bestMatch: "Git", similarity: 0.35 },
  { skill: "GraphQL", bestMatch: "JavaScript", similarity: 0.22 },
].sort((a, b) => a.similarity - b.similarity);
const SKILL_GAPS = SKILL_GAP_ROWS.filter((r) => r.similarity < SKILL_GAP_SIMILARITY_THRESHOLD);

// Real weight ramp, ml/app/config.py: collaborative_weight = min(FLOOR +
// STEP × interactions, CEILING), FLOOR=0.10, STEP=0.05, CEILING=0.60 —
// so α (semantic weight = 1 − collaborative_weight) never actually hits 1,
// and collaborative weight never exceeds 0.60 no matter how active the user.
const USER_STATES = [
  { key: "new", label: "Brand-new user", alpha: 0.9, semantic: SEMANTIC_SCORE, behavioral: 50 },
  { key: "active", label: "Active user (10+ interactions)", alpha: 0.4, semantic: SEMANTIC_SCORE, behavioral: TARGET_SCORE },
];

export default function RankingPage() {
  const [stateKey, setStateKey] = useState("new");
  const state = USER_STATES.find((s) => s.key === stateKey);
  const hybrid = state.alpha * state.semantic + (1 - state.alpha) * state.behavioral;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Question 2
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          The ranking criteria, and why a hybrid
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Angkop does not rank jobs on a single criterion. Two independently
          computed scores are combined, because each has a well-documented
          weakness the other one covers.
        </p>
      </motion.div>

      <div className="mt-8 space-y-5">
        <CriterionCard
          icon={ScanText}
          accent="text-chart-1"
          accentBg="bg-chart-1/10"
          label="Criterion 1 — content-based"
          name="Semantic Similarity Score"
          measures="How closely the meaning of the user’s skill profile matches a job’s requirements, independent of exact wording."
          computed="Both texts pass through pretrained SBERT (all-MiniLM-L6-v2), producing two 384-dim embeddings. Cosine similarity between them gives a 0–1 score."
          why="Lets “React developer” and “front-end engineer” score highly similar despite sharing zero exact words — the specific failure of keyword-based platforms this thesis corrects."
          reference="Reimers & Gurevych (2019), EMNLP-IJCNLP"
          visual={
            <div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <VectorFingerprint label="Profile" vector={PROFILE_VECTOR} colorVar="var(--color-chart-4)" />
                </div>
                <div>
                  <VectorFingerprint label="Job" vector={JOB_VECTOR} colorVar="var(--color-chart-1)" />
                </div>
              </div>
              <div className="mt-5 border-t border-border pt-4">
                <DotProductWork profileWords={PROFILE_WORDS} jobWords={JOB_WORDS} />
              </div>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                cos(profile, job) = {COSINE.toFixed(3)} →{" "}
                <span className="text-lg font-semibold text-foreground">
                  <AnimatedNumber value={SEMANTIC_SCORE} duration={0.8} />%
                </span>
              </p>
            </div>
          }
        />
        <CriterionCard
          icon={Network}
          accent="text-chart-2"
          accentBg="bg-chart-2/10"
          label="Criterion 2 — behavioral"
          name="Personalized Behavioral Score"
          measures="How likely this specific user is to engage positively with this specific job, based on patterns learned from their own past interactions."
          computed="Neural Collaborative Filtering (NeuMF) takes a user vector and a job vector as input and outputs a predicted preference score, trained on weighted implicit feedback."
          why="Two users with the same skills can prefer different company sizes or work setups — NCF picks that up from behavior alone, without anyone stating the preference."
          reference="He et al. (2017), NeuMF / WWW"
          visual={
            <div>
              <InteractionTable showWeights />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                weighted implicit feedback → predicted score for an unseen job:{" "}
                <span className="text-lg font-semibold text-foreground">
                  <AnimatedNumber value={TARGET_SCORE} duration={0.8} />%
                </span>
              </p>
            </div>
          }
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <FailureCallout
          title="Semantic similarity alone is static"
          body="It recommends the same jobs to a given resume forever — it can never learn a user avoids night-shift roles or prefers startups."
        />
        <FailureCallout
          title="Collaborative filtering alone has a cold start"
          body="With zero interaction history, there is nothing for the model to learn from, so it can't produce a meaningful ranking for new users."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        className="mt-6 rounded-xl border border-border p-5 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <GitMerge className="size-4 text-chart-3" strokeWidth={1.75} />
              The combined ranking criterion adapts per user
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              final_score = α × semantic + (1 − α) × behavioral
            </p>
          </div>
          <div className="flex shrink-0 gap-1 rounded-full bg-muted p-1">
            {USER_STATES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStateKey(s.key)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  stateKey === s.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {stateKey === "new"
            ? "This user just signed up — their id isn't in NCF's trained mappings yet, so the Behavioral Score falls back to a neutral 50% and α is held near its ceiling (0.90), letting the Semantic Score drive almost the entire ranking."
            : "This user has viewed, saved, and applied to jobs before — NCF now has a real preference signal, so α is lowered toward its floor (0.40) and the Behavioral Score pulls real weight in the final ranking. Even for the most active user, α never drops below 0.40 — behavioral weight is capped at 60%."}
        </p>

        <div className="mt-6">
          <WeightBubbles
            items={[
              { label: "Semantic weight (α)", value: state.alpha, display: `${Math.round(state.alpha * 100)}%`, colorClass: "bg-chart-1" },
              { label: "Behavioral weight (1 − α)", value: 1 - state.alpha, display: `${Math.round((1 - state.alpha) * 100)}%`, colorClass: "bg-chart-2" },
            ]}
          />
        </div>

        <div className="mt-6 rounded-lg bg-muted/50 p-5">
          <p className="text-center text-sm text-muted-foreground">
            {state.alpha.toFixed(2)} × {state.semantic} + {(1 - state.alpha).toFixed(2)} ×{" "}
            {state.behavioral}
          </p>
          <p className="mt-2 text-center text-4xl font-semibold tabular-nums text-foreground">
            <AnimatedNumber value={hybrid} duration={0.6} decimals={1} />%
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Match Score {stateKey === "new" ? "— cold start, semantic-led" : "— sharpened by behavior"}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.28, ease: "easeOut" }}
        className="mt-5 rounded-xl border border-border p-5 sm:p-6"
      >
        <div className="flex gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-chart-4/10">
            <Layers className="size-4.5 text-chart-4" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              A supporting criterion: the Skill Gap Score
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The same embeddings power a second computation. SBERT&rsquo;s 384
              dimensions aren&rsquo;t individually interpretable, so this isn&rsquo;t
              a per-dimension subtraction — for each skill the job requires, we
              find the user&rsquo;s closest-matching declared skill by meaning, and
              flag it as missing only if even that best match falls below a
              similarity threshold. It doesn&rsquo;t rank jobs higher or lower; it
              feeds course recommendations. Below is a target role — Senior
              Frontend Engineer — evaluated against this same user profile.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-6">
          <SkillGapTable rows={SKILL_GAP_ROWS} threshold={SKILL_GAP_SIMILARITY_THRESHOLD} />
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {SKILL_GAPS[0]?.skill}
            </span>{" "}
            has the lowest similarity ({SKILL_GAPS[0]?.similarity.toFixed(2)}) →
            this is what the Skill Gap Analyzer surfaces first, and maps to a
            recommended course. Note &ldquo;TypeScript&rdquo; survives — close
            enough to the user&rsquo;s declared &ldquo;JavaScript&rdquo; to not
            count as missing, even though the strings don&rsquo;t match.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function CriterionCard({ icon: Icon, accent, accentBg, label, name, measures, computed, why, reference, visual }) {
  return (
    <div className="rounded-xl border border-border p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
        <div>
          <span className={cn("flex size-10 items-center justify-center rounded-lg", accentBg)}>
            <Icon className={cn("size-5", accent)} strokeWidth={1.75} />
          </span>
          <p className="mt-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <h2 className="mt-1 text-base font-semibold text-foreground">{name}</h2>

          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">What it measures</dt>
              <dd className="mt-0.5 text-foreground">{measures}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">How it&rsquo;s computed</dt>
              <dd className="mt-0.5 text-muted-foreground">{computed}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Why this algorithm</dt>
              <dd className="mt-0.5 text-muted-foreground">{why}</dd>
            </div>
          </dl>

          <p className="mt-4 text-[11px] text-muted-foreground">{reference}</p>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-5">{visual}</div>
      </div>
    </div>
  );
}

function FailureCallout({ title, body }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
