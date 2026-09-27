"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Database,
  ScanText,
  SearchCode,
  Sigma,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    key: "nlp",
    subfield: "Natural Language Processing",
    hook: "Turning language into data",
    icon: ScanText,
    accent: "text-chart-1",
    accentBg: "bg-chart-1/10",
    barBg: "bg-chart-1",
    body:
      "A resume skill (“React developer”) and a job requirement (“front-end engineer”) are just strings of text to a computer. Sentence-BERT converts each piece of text into a fixed-length embedding that encodes its meaning — without it, the system could only compare strings keyword-by-keyword, exactly the limitation of ordinary job boards.",
  },
  {
    key: "linear-algebra",
    subfield: "Linear Algebra",
    hook: "Measuring “meaning distance” mathematically",
    icon: Sigma,
    accent: "text-chart-2",
    accentBg: "bg-chart-2/10",
    barBg: "bg-chart-2",
    body:
      "Once skills and job descriptions are embeddings — points in a 384-dimensional vector space — comparing meaning becomes a geometry problem. Cosine similarity measures the angle between two vectors regardless of magnitude: a direct, textbook application of vector spaces and dot products.",
  },
  {
    key: "machine-learning",
    subfield: "Machine Learning",
    hook: "Learning from behavior instead of being told rules",
    icon: BrainCircuit,
    accent: "text-chart-3",
    accentBg: "bg-chart-3/10",
    barBg: "bg-chart-3",
    body:
      "Two users with identical resumes can genuinely prefer different roles. Neural Collaborative Filtering is trained on each user’s own implicit feedback (views, saves, applications, dismissals) so the system learns the preference function from data instead of a hand-coded rule — and keeps improving as more data arrives.",
  },
  {
    key: "information-retrieval",
    subfield: "Information Retrieval",
    hook: "Ranking, not just matching",
    icon: SearchCode,
    accent: "text-chart-4",
    accentBg: "bg-chart-4/10",
    barBg: "bg-chart-4",
    body:
      "Finding jobs that are simply relevant isn’t enough — the system has to decide which relevant jobs to show first. The Hybrid Ranking Engine produces a ranked list ordered by relevance to the user’s profile, evaluated with the same metrics search engines use: Precision@K and Recall@K.",
  },
  {
    key: "data-structures",
    subfield: "Data Structures & Systems",
    hook: "Making it fast enough to be usable",
    icon: Database,
    accent: "text-chart-5",
    accentBg: "bg-chart-5/10",
    barBg: "bg-chart-5",
    body:
      "Embeddings are stored with pgvector, a Postgres extension implementing approximate nearest-neighbor search, so comparing one user against thousands of jobs skips a brute-force scan. Redis caches previously computed scores — a classic space-time trade-off that keeps matching feeling real-time.",
  },
];

export default function FoundationsPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Question 1
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How does Computer Science come into play?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Every stage of Angkop&rsquo;s matching pipeline is built on a core
          CS subfield. Strip away the phrase &ldquo;job matching&rdquo; and
          this is what&rsquo;s actually underneath.
        </p>
      </motion.div>

      <div className="mt-8">
        {STAGES.map((stage, index) => (
          <PipelineStage
            key={stage.key}
            stage={stage}
            index={index}
            isLast={index === STAGES.length - 1}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 + STAGES.length * 0.08, ease: "easeOut" }}
        className="mt-2 rounded-xl border border-border bg-muted/30 p-5 sm:p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">
          If asked to summarize in one paragraph
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          &ldquo;Computer Science enters at every layer of the matching
          process: NLP is used to convert skills and job descriptions into
          meaning-bearing numerical representations; linear algebra is used
          to mathematically measure how similar those representations are;
          machine learning is used to learn a personalized preference model
          directly from user behavior instead of hardcoded rules;
          information retrieval principles are used to rank, not just
          filter, the resulting candidates; and data structures and caching
          are used to make the entire pipeline fast enough to run in real
          time. Job matching here is not a database lookup, it is a
          computational pipeline spanning NLP, linear algebra, deep
          learning, and information retrieval.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}

function PipelineStage({ stage, index, isLast }) {
  const Icon = stage.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.08, ease: "easeOut" }}
      className="flex gap-4 sm:gap-5"
    >
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            stage.accentBg
          )}
        >
          <Icon className={cn("size-5", stage.accent)} strokeWidth={1.75} />
        </span>
        {isLast ? null : (
          <span className={cn("mt-1.5 w-px flex-1 bg-border")} />
        )}
      </div>

      <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-6")}>
        <div className="rounded-xl border border-border p-5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              1.{index + 1}
            </span>
            <h2 className="text-sm font-semibold text-foreground">
              {stage.subfield}
            </h2>
            <span className={cn("text-xs font-medium", stage.accent)}>
              {stage.hook}
            </span>
          </div>
          <p className="mt-2.5 text-sm text-muted-foreground">{stage.body}</p>
        </div>
      </div>
    </motion.div>
  );
}
