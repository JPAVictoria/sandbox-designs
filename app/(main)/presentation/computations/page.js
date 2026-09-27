"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StepTabs } from "@/components/algorithms/step-tabs";

const STEPS = [
  {
    key: "embed",
    label: "1. Embeddings",
    title: "Step 1 — Embedding Generation (SBERT)",
    formula: [
      "embed(user_skills) = U ∈ ℝ³⁸⁴",
      "embed(job_description) = J ∈ ℝ³⁸⁴",
    ],
    note: "Both the user's skill profile text and the job description text pass through pretrained SBERT (all-MiniLM-L6-v2), each producing a 384-number vector capturing different aspects of its meaning.",
  },
  {
    key: "cosine",
    label: "2. Cosine similarity",
    title: "Step 2 — Semantic Similarity Score",
    formula: ["sim(U, J) = (U · J) / (‖U‖ × ‖J‖)"],
    note: "U · J is the dot product of the two vectors; ‖U‖ and ‖J‖ are their Euclidean norms. The result sits between −1 and 1 — semantically related SBERT embeddings land closer to 1.",
  },
  {
    key: "neumf",
    label: "3. NeuMF",
    title: "Step 3 — Personalized Behavioral Score (NeuMF)",
    formula: [
      "φ_GMF = p_u ⊙ q_j",
      "φ_MLP = ReLU(W_L · z_(L−1) + b_L)",
      "ŷ(u, j) = sigmoid(hᵀ · [φ_GMF ; φ_MLP])",
    ],
    note: "A user latent vector p_u and a job latent vector q_j feed two branches — a Generalized Matrix Factorization term and a Multi-Layer Perceptron — combined and squashed by sigmoid into a 0–1 preference score.",
  },
  {
    key: "labels",
    label: "4. Feedback labels",
    title: "Step 4 — Weighted Implicit Feedback Labels",
    formula: [
      "w(view) = 1",
      "w(save) = 3",
      "w(applied) = 5",
      "w(dismissed) = −1",
    ],
    note: "The training signal for NeuMF: an ordinal weighting where an application counts more than a save, which counts more than a view, with a dismissal treated as an explicit negative signal.",
  },
  {
    key: "hybrid",
    label: "5. Hybrid score",
    title: "Step 5 — Hybrid Ranking Score",
    formula: ["final_score(u, j) = α × sim(U, J) + (1 − α) × ŷ(u, j)"],
    note: "For a brand-new user, α ≈ 1 (semantic-only, solving cold start). As logged interactions accumulate, α decreases so the personalized NCF score contributes more. Jobs are then sorted by final_score.",
  },
  {
    key: "gap",
    label: "6. Skill gap",
    title: "Step 6 — Skill Gap Computation",
    formula: ["gap_vector = J − U"],
    note: "The dimensions of the resulting vector with the largest positive magnitude correspond to job requirements least represented in the user's profile — mapped to skill clusters, then to course recommendations.",
  },
  {
    key: "eval",
    label: "7. Evaluation",
    title: "Step 7 — Evaluation Computations",
    formula: [
      "Precision@K = relevant in top K / K",
      "Recall@K = relevant in top K / total relevant",
      "Weighted Mean = Σ(f × w) / Σf",
    ],
    note: "Precision@K and Recall@K measure ranking quality; the Weighted Mean is the ISO/IEC 25010 treatment applied to the 40 respondents' (30 job seekers, 10 IT/AI experts) Likert-scale evaluation scores.",
  },
];

const SUMMARY = [
  { computation: "Cosine similarity", purpose: "Measures semantic (meaning-based) fit", usedIn: "Ranking criterion 1" },
  { computation: "NeuMF (GMF + MLP)", purpose: "Predicts personalized preference from behavior", usedIn: "Ranking criterion 2" },
  { computation: "Weighted hybrid sum", purpose: "Combines both scores into one ranking", usedIn: "Final job ranking" },
  { computation: "Vector subtraction", purpose: "Finds missing skill dimensions", usedIn: "Skill gap detection" },
  { computation: "Precision@K / Recall@K", purpose: "Measures ranking quality", usedIn: "System evaluation" },
  { computation: "Weighted Mean", purpose: "Aggregates Likert-scale survey data", usedIn: "ISO 25010 evaluation" },
];

export default function ComputationsPage() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Question 3
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          The computations, formally
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          The actual mathematical operations behind a single match request,
          in the order they run. Step through them below.
        </p>
      </motion.div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-8">
        <StepTabs steps={STEPS} step={step} onSelect={setStep} />

        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <h2 className="text-sm font-semibold text-foreground">{current.title}</h2>
          <div className="mt-3 space-y-1.5 rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground">
            {current.formula.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{current.note}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
        className="mt-8"
      >
        <h2 className="text-sm font-semibold text-foreground">Quick-reference summary</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Computation</th>
                <th className="px-4 py-2.5 font-medium">Purpose</th>
                <th className="px-4 py-2.5 font-medium">Where it&rsquo;s used</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY.map((row, index) => (
                <tr
                  key={row.computation}
                  className={index % 2 === 1 ? "bg-muted/20" : undefined}
                >
                  <td className="border-t border-border px-4 py-2.5 font-medium text-foreground">
                    {row.computation}
                  </td>
                  <td className="border-t border-border px-4 py-2.5 text-muted-foreground">
                    {row.purpose}
                  </td>
                  <td className="border-t border-border px-4 py-2.5 text-muted-foreground">
                    {row.usedIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
