"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";
import { StepTabs } from "./step-tabs";
import { SEMANTIC_SCORE } from "./sbert-demo";
import { TARGET_SCORE } from "./ncf-demo";

// COLLABORATIVE_WEIGHT_FLOOR / CEILING / STEP_PER_INTERACTION, ml/app/config.py
export const COLLABORATIVE_WEIGHT_FLOOR = 0.1;
export const COLLABORATIVE_WEIGHT_CEILING = 0.6;
export const COLLABORATIVE_WEIGHT_STEP_PER_INTERACTION = 0.05;
export const MAX_DEMO_INTERACTIONS = 10;

export function collaborativeWeight(interactionCount) {
  return Math.min(
    COLLABORATIVE_WEIGHT_FLOOR + COLLABORATIVE_WEIGHT_STEP_PER_INTERACTION * interactionCount,
    COLLABORATIVE_WEIGHT_CEILING
  );
}

export function hybridScore(semantic, collaborative, interactionCount) {
  const w = collaborativeWeight(interactionCount);
  return w * collaborative + (1 - w) * semantic;
}

// Subset of lib/data.js jobs — semantic/collaborative scores are each job's
// two underlying signals; matchScore is derived live from the slider below,
// not stored, since collaborative_weight depends on the user, not the job.
export const JOBS = [
  { id: "product-designer-canva", title: "Product Designer", company: "Canva", semantic: 84, collaborative: 75 },
  { id: "frontend-jollibee-tech", title: "Frontend Engineer", company: "Jollibee Group Digital", semantic: 80, collaborative: 76 },
  { id: "frontend-shopee", title: "Frontend Developer", company: "Shopee Philippines", semantic: SEMANTIC_SCORE, collaborative: TARGET_SCORE },
  { id: "web-developer-paymongo", title: "Web Developer", company: "PayMongo", semantic: 83, collaborative: 88 },
  { id: "ui-engineer-kumu", title: "UI Engineer", company: "Kumu", semantic: 90, collaborative: 85 },
];

export const FEATURED = JOBS.find((j) => j.id === "frontend-shopee");

const STEPS = [
  { key: "inputs", label: "1. Two scores come in" },
  { key: "combine", label: "2. Combine them" },
  { key: "rank", label: "3. Re-rank the job list" },
];

export function HybridDemo() {
  const [step, setStep] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const showCombine = step >= 1;
  const showRank = step >= 2;

  const w = collaborativeWeight(interactions);
  const featuredHybrid = hybridScore(FEATURED.semantic, FEATURED.collaborative, interactions);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <StepTabs steps={STEPS} step={step} onSelect={setStep} />

      <p className="mb-4 text-xs text-muted-foreground">
        Featured job: <span className="font-medium text-foreground">{FEATURED.title}</span>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreMeter label="Semantic Score" sublabel="from Sentence-BERT" value={FEATURED.semantic} colorClass="bg-chart-1" />
        <ScoreMeter label="Collaborative Score" sublabel="from NCF" value={FEATURED.collaborative} colorClass="bg-chart-2" />
      </div>

      <div className="mt-5 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="interaction-slider" className="text-xs font-medium text-foreground">
            This user&rsquo;s past interactions
          </label>
          <span className="font-mono text-xs font-semibold text-primary">
            {interactions}
            {interactions >= MAX_DEMO_INTERACTIONS ? "+" : ""}
          </span>
        </div>
        <input
          id="interaction-slider"
          type="range"
          min={0}
          max={MAX_DEMO_INTERACTIONS}
          step={1}
          value={interactions}
          onChange={(e) => setInteractions(Number(e.target.value))}
          className="mt-3 w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>0 — cold start</span>
          <span>{MAX_DEMO_INTERACTIONS}+ — ceiling reached</span>
        </div>
        <WeightBar w={w} />
      </div>

      <AnimatePresence>
        {showCombine ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 overflow-hidden"
          >
            <div className="rounded-lg bg-muted/50 p-5">
              <p className="text-center text-sm text-muted-foreground">
                Match Score = (1 − w) × Semantic + w × Collaborative, w = {w.toFixed(2)}
              </p>
              <p className="mt-1 text-center text-sm font-mono text-muted-foreground">
                = {(1 - w).toFixed(2)} × {FEATURED.semantic} + {w.toFixed(2)} × {FEATURED.collaborative}
              </p>
              <p className="mt-2 text-center text-4xl font-semibold tabular-nums text-foreground">
                <AnimatedNumber value={featuredHybrid} duration={0.6} />%
              </p>
              <p className="text-center text-xs text-muted-foreground">Match Score</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showRank ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            <RankedList interactions={interactions} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function WeightBar({ w }) {
  return (
    <div className="mt-3">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          animate={{ width: `${(1 - w) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full bg-chart-1"
        />
        <motion.div
          animate={{ width: `${w * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full bg-chart-2"
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
        <span>Semantic weight {Math.round((1 - w) * 100)}%</span>
        <span>Collaborative weight {Math.round(w * 100)}%</span>
      </div>
    </div>
  );
}

function ScoreMeter({ label, sublabel, value, colorClass }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-[11px] text-muted-foreground">{sublabel}</p>
        </div>
        <p className="text-lg font-semibold tabular-nums text-foreground">
          <AnimatedNumber value={value} duration={1} />%
        </p>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
    </div>
  );
}

function RankedList({ interactions }) {
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSorted(true), 900);
    return () => clearTimeout(id);
  }, []);

  const scored = JOBS.map((job) => ({
    ...job,
    matchScore: Math.round(hybridScore(job.semantic, job.collaborative, interactions)),
  }));
  const list = sorted ? [...scored].sort((a, b) => b.matchScore - a.matchScore) : scored;

  return (
    <div>
      <p className="mb-2.5 text-xs text-muted-foreground">
        {sorted ? "Ranked by Match Score" : "Jobs as they were found"}
      </p>
      <div className="flex flex-col gap-1.5">
        {list.map((job) => (
          <motion.div
            layout
            key={job.id}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
          >
            <span className="w-10 shrink-0 text-sm font-semibold tabular-nums text-foreground">
              {job.matchScore}%
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
              <p className="truncate text-xs text-muted-foreground">{job.company}</p>
            </div>
            <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${job.matchScore}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
