"use client";

import { motion } from "framer-motion";
import { SbertDemo, PROFILE_VECTOR, JOB_VECTOR } from "@/components/algorithms/sbert-demo";

export default function SbertPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Semantic Matching — Sentence-BERT
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Understanding meaning, not just keywords
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Sentence-BERT (<code className="rounded bg-muted px-1 py-0.5 text-xs">all-MiniLM-L6-v2</code>)
          reads a paragraph of text and produces a 384-number vector that
          captures its meaning. Watch it happen to a profile and a job
          description side by side below, then see those two embeddings
          scored against each other.
        </p>
      </motion.div>

      <div className="mt-6">
        <SbertDemo />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Why this matters for Angkop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A candidate who lists &ldquo;front-end engineer&rdquo; experience
            and a posting asking for a &ldquo;React developer&rdquo; use
            different words for the same skill. Keyword search treats them as
            unrelated; Sentence-BERT&rsquo;s embeddings land close together
            because the underlying meaning matches. This is the{" "}
            <strong className="font-medium text-foreground">Semantic Score</strong>{" "}
            half of every job&rsquo;s Match Score.
          </p>
        </div>
        <ComputationPanel />
      </div>
    </div>
  );
}

const A = PROFILE_VECTOR;
const B = JOB_VECTOR;

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
function mag(a) {
  return Math.sqrt(dot(a, a));
}

function ComputationPanel() {
  const d = dot(A, B);
  const magA = mag(A);
  const magB = mag(B);
  const cos = d / (magA * magB);

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs">
      <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">
        The math, worked out for the demo above
      </h2>
      <p className="text-muted-foreground">A = [{A.join(", ")}] (profile)</p>
      <p className="text-muted-foreground">B = [{B.join(", ")}] (job)</p>
      <div className="mt-3 space-y-1.5 text-foreground">
        <p>
          A·B = {A.map((v, i) => `(${v}×${B[i]})`).join(" + ")} ={" "}
          <span className="font-semibold">{d.toFixed(3)}</span>
        </p>
        <p>
          ‖A‖ = √({A.map((v) => `${v}²`).join(" + ")}) = {magA.toFixed(3)}
        </p>
        <p>
          ‖B‖ = √({B.map((v) => `${v}²`).join(" + ")}) = {magB.toFixed(3)}
        </p>
        <p className="border-t border-border pt-1.5">
          cosine similarity = {d.toFixed(3)} / ({magA.toFixed(3)} ×{" "}
          {magB.toFixed(3)}) ={" "}
          <span className="font-semibold text-primary">
            {cos.toFixed(3)} → {Math.round(cos * 100)}%
          </span>
        </p>
      </div>
      <p className="mt-3 font-sans text-[11px] text-muted-foreground">
        The real model uses 384 dimensions per sentence — the shape of the
        formula above is identical, just with much longer vectors.
      </p>
    </div>
  );
}
