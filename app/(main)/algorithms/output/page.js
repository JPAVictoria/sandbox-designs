"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Braces, CheckCircle2, MessageSquareText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/algorithms/animated-number";
import {
  PROFILE_TEXT,
  JOB_TEXT,
  PROFILE_WORDS,
  JOB_WORDS,
  SEMANTIC_SCORE,
} from "@/components/algorithms/sbert-demo";
import { HISTORY, TARGET_SCORE, engagementScore } from "@/components/algorithms/ncf-demo";
import { collaborativeWeight, hybridScore } from "@/components/algorithms/hybrid-demo";
import { SkillGapTable, SKILL_GAP_SIMILARITY_THRESHOLD } from "@/components/presentation/mini-charts";

// Same running example used throughout Semantic Matching, Collaborative
// Filtering, and Hybrid Ranking — this page just shows what comes OUT the
// other end of all three, and why.
const INTERACTION_COUNT = 3;
const COLLABORATIVE_WEIGHT = collaborativeWeight(INTERACTION_COUNT);
const SEMANTIC_WEIGHT = 1 - COLLABORATIVE_WEIGHT;
const HYBRID = hybridScore(SEMANTIC_SCORE, TARGET_SCORE, INTERACTION_COUNT);

const MATCH_BAND =
  HYBRID >= 70
    ? { label: "Strong match", text: "text-chart-1", bg: "bg-chart-1/10" }
    : HYBRID >= 40
      ? { label: "Partial match", text: "text-chart-3", bg: "bg-chart-3/10" }
      : { label: "Weak match", text: "text-chart-5", bg: "bg-chart-5/10" };

function topWords(words, n = 3) {
  return Object.entries(words)
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, n);
}

// Per ml/app/routers/skill_gap.py — for a target role this user is pursuing
// (independent of the specific job above), not every declared skill clears
// the 0.50 similarity bar. Same example as Ranking Criteria / The
// Computations, kept consistent across pages.
const SKILL_GAP_ROWS = [
  { skill: "React / component architecture", bestMatch: "React", similarity: 0.91 },
  { skill: "TypeScript", bestMatch: "JavaScript", similarity: 0.62 },
  { skill: "System design", bestMatch: "React", similarity: 0.48 },
  { skill: "Automated testing (Jest)", bestMatch: "JavaScript", similarity: 0.41 },
  { skill: "CI/CD pipelines", bestMatch: "Git", similarity: 0.35 },
  { skill: "GraphQL", bestMatch: "JavaScript", similarity: 0.22 },
].sort((a, b) => a.similarity - b.similarity);
const SKILL_GAPS = SKILL_GAP_ROWS.filter((r) => r.similarity < SKILL_GAP_SIMILARITY_THRESHOLD);

// What jobRequiredSkills/matchingSkills/missingSkills would plausibly look
// like for THIS job, grounded in the same JOB_WORDS used on the Semantic
// Matching page — "components" and "design" land on declared skills
// (React, Figma); "backend" doesn't.
const MATCHING_SKILLS = ["Storefront components (React)", "Working closely with design (Figma)"];
const MISSING_SKILLS = ["Add backend coordination experience"];

