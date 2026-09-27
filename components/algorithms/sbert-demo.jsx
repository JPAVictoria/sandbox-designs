"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "./animated-number";
import { StepTabs } from "./step-tabs";

const JOB_TEXT =
  "Build and maintain customer-facing storefront components used by millions of shoppers. Work closely with design and backend teams to ship features on a two-week release cadence.";

const PROFILE_SKILLS = ["JavaScript", "React", "HTML/CSS", "Figma", "Git", "REST APIs"];

// A handful of content-bearing words from the paragraph, each given a
// hand-illustrative "how much does this word matter" weight. Real
// Sentence-BERT doesn't score individual words like this — it produces one
// 384-number vector for the whole sentence at once — but weighting a few
// salient words is a readable stand-in for which parts of the text end up
// shaping that vector the most.
const WORD_WEIGHTS = {
  "customer-facing": 0.72,
  storefront: 0.88,
  components: 0.93,
  millions: 0.35,
  shoppers: 0.45,
  design: 0.8,
  backend: 0.7,
  teams: 0.4,
  features: 0.75,
  release: 0.5,
  cadence: 0.3,
};

// A fixed reference point standing in for the profile's own embedding, in
// the same 11 dimensions as the weights above.
const PROFILE_VECTOR = [0.55, 0.6, 0.85, 0.7, 0.2, 0.9, 0.4, 0.65, 0.55, 0.3, 0.6];
const JOB_VECTOR = Object.values(WORD_WEIGHTS);

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
function magnitude(a) {
  return Math.sqrt(dot(a, a));
}
const COSINE_SIM = dot(JOB_VECTOR, PROFILE_VECTOR) / (magnitude(JOB_VECTOR) * magnitude(PROFILE_VECTOR));
const SEMANTIC_SCORE = Math.round(COSINE_SIM * 100);

const STEPS = [
  { key: "read", label: "1. Read the job description" },
  { key: "measure", label: "2. Measure each word" },
  { key: "encode", label: "3. Encode into an embedding" },
  { key: "score", label: "4. Score against your profile" },
];

function cleanWord(token) {
  return token.toLowerCase().replace(/[.,!?;:]+$/, "");
}

function tokenize(text) {
  return text.split(/(\s+)/).filter((chunk) => chunk.trim().length > 0);
}

export function SbertDemo() {
  const [step, setStep] = useState(0);
  const tokens = useMemo(() => tokenize(JOB_TEXT), []);

  const showWeights = step >= 1;
  const showEmbedding = step >= 2;
  const showScore = step >= 3;

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
      <StepTabs steps={STEPS} step={step} onSelect={setStep} />

      <div className="rounded-lg border border-border p-4 sm:p-6">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          Job Description — Frontend Developer, Shopee
        </p>
        <motion.p
          animate={{ opacity: showEmbedding ? 0.35 : 1 }}
          transition={{ duration: 0.4 }}
          className="text-sm leading-relaxed sm:text-base"
        >
          {tokens.map((token, i) => {
            const weight = WORD_WEIGHTS[cleanWord(token)];
            if (weight === undefined) {
              return <span key={i}>{token} </span>;
            }
            return (
              <span key={i} className="relative inline-block">
                <motion.span
                  animate={{
                    backgroundColor: showWeights ? "var(--color-accent)" : "transparent",
                    color: showWeights ? "var(--color-accent-foreground)" : "var(--color-foreground)",
                  }}
                  transition={{ duration: 0.25 }}
                  className="rounded px-0.5"
                >
                  {token}
                </motion.span>{" "}
                <AnimatePresence>
                  {showWeights ? (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-4 left-0 font-mono text-[10px] font-medium text-primary"
                    >
                      {weight.toFixed(2)}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </span>
            );
          })}
        </motion.p>

        <AnimatePresence>
          {showEmbedding ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex h-16 items-end gap-1.5">
                {JOB_VECTOR.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${v * 100}%` }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
                    className="w-full rounded-sm bg-chart-1"
                  />
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Each bar is one of the words measured above — in the real
                model this would be 384 numbers, not 11.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showScore ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex flex-col items-center gap-3 rounded-lg bg-muted/50 p-5 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Compared against your profile:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {PROFILE_SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-1 text-4xl font-semibold tabular-nums text-foreground">
              <AnimatedNumber value={SEMANTIC_SCORE} duration={1.1} />%
            </p>
            <p className="text-xs text-muted-foreground">Semantic Score</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
