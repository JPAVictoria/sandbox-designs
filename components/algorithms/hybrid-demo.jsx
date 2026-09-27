"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";
import { StepTabs } from "./step-tabs";

// Subset of lib/data.js jobs, shown shuffled before re-ranking by matchScore.
export const SHUFFLED_JOBS = [
  { id: "product-designer-canva", title: "Product Designer", company: "Canva", matchScore: 81 },
  { id: "frontend-jollibee-tech", title: "Frontend Engineer", company: "Jollibee Group Digital", matchScore: 79 },
  { id: "frontend-shopee", title: "Frontend Developer", company: "Shopee Philippines", matchScore: 92 },
  { id: "web-developer-paymongo", title: "Web Developer", company: "PayMongo", matchScore: 85 },
  { id: "ui-engineer-kumu", title: "UI Engineer", company: "Kumu", matchScore: 88 },
];

export const RANKED_JOBS = [...SHUFFLED_JOBS].sort((a, b) => b.matchScore - a.matchScore);

export const FEATURED = { title: "Frontend Developer — Shopee", semantic: 89, collaborative: 95, hybrid: 92 };
export const ALPHA = 0.5;

const STEPS = [
  { key: "inputs", label: "1. Two scores come in" },
  { key: "combine", label: "2. Combine them" },
  { key: "rank", label: "3. Re-rank the job list" },
];

export function HybridDemo() {
  const [step, setStep] = useState(0);
  const showCombine = step >= 1;
  const showRank = step >= 2;

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
                Match Score = {ALPHA} × Semantic + {1 - ALPHA} × Collaborative
              </p>
              <p className="mt-1 text-center text-sm font-mono text-muted-foreground">
                = {ALPHA} × {FEATURED.semantic} + {1 - ALPHA} × {FEATURED.collaborative}
              </p>
              <p className="mt-2 text-center text-4xl font-semibold tabular-nums text-foreground">
                <AnimatedNumber value={FEATURED.hybrid} duration={1} />%
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
            <RankedList />
          </motion.div>
        ) : null}
      </AnimatePresence>
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

function RankedList() {
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSorted(true), 900);
    return () => clearTimeout(id);
  }, []);

  const list = sorted ? RANKED_JOBS : SHUFFLED_JOBS;

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
