"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";
import { StepTabs } from "./step-tabs";

export const INTERACTION_TYPES = [
  { key: "view", label: "View", weight: 1 },
  { key: "save", label: "Save", weight: 3 },
  { key: "apply", label: "Apply", weight: 5 },
  { key: "dismiss", label: "Dismiss", weight: -2 },
];

// Mirrors lib/data.js: jobs' savedState + applications pipeline status.
export const HISTORY = [
  { job: "Frontend Developer — Shopee", interactions: ["view"] },
  { job: "Product Designer — Canva", interactions: ["view", "save", "apply"] },
  { job: "UI Engineer — Kumu", interactions: ["view", "save", "apply"] },
  { job: "Web Developer — PayMongo", interactions: ["view", "dismiss"] },
];

export const TARGET_SCORE = 95; // matches jobs[frontend-shopee].collaborativeScore
export const COLD_START_SCORE = 50; // COLD_START_COLLABORATIVE_SCORE = 0.5, flat fallback

const STEPS = [
  { key: "history", label: "1. Behavior history" },
  { key: "weight", label: "2. Weight the signals" },
  { key: "network", label: "3. Learn through the network" },
  { key: "predict", label: "4. Predict the score" },
  { key: "cold-start", label: "5. Cold start" },
];

export function engagementScore(interactions) {
  return interactions.reduce((sum, key) => {
    const type = INTERACTION_TYPES.find((t) => t.key === key);
    return sum + (type?.weight ?? 0);
  }, 0);
}

export function NcfDemo() {
  const [step, setStep] = useState(0);
  const showWeights = step >= 1;
  const showNetwork = step >= 2;
  const showPredict = step >= 3;
  const showColdStart = step >= 4;

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <StepTabs steps={STEPS} step={step} onSelect={setStep} />

      <InteractionTable showWeights={showWeights} />

      <AnimatePresence>
        {showNetwork ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            <NetworkDiagram />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showPredict ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-lg bg-muted/50 p-5 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Predicted fit for{" "}
              <span className="font-medium text-foreground">
                Frontend Developer — Shopee
              </span>{" "}
              — a job this user has only viewed
            </p>
            <p className="mt-1 text-4xl font-semibold tabular-nums text-foreground">
              <AnimatedNumber value={TARGET_SCORE} duration={1.1} />%
            </p>
            <p className="text-xs text-muted-foreground">Collaborative Score</p>
            <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
              The network generalizes from this user&rsquo;s own save/apply
              pattern and from similar users&rsquo; histories, so it can score
              a job before this user ever saves or applies to it.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showColdStart ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 grid gap-3 sm:grid-cols-2"
          >
            <div className="rounded-lg border border-border bg-muted/50 p-5 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                A user/job pair the network has seen before
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                {TARGET_SCORE}%
              </p>
              <p className="text-xs text-muted-foreground">
                full GMF + MLP forward pass runs
              </p>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                A brand-new signup, or a job ingested after training
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                {COLD_START_SCORE}%
              </p>
              <p className="text-xs text-muted-foreground">
                neither id is in <code className="font-mono">id_mappings.json</code> —
                the forward pass never runs
              </p>
            </div>
            <p className="col-span-full mx-auto max-w-lg text-xs text-muted-foreground">
              This isn&rsquo;t a worse prediction — it&rsquo;s a deliberate flat 0.5
              fallback instead of a confident but fabricated number. Angkop&rsquo;s
              Hybrid Score leans on the Semantic Score instead while a user or job
              is this new (see Hybrid Ranking).
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function InteractionTable({ showWeights }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-105 border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3 font-medium">Job</th>
            {INTERACTION_TYPES.map((type) => (
              <th key={type.key} className="px-2 py-2 text-center font-medium">
                {type.label}
                {showWeights ? (
                  <span className="ml-1 font-mono text-[10px] text-primary">
                    ×{type.weight}
                  </span>
                ) : null}
              </th>
            ))}
            {showWeights ? (
              <th className="px-2 py-2 text-center font-medium">Engagement</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {HISTORY.map((row, ri) => (
            <tr key={row.job} className="border-b border-border/60 last:border-0">
              <td className="py-2.5 pr-3 text-foreground">{row.job}</td>
              {INTERACTION_TYPES.map((type) => (
                <td key={type.key} className="px-2 py-2.5 text-center">
                  {row.interactions.includes(type.key) ? (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, delay: ri * 0.15 }}
                      className="inline-flex size-2 rounded-full bg-primary"
                    />
                  ) : (
                    <span className="inline-flex size-2 rounded-full bg-border" />
                  )}
                </td>
              ))}
              {showWeights ? (
                <td className="px-2 py-2.5 text-center font-mono text-xs font-medium text-foreground">
                  {engagementScore(row.interactions) >= 0 ? "+" : ""}
                  {engagementScore(row.interactions)}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Node({ label, tone = "muted" }) {
  return (
    <div
      className={cn(
        "rounded-md border px-2.5 py-1.5 text-center text-[11px] leading-tight",
        tone === "primary"
          ? "border-primary/30 bg-primary/10 text-primary font-medium"
          : "border-border bg-muted/50 text-muted-foreground"
      )}
    >
      {label}
    </div>
  );
}

function Pulse({ color = "bg-chart-2", delay = 0 }) {
  return (
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, delay, ease: "easeInOut" }}
      className={cn("mx-auto block size-2 rounded-full", color)}
    />
  );
}

// Mirrors ml/app/models/ncf.py — the two-tower NeuMF architecture, not a
// plain dense net: a GMF branch (element-wise product) running in parallel
// with an MLP branch (concat through two dense layers), merged at the end.
function NetworkDiagram() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-muted-foreground">
        NeuMF — two branches in parallel, per{" "}
        <span className="font-mono text-[11px]">ml/app/models/ncf.py</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            GMF branch
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Node label="user embedding (8)" />
            <Node label="item embedding (8)" />
          </div>
          <div className="my-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Pulse color="bg-chart-1" />
            <span>× element-wise</span>
            <Pulse color="bg-chart-1" delay={0.3} />
          </div>
          <Node label="GMF output (8)" tone="primary" />
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            MLP branch
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Node label="user embedding (8)" />
            <Node label="item embedding (8)" />
          </div>
          <div className="my-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Pulse color="bg-chart-2" delay={0.15} />
            <span>concat → Linear(16→16) → ReLU</span>
          </div>
          <div className="mb-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Pulse color="bg-chart-2" delay={0.45} />
            <span>Linear(16→8) → ReLU</span>
          </div>
          <Node label="MLP output (8)" tone="primary" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="h-5 w-px bg-border" />
        <Node label="concat(GMF output, MLP output) → Linear(16→1) → sigmoid" />
        <div className="h-5 w-px bg-border" />
        <Node label="collaborative_score ∈ [0, 1]" tone="primary" />
      </div>
    </div>
  );
}

