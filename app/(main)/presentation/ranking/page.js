"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, GitMerge, Layers, Network, ScanText } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/algorithms/animated-number";

const USER_STATES = [
  { key: "new", label: "Brand-new user", alpha: 1, semantic: 88, behavioral: 0 },
  { key: "active", label: "Active user", alpha: 0.35, semantic: 88, behavioral: 95 },
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

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
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
        className="mt-8 rounded-xl border border-border p-5 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <WeightMeter
            label="Semantic weight (α)"
            value={state.alpha * 100}
            colorClass="bg-chart-1"
          />
          <WeightMeter
            label="Behavioral weight (1 − α)"
            value={(1 - state.alpha) * 100}
            colorClass="bg-chart-2"
          />
        </div>

        <div className="mt-5 rounded-lg bg-muted/50 p-5">
          <p className="text-center text-sm text-muted-foreground">
            {state.alpha.toFixed(2)} × {state.semantic} + {(1 - state.alpha).toFixed(2)} ×{" "}
            {state.behavioral}
          </p>
          <p className="mt-2 text-center text-4xl font-semibold tabular-nums text-foreground">
            <AnimatedNumber value={hybrid} duration={0.6} decimals={1} />%
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Match Score {stateKey === "new" ? "— cold start, semantic-only" : "— sharpened by behavior"}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.28, ease: "easeOut" }}
        className="mt-5 flex gap-4 rounded-xl border border-border p-5 sm:p-6"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-chart-4/10">
          <Layers className="size-4.5 text-chart-4" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            A supporting criterion: the Skill Gap Score
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The same embeddings power a second computation — vector
            subtraction between a job’s requirement vector and the
            user’s profile vector isolates the dimensions least
            represented in the user’s profile. It doesn’t rank jobs
            higher or lower; it feeds course recommendations, reusing the
            same underlying representation for a second purpose instead of
            requiring a separate system.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function CriterionCard({ icon: Icon, accent, accentBg, label, name, measures, computed, why, reference }) {
  return (
    <div className="rounded-xl border border-border p-5 sm:p-6">
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

function WeightMeter({ label, value, colorClass }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-semibold tabular-nums text-foreground">
          <AnimatedNumber value={value} duration={0.6} decimals={0} />%
        </p>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
    </div>
  );
}
