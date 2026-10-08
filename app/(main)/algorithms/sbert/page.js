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
          reads a paragraph of text, runs it through 6 transformer layers to
          get one contextual vector per token, mean-pools those into a single
          384-number vector, then scales it to unit length. Watch it happen
          to a profile and a job description side by side below, then see
          those two embeddings scored against each other.
        </p>
      </motion.div>

      <div className="mt-6">
        <SbertDemo />
      </div>

      <div className="mt-8">
        <SkillsTextSourcePanel />
      </div>

      <div className="mt-8">
        <PipelinePanel />
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

const SKILLS_TEXT_SOURCES = [
  { field: "headline", format: "as-is" },
  { field: "about", format: "as-is" },
  { field: "careerLevel", format: "lowercased, underscores → spaces" },
  { field: "skills", format: "“Skills: {name}, {name}, …”" },
  { field: "experience", format: "“{title} at {company} — {description}” per entry" },
  { field: "education", format: "“{degree} in {fieldOfStudy} from {school}” per entry" },
  { field: "projects", format: "“{name}: {description}” per entry" },
  { field: "certifications", format: "“{name} ({issuer})” per entry" },
  { field: "languages", format: "“Languages: {language}, {language}, …”" },
  { field: "preferences.desiredRoles", format: "“Looking for: {role}, {role}, …”" },
  { field: "preferences.preferredIndustries", format: "“Interested in: {industry}, {industry}, …”" },
];

function SkillsTextSourcePanel() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 sm:p-8">
      <h2 className="text-sm font-semibold text-foreground">
        Where &ldquo;Your Profile&rdquo; text actually comes from
      </h2>
      <p className="mt-1.5 max-w-2xl text-xs text-muted-foreground">
        The demo above shows one readable paragraph for clarity. The real{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono">userSkillsText</code>{" "}
        is built server-side (<code className="rounded bg-muted px-1 py-0.5 font-mono">buildSkillsText</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono">apps/server/src/graphql/resolvers/helpers.ts</code>)
        by concatenating up to 11 structured profile fields, in order, joined
        with &ldquo;. &rdquo; — recomputed whenever onboarding completes or
        the profile is edited:
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-110 border-collapse text-xs">
          <thead>
            <tr className="border-b border-border text-left text-[11px] text-muted-foreground">
              <th className="py-1.5 pr-3 font-medium">Profile field</th>
              <th className="py-1.5 font-medium">Becomes</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS_TEXT_SOURCES.map((row) => (
              <tr key={row.field} className="border-b border-border/60 last:border-0">
                <td className="py-1.5 pr-3 font-mono text-foreground">{row.field}</td>
                <td className="py-1.5 font-mono text-muted-foreground">{row.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Not included: location/job-type/salary preferences, willing-to-relocate
        flags, and date fields — structured filters a sentence embedding
        can&rsquo;t meaningfully represent, so they don&rsquo;t feed the
        Semantic Score. The job side stays simple by comparison — just{" "}
        <span className="font-mono">&ldquo;{"{title}"}. {"{description}"}&rdquo;</span>.
      </p>
    </div>
  );
}

const PIPELINE_STAGES = [
  {
    title: "1. Tokenize",
    detail: "WordPiece splits the sentence into subword tokens and adds [CLS]/[SEP].",
    example: "[CLS] react develop ##er with 2 years experience [SEP]",
  },
  {
    title: "2. Encode (×6 transformer layers)",
    detail:
      "Self-attention lets every token absorb context from every other token — \"developer\" ends up shaped by \"React\" being nearby.",
    example: "one 384-dim vector per token, contextualized",
  },
  {
    title: "3. Mean-pool",
    detail:
      "Average every token's vector together (masking padding) into one sentence vector — not just the [CLS] token.",
    example: "pooled = mean(v₀, v₁, v₂, …) → [0.5333, 0.3000, -0.0333, 0.2333]",
  },
  {
    title: "4. L2 normalize",
    detail:
      "Scale the pooled vector to unit length — this is what lets cosine similarity become a plain dot product.",
    example: "normalized = [0.8133, 0.4575, -0.0508, 0.3558]  (‖·‖ = 1)",
  },
];

function PipelinePanel() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 sm:p-8">
      <h2 className="text-sm font-semibold text-foreground">
        Under the hood — what one &ldquo;encode&rdquo; call actually does
      </h2>
      <p className="mt-1.5 max-w-2xl text-xs text-muted-foreground">
        The demo above treats each word&rsquo;s importance as a single bar for
        readability. The real model gets to a 384-number vector through four
        distinct stages — shown here at 4 dimensions instead of 384, worked
        out by hand.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.title} className="relative rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-foreground">{stage.title}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{stage.detail}</p>
            <p className="mt-2.5 rounded bg-muted px-2 py-1.5 font-mono text-[10px] break-words text-foreground">
              {stage.example}
            </p>
            {i < PIPELINE_STAGES.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-1/2 -right-2.5 hidden size-5 -translate-y-1/2 items-center justify-center text-muted-foreground sm:flex"
              >
                →
              </span>
            ) : null}
          </div>
        ))}
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
          {magB.toFixed(3)}) = {cos.toFixed(3)}
        </p>
        <p>
          semantic_score = max(0, {cos.toFixed(3)}) ={" "}
          <span className="font-semibold text-primary">
            {Math.max(0, cos).toFixed(3)} → {Math.round(Math.max(0, cos) * 100)}%
          </span>
        </p>
      </div>
      <p className="mt-3 font-sans text-[11px] text-muted-foreground">
        The real model uses 384 dimensions per sentence, pre-normalized to
        unit length at embedding time (see &ldquo;Under the hood&rdquo; below)
        — the shape of the formula above is identical, just with much longer
        vectors, and the 0-floor clamp always applies before this number is
        shown as a %.
      </p>
    </div>
  );
}
