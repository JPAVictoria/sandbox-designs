"use client";

import { motion } from "framer-motion";
import { HybridDemo } from "@/components/algorithms/hybrid-demo";

export default function HybridPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Hybrid Ranking — Semantic + Collaborative
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          One Match Score, two models
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Sentence-BERT knows whether a job means what your profile says.
          NCF knows what you personally tend to engage with. Hybrid Ranking
          combines both into the single{" "}
          <span className="font-medium text-foreground">Match Score</span>{" "}
          shown on every job card, then re-sorts the whole list around it.
          Step through the three tabs below to see it happen.
        </p>
      </motion.div>

      <div className="mt-6">
        <HybridDemo />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Why this matters for Angkop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Neither signal alone is enough: semantic similarity misses a
            user&rsquo;s personal preferences, and collaborative filtering
            alone can&rsquo;t judge a job it has no interaction history for
            yet. Combining both means a brand-new posting can still rank well
            for the right user on day one, based on its meaning, while
            returning users get rankings sharpened by their own behavior.
          </p>
        </div>
        <ComputationPanel />
      </div>
    </div>
  );
}

function ComputationPanel() {
  const rows = [
    { title: "Frontend Developer — Shopee", semantic: 89, collaborative: 95 },
    { title: "UI Engineer — Kumu", semantic: 90, collaborative: 85 },
    { title: "Web Developer — PayMongo", semantic: 83, collaborative: 88 },
  ];
  const alpha = 0.5;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs">
      <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">
        The weighted average, across three jobs
      </h2>
      <p className="mb-2 text-muted-foreground">
        Match Score = α × Semantic + (1 − α) × Collaborative, α = {alpha}
      </p>
      <div className="space-y-1.5 text-foreground">
        {rows.map((row) => {
          const hybrid = alpha * row.semantic + (1 - alpha) * row.collaborative;
          return (
            <p key={row.title}>
              {row.title}: {alpha}×{row.semantic} + {1 - alpha}×{row.collaborative} ={" "}
              <span className="font-semibold text-primary">{hybrid.toFixed(1)}%</span>
            </p>
          );
        })}
      </div>
      <p className="mt-3 font-sans text-[11px] text-muted-foreground">
        Angkop&rsquo;s actual weighting is learned rather than a fixed 50/50
        split, so it can lean more on the semantic score for a Cold Start
        user and more on the collaborative score for an active one.
      </p>
    </div>
  );
}
