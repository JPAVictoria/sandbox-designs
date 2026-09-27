"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePlayOnce } from "./use-play-once";
import { AnimatedNumber } from "./animated-number";
import { ReplayButton } from "./replay-button";

const PROFILE_TEXT =
  "Fresh CS graduate skilled in JavaScript, React, HTML/CSS, Figma, Git, and REST APIs, looking for a frontend developer role.";

const JOB_TEXT =
  "Build and maintain customer-facing storefront components. Work with JavaScript, React, HTML/CSS, and REST APIs on a two-week release cadence.";

// Deterministic toy embeddings so the same run always tells the same story.
// Real Angkop uses 384-dim Sentence-BERT vectors — these 12 bars stand in for
// a handful of representative dimensions.
const PROFILE_VECTOR = [0.8, 0.3, 0.9, 0.2, 0.7, 0.4, 0.85, 0.15, 0.6, 0.3, 0.75, 0.5];
const JOB_VECTOR = [0.75, 0.35, 0.8, 0.25, 0.65, 0.3, 0.9, 0.1, 0.55, 0.4, 0.7, 0.45];

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
function magnitude(a) {
  return Math.sqrt(dot(a, a));
}
const COSINE_SIM = dot(PROFILE_VECTOR, JOB_VECTOR) / (magnitude(PROFILE_VECTOR) * magnitude(JOB_VECTOR));
const SEMANTIC_SCORE = Math.round(COSINE_SIM * 100);

const STEPS = [
  { key: "read", label: "1. Read the text", duration: 3200 },
  { key: "tokenize", label: "2. Tokenize", duration: 2200 },
  { key: "encode", label: "3. Encode into embeddings", duration: 2600 },
  { key: "compare", label: "4. Compare with cosine similarity", duration: 3400 },
];

const DURATIONS = STEPS.map((s) => s.duration);

function tokenize(text) {
  return text.split(/(\s+)/).filter((chunk) => chunk.trim().length > 0);
}

export function SbertDemo() {
  const [step, replay] = usePlayOnce(STEPS.length, DURATIONS);
  const profileTokens = useMemo(() => tokenize(PROFILE_TEXT), []);
  const jobTokens = useMemo(() => tokenize(JOB_TEXT), []);

  const showTokens = step >= 1;
  const showVectors = step >= 2;
  const showCompare = step >= 3;

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          ))}
        </div>
        <ReplayButton onClick={replay} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TextPanel
          title="Your Profile"
          tokens={profileTokens}
          highlight={showTokens}
        />
        <TextPanel
          title="Job Description — Frontend Developer, Shopee"
          tokens={jobTokens}
          highlight={showTokens}
        />
      </div>

      <AnimatePresence>
        {showVectors ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 grid gap-5 overflow-hidden lg:grid-cols-2"
          >
            <VectorPanel label="Profile embedding" vector={PROFILE_VECTOR} colorClass="bg-chart-1" />
            <VectorPanel label="Job embedding" vector={JOB_VECTOR} colorClass="bg-chart-4" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCompare ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex flex-col items-center gap-3 rounded-lg bg-muted/50 p-5 text-center"
          >
            <p className="text-sm text-muted-foreground">
              cosine similarity(profile, job) ={" "}
              <span className="font-mono text-foreground">
                (A·B) / (‖A‖‖B‖)
              </span>
            </p>
            <p className="text-4xl font-semibold tabular-nums text-foreground">
              <AnimatedNumber value={SEMANTIC_SCORE} duration={1.1} />%
            </p>
            <p className="text-xs text-muted-foreground">Semantic Score</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function TextPanel({ title, tokens, highlight }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      <p className="text-sm leading-relaxed">
        {tokens.map((token, i) => (
          <motion.span
            key={`${token}-${i}`}
            animate={{
              backgroundColor: highlight
                ? "var(--color-accent)"
                : "transparent",
              color: highlight ? "var(--color-accent-foreground)" : "var(--color-foreground)",
            }}
            transition={{ duration: 0.25, delay: highlight ? i * 0.03 : 0 }}
            className="rounded px-0.5"
          >
            {token}{" "}
          </motion.span>
        ))}
      </p>
    </div>
  );
}

function VectorPanel({ label, vector, colorClass }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex h-16 items-end gap-1">
        {vector.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${v * 100}%` }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
            className={cn("w-full rounded-sm", colorClass)}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        12 of 384 dimensions shown
      </p>
    </div>
  );
}
