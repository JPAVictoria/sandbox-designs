"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GitMerge, Network, ScanText } from "lucide-react";
import { cn } from "@/lib/utils";

const ALGORITHMS = [
  {
    slug: "sbert",
    name: "Semantic Matching",
    subtitle: "Sentence-BERT",
    icon: ScanText,
    accent: "text-chart-1",
    accentBg: "bg-chart-1/10",
    description:
      "Watch a skills paragraph and a job description each turn into a 384-dimension embedding, then get compared with cosine similarity to produce a semantic score.",
  },
  {
    slug: "ncf",
    name: "Collaborative Filtering",
    subtitle: "Neural Collaborative Filtering",
    icon: Network,
    accent: "text-chart-2",
    accentBg: "bg-chart-2/10",
    description:
      "See how views, saves, applications, and dismissals train latent user and job vectors that predict a personalized collaborative score.",
  },
  {
    slug: "hybrid",
    name: "Hybrid Ranking",
    subtitle: "Semantic + Collaborative",
    icon: GitMerge,
    accent: "text-chart-3",
    accentBg: "bg-chart-3/10",
    description:
      "See the semantic score and the collaborative score merge into one Match Score, then watch a job list re-rank around it live.",
  },
];

export default function AlgorithmsOverviewPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How Angkop matches you to a job
        </h1>
        <p className="mt-3 text-sm text-balance text-muted-foreground sm:text-base">
          Three looping, live illustrations of the models behind your Match
          Score — pick one to see it run continuously, with the underlying
          computation shown alongside.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ALGORITHMS.map((algo, index) => (
          <AlgorithmCard key={algo.slug} algo={algo} index={index} />
        ))}
      </div>
    </div>
  );
}

function AlgorithmCard({ algo, index }) {
  const Icon = algo.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 + index * 0.08, ease: "easeOut" }}
    >
      <Link
        href={`/algorithms/${algo.slug}`}
        className="group flex h-full flex-col rounded-xl border border-border p-6 transition-colors hover:border-primary/40"
      >
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-lg",
            algo.accentBg
          )}
        >
          <Icon className={cn("size-5", algo.accent)} strokeWidth={1.75} />
        </span>
        <p className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {algo.subtitle}
        </p>
        <h2 className="mt-1 text-base font-semibold text-foreground">
          {algo.name}
        </h2>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {algo.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Watch the demo
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
