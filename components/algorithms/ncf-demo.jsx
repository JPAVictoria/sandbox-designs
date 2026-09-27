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

const STEPS = [
  { key: "history", label: "1. Behavior history" },
  { key: "weight", label: "2. Weight the signals" },
  { key: "network", label: "3. Learn through the network" },
  { key: "predict", label: "4. Predict the score" },
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

function NetworkDiagram() {
  const layers = [
    { count: 4, label: "Interaction signals" },
    { count: 3, label: "Hidden layer" },
    { count: 1, label: "Predicted score" },
  ];

  return (
    <div className="flex items-center">
      {layers.map((layer, li) => (
        <div key={li} className="flex flex-1 items-center">
          <div className="flex flex-1 flex-col items-center gap-2.5">
            <div className="flex flex-col items-center gap-2.5">
              {Array.from({ length: layer.count }).map((_, ni) => (
                <motion.span
                  key={ni}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: li * 0.3 + ni * 0.15,
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "size-3 rounded-full",
                    li === layers.length - 1 ? "bg-primary" : "bg-chart-2"
                  )}
                />
              ))}
            </div>
            <p className="text-center text-[11px] leading-tight text-muted-foreground">
              {layer.label}
            </p>
          </div>
          {li < layers.length - 1 ? <Rail /> : null}
        </div>
      ))}
    </div>
  );
}

function Rail() {
  return (
    <div className="relative mx-1 h-px w-10 shrink-0 bg-border sm:w-16">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.45,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
