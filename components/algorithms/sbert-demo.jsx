"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";

export const PROFILE_TEXT =
  "Fresh CS graduate skilled in JavaScript, React, HTML/CSS, Figma, Git, and REST APIs, looking for a frontend developer role.";

export const JOB_TEXT =
  "Build and maintain customer-facing storefront components used by millions of shoppers. Work closely with design and backend teams to ship features on a two-week release cadence.";

// Hand-illustrative "how much does this word matter" weights for a handful
// of content-bearing words in each paragraph, each with the criterion used
// to pick it. Real Sentence-BERT doesn't score individual words against a
// rubric like this — it produces one 384-number vector for the whole
// sentence at once — but this is a readable stand-in for which parts of the
// text end up shaping that vector the most.
export const PROFILE_WORDS = {
  graduate: { weight: 0.4, reason: "Role/context word, not a skill" },
  javascript: { weight: 0.9, reason: "Exact skill match" },
  react: { weight: 0.93, reason: "Exact skill match, high-demand" },
  "html/css": { weight: 0.85, reason: "Exact skill match" },
  figma: { weight: 0.7, reason: "Exact skill match, secondary tool" },
  git: { weight: 0.6, reason: "Exact skill match, common baseline" },
  frontend: { weight: 0.88, reason: "Role keyword, strong signal" },
  developer: { weight: 0.75, reason: "Role keyword" },
};

export const JOB_WORDS = {
  "customer-facing": { weight: 0.72, reason: "Product context, user-facing" },
  storefront: { weight: 0.88, reason: "Domain-specific, e-commerce UI" },
  components: { weight: 0.93, reason: "Maps directly to React/UI skill" },
  shoppers: { weight: 0.45, reason: "Audience descriptor, not a skill" },
  design: { weight: 0.8, reason: "Collaboration signal, relates to Figma" },
  backend: { weight: 0.7, reason: "Adjacent discipline, cross-team signal" },
  features: { weight: 0.75, reason: "Product/engineering keyword" },
  release: { weight: 0.5, reason: "Process term, weak skill signal" },
};

export const PROFILE_VECTOR = Object.values(PROFILE_WORDS).map((w) => w.weight);
export const JOB_VECTOR = Object.values(JOB_WORDS).map((w) => w.weight);

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
function magnitude(a) {
  return Math.sqrt(dot(a, a));
}
const COSINE_SIM = dot(JOB_VECTOR, PROFILE_VECTOR) / (magnitude(JOB_VECTOR) * magnitude(PROFILE_VECTOR));
export const SEMANTIC_SCORE = Math.round(COSINE_SIM * 100);

// Runs once on mount: read -> measure -> encode -> score. No loop, no
// buttons — it just plays through in one go.
const STEP_DELAYS = [1100, 1900, 1600];

function cleanWord(token) {
  return token.toLowerCase().replace(/[.,!?;:]+$/, "");
}

function tokenize(text) {
  return text.split(/(\s+)/).filter((chunk) => chunk.trim().length > 0);
}

export function SbertDemo() {
  const [step, setStep] = useState(0);
  const profileTokens = useMemo(() => tokenize(PROFILE_TEXT), []);
  const jobTokens = useMemo(() => tokenize(JOB_TEXT), []);

  useEffect(() => {
    let elapsed = 0;
    const timers = STEP_DELAYS.map((delay, i) => {
      elapsed += delay;
      return setTimeout(() => setStep(i + 1), elapsed);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const showWeights = step >= 1;
  const showEmbedding = step >= 2;
  const showScore = step >= 3;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <TextPanel
              title="Your Profile"
              tokens={profileTokens}
              words={PROFILE_WORDS}
              showWeights={showWeights}
            />
            <TextPanel
              title="Job Description — Frontend Developer, Shopee"
              tokens={jobTokens}
              words={JOB_WORDS}
              showWeights={showWeights}
            />
          </div>
        </div>

        <AnimatePresence>
          {showEmbedding ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
                <p className="mb-4 text-xs font-medium text-muted-foreground">
                  Embeddings — each bar is one of the words measured above (the
                  real model produces 384 numbers per sentence, not 8)
                </p>
                <div className="grid gap-5 lg:grid-cols-2">
                  <EmbeddingChart label="Profile embedding" vector={PROFILE_VECTOR} barColor="bg-chart-4" />
                  <EmbeddingChart label="Job embedding" vector={JOB_VECTOR} barColor="bg-chart-1" />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showScore ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/50 p-5 text-center sm:p-8">
                <p className="font-mono text-sm text-muted-foreground">
                  cosine similarity(profile, job) = (A·B) / (‖A‖‖B‖)
                </p>
                <p className="mt-1 text-4xl font-semibold tabular-nums text-foreground">
                  <AnimatedNumber value={SEMANTIC_SCORE} duration={1.1} />%
                </p>
                <p className="text-xs text-muted-foreground">Semantic Score</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <CriteriaPanel />
    </div>
  );
}

function TextPanel({ title, tokens, words, showWeights }) {
  return (
    <div className="rounded-lg border border-border p-4 sm:p-5">
      <p className="mb-3 text-xs font-medium text-muted-foreground">{title}</p>
      <p className="text-sm leading-loose">
        {tokens.map((token, i) => {
          const entry = words[cleanWord(token)];
          if (entry === undefined) {
            return <span key={i}>{token} </span>;
          }
          return (
            <span key={i}>
              <motion.span
                animate={{
                  backgroundColor: showWeights ? "var(--color-accent)" : "transparent",
                  color: showWeights ? "var(--color-accent-foreground)" : "var(--color-foreground)",
                }}
                transition={{ duration: 0.25 }}
                className="rounded px-0.5"
              >
                {token}
              </motion.span>
              <AnimatePresence>
                {showWeights ? (
                  <motion.sup
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-0.5 font-mono text-[10px] font-medium text-primary"
                  >
                    {entry.weight.toFixed(2)}
                  </motion.sup>
                ) : null}
              </AnimatePresence>{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
}

function EmbeddingChart({ label, vector, barColor }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex h-20 items-end gap-1.5">
        {vector.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${v * 100}%` }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
            className={cn("w-full rounded-sm", barColor)}
          />
        ))}
      </div>
    </div>
  );
}

function CriteriaPanel() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 lg:sticky lg:top-20">
      <p className="text-xs font-semibold text-foreground">Where these numbers come from</p>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Each measured word gets a weight from 0–1 based on one question: how
        specifically does this word name a skill, tool, or role — versus just
        describing context around it?
      </p>

      <WordList heading="Your Profile" words={PROFILE_WORDS} />
      <WordList heading="Job Description" words={JOB_WORDS} />
    </div>
  );
}

function WordList({ heading, words }) {
  return (
    <div className="mt-4">
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {heading}
      </p>
      <ul className="mt-1.5 space-y-2">
        {Object.entries(words).map(([word, { weight, reason }]) => (
          <li key={word} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 shrink-0 rounded bg-background px-1.5 py-0.5 font-mono font-medium text-primary">
              {weight.toFixed(2)}
            </span>
            <span>
              <span className="font-medium text-foreground">{word}</span>
              <span className="text-muted-foreground"> — {reason}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
