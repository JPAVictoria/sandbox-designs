"use client";

import { motion } from "framer-motion";
import { HybridDemo, collaborativeWeight } from "@/components/algorithms/hybrid-demo";

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
          shown on every job card, weighted by how much interaction history
          you have, then re-sorts the whole list around it. Step through the
          three tabs below to see it happen — try the slider in step 1.
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
    { title: "Frontend Developer — Shopee", semantic: 96, collaborative: 95 },
    { title: "UI Engineer — Kumu", semantic: 90, collaborative: 85 },
    { title: "Web Developer — PayMongo", semantic: 83, collaborative: 88 },
  ];
  const interactionCount = 3;
  const w = collaborativeWeight(interactionCount);

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs">
      <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">
        The weighted blend, across three jobs
      </h2>
      <p className="mb-2 text-muted-foreground">
        w = min(0.10 + 0.05 × interactions, 0.60) — at {interactionCount}{" "}
        interactions, w = {w.toFixed(2)}
      </p>
      <p className="mb-2 text-muted-foreground">
        Match Score = (1 − w) × Semantic + w × Collaborative
      </p>
      <div className="space-y-1.5 text-foreground">
        {rows.map((row) => {
          const hybrid = (1 - w) * row.semantic + w * row.collaborative;
          return (
            <p key={row.title}>
              {row.title}: {(1 - w).toFixed(2)}×{row.semantic} + {w.toFixed(2)}×{row.collaborative} ={" "}
              <span className="font-semibold text-primary">{hybrid.toFixed(1)}%</span>
            </p>
          );
        })}
      </div>
      <p className="mt-3 font-sans text-[11px] text-muted-foreground">
        w is never fixed at 0.5 — it ramps from a 0.10 floor (Cold Start) to a
        0.60 ceiling as this user&rsquo;s own interaction count grows, per
        interaction (+0.05 each), capped at the ceiling past 10.
      </p>
    </div>
  );
}