export default function OutputPage() {
  const [view, setView] = useState("plain");

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Putting it together
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Why you see what you see
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Semantic Matching, Collaborative Filtering, and Hybrid Ranking are
          three separate stops. This page runs one real request through all
          of them — the same profile and job used on the previous three tabs
          — and shows exactly what comes back, and why each number is what
          it is.
        </p>
      </motion.div>

      <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs sm:p-6">
        <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">
          The request — POST /recommend
        </h2>
        <p className="text-muted-foreground">userId: &ldquo;u_42&rdquo;</p>
        <p className="text-muted-foreground">jobId: &ldquo;frontend-shopee&rdquo;</p>
        <p className="mt-1.5 text-muted-foreground break-words">
          userSkillsText: &ldquo;{PROFILE_TEXT}&rdquo;
        </p>
        <p className="mt-1.5 text-muted-foreground break-words">
          jobText: &ldquo;{JOB_TEXT}&rdquo;
        </p>
        <p className="mt-1.5 text-foreground">
          userInteractionCount: <span className="font-semibold text-primary">{INTERACTION_COUNT}</span>
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-foreground">The three scores that come back</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <ScoreCard label="Semantic Score" sublabel="from Sentence-BERT" value={SEMANTIC_SCORE} colorClass="bg-chart-1" />
          <ScoreCard label="Collaborative Score" sublabel="from NCF" value={TARGET_SCORE} colorClass="bg-chart-2" />
          <div className={cn("rounded-xl border border-border p-4", MATCH_BAND.bg)}>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Match Score</p>
                <p className="text-[11px] text-muted-foreground">hybrid of both</p>
              </div>
              <p className={cn("text-lg font-semibold tabular-nums", MATCH_BAND.text)}>
                <AnimatedNumber value={HYBRID} duration={1} decimals={1} />%
              </p>
            </div>
            <p className={cn("mt-2.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", MATCH_BAND.text)}>
              {MATCH_BAND.label}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <WhyCard title="Why the Semantic Score is high">
            <p>
              The profile and job text share several strongly-weighted
              concepts — top on each side:
            </p>
            <ul className="mt-2 space-y-1">
              {topWords(PROFILE_WORDS).map(([word, { weight }]) => (
                <li key={word} className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-foreground">{word}</span>
                  <span className="text-primary">{weight.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2">
              paired against the job&rsquo;s own{" "}
              {topWords(JOB_WORDS)
                .map(([w]) => w)
                .join(", ")}{" "}
              — see Semantic Matching for the full cosine similarity worked
              out.
            </p>
          </WhyCard>

          <WhyCard title="Why the Collaborative Score is high">
            <p>
              This user has only <em>viewed</em> Frontend Developer — Shopee
              — but NCF doesn&rsquo;t need direct history on this exact job.
              It generalizes from this user&rsquo;s own pattern on similar
              roles:
            </p>
            <ul className="mt-2 space-y-1">
              {HISTORY.filter((h) => engagementScore(h.interactions) > 1).map((h) => (
                <li key={h.job} className="font-mono text-[11px] text-foreground">
                  {h.job} — engagement {engagementScore(h.interactions) >= 0 ? "+" : ""}
                  {engagementScore(h.interactions)}
                </li>
              ))}
            </ul>
            <p className="mt-2">
              and from similar users&rsquo; histories — see Collaborative
              Filtering for the full GMF/MLP forward pass.
            </p>
          </WhyCard>

          <WhyCard title="Why the Match Score lands at this weight">
            <p className="font-mono text-[11px] text-foreground">
              w = min(0.10 + 0.05×{INTERACTION_COUNT}, 0.60) = {COLLABORATIVE_WEIGHT.toFixed(2)}
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-foreground">
              Match = {SEMANTIC_WEIGHT.toFixed(2)}×{SEMANTIC_SCORE} + {COLLABORATIVE_WEIGHT.toFixed(2)}×{TARGET_SCORE} = {HYBRID.toFixed(1)}
            </p>
            <p className="mt-2">
              At {INTERACTION_COUNT} logged interactions this user is still
              closer to Cold Start than the 10+ ceiling, so the Semantic
              Score still drives most of the result — see Hybrid Ranking to
              move the slider yourself.
            </p>
            <p className="mt-2">
              {HYBRID.toFixed(1)}% clears the 70% Strong-Match threshold, which
              is why it&rsquo;s shown in green as &ldquo;{MATCH_BAND.label}.&rdquo;
            </p>
          </WhyCard>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-foreground">
          A second, independent output — the skill gap
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Skill gaps are evaluated against a target role this user is
          pursuing, not necessarily the specific job above — this doesn&rsquo;t
          change the Match Score, it feeds Course Recommendations instead.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
          <SkillGapTable rows={SKILL_GAP_ROWS} threshold={SKILL_GAP_SIMILARITY_THRESHOLD} />
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{SKILL_GAPS[0]?.skill}</span>{" "}
            has the lowest similarity ({SKILL_GAPS[0]?.similarity.toFixed(2)}) — the
            strongest missing-skill signal, mapped to a course recommendation.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">
            A third output — explaining it in plain language
          </h2>
          <div className="flex shrink-0 gap-1 rounded-full bg-muted p-1">
            <ToggleButton active={view === "raw"} onClick={() => setView("raw")} icon={Braces}>
              Raw numbers
            </ToggleButton>
            <ToggleButton active={view === "plain"} onClick={() => setView("plain")} icon={MessageSquareText}>
              Plain language
            </ToggleButton>
          </div>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          This step never recomputes a score — Gemini takes the three numbers
          above as ground truth and translates them for someone who&rsquo;s
          never heard of an embedding, with the job description and profile
          text explicitly marked as untrusted data, not instructions.
        </p>

        <div className="mt-4 rounded-xl border border-border p-5 sm:p-6">
          {view === "raw" ? (
            <pre className="overflow-x-auto font-mono text-xs text-foreground">
{`{
  "semanticScore": ${(SEMANTIC_SCORE / 100).toFixed(2)},
  "collaborativeScore": ${(TARGET_SCORE / 100).toFixed(2)},
  "hybridScore": ${(HYBRID / 100).toFixed(3)},
  "collaborativeWeight": ${COLLABORATIVE_WEIGHT.toFixed(2)}
}`}
            </pre>
          ) : (
            <div className="space-y-4 text-sm">
              <p className="text-foreground">
                &ldquo;This looks like a strong fit. Your React and front-end
                experience line up closely with what this storefront team is
                building, and your pattern of saving and applying to similar
                roles makes this one worth a closer look even though you
                haven&rsquo;t interacted with it directly yet.&rdquo;
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Skills reason — </span>
                  The job centers on storefront components and close work with
                  design, both squarely in your declared React, HTML/CSS, and
                  Figma experience.
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Activity reason — </span>
                  You&rsquo;ve saved and applied to similar front-end roles
                  before, so that pattern carries real weight here even
                  without direct history on this exact posting.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {MATCHING_SKILLS.map((s) => (
                  <Chip key={s} icon={CheckCircle2} tone="match">
                    {s}
                  </Chip>
                ))}
                {MISSING_SKILLS.map((s) => (
                  <Chip key={s} icon={Plus} tone="gap">
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">The full chain, end to end</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-mono text-xs text-primary">1.</span> Profile
            text + job text → Sentence-BERT → cosine similarity →{" "}
            <span className="font-medium text-foreground">Semantic Score {SEMANTIC_SCORE}%</span>
          </li>
          <li>
            <span className="font-mono text-xs text-primary">2.</span> user_id
            + job_id → NeuMF forward pass (or 0.50 if either is unseen) →{" "}
            <span className="font-medium text-foreground">Collaborative Score {TARGET_SCORE}%</span>
          </li>
          <li>
            <span className="font-mono text-xs text-primary">3.</span> Blended
            by a weight that ramps with interaction count →{" "}
            <span className="font-medium text-foreground">Match Score {HYBRID.toFixed(1)}%</span>
          </li>
          <li>
            <span className="font-mono text-xs text-primary">4.</span>{" "}
            Separately, per-skill similarity against a target role →{" "}
            <span className="font-medium text-foreground">Skill Gaps + course links</span>
          </li>
          <li>
            <span className="font-mono text-xs text-primary">5.</span>{" "}
            Separately, Gemini explains the three scores above in plain
            language →{" "}
            <span className="font-medium text-foreground">the Match Insight shown to the user</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

function ScoreCard({ label, sublabel, value, colorClass }) {
  return (
    <div className="rounded-xl border border-border p-4">
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

function WhyCard({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <div className="mt-2 text-xs text-muted-foreground">{children}</div>
    </div>
  );
}

function ToggleButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-3.5" strokeWidth={1.75} />
      {children}
    </button>
  );
}

function Chip({ icon: Icon, tone, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "match" ? "bg-chart-1/10 text-chart-1" : "bg-chart-3/10 text-chart-3"
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} />
      {children}
    </span>
  );
}
