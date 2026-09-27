"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Scale, Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    slug: "foundations",
    name: "Where CS Actually Shows Up",
    subtitle: "Question 1",
    icon: BrainCircuit,
    accent: "text-chart-1",
    accentBg: "bg-chart-1/10",
    description:
      "Five CS subfields chained into one pipeline — NLP, linear algebra, machine learning, information retrieval, and data structures — each doing a specific job a plain database lookup couldn't.",
  },
  {
    slug: "ranking",
    name: "Why a Hybrid, Not One Algorithm",
    subtitle: "Question 2",
    icon: Scale,
    accent: "text-chart-2",
    accentBg: "bg-chart-2/10",
    description:
      "Two independently computed criteria, each chosen to cover the other's documented failure mode — a static content-based score and a cold-start-prone behavioral score.",
  },
  {
    slug: "computations",
    name: "The Formal Definitions",
    subtitle: "Question 3",
    icon: Sigma,
    accent: "text-chart-3",
    accentBg: "bg-chart-3/10",
    description:
      "The seven computations behind a single match request, in execution order — from embedding generation through to the evaluation metrics used on survey data.",
  },
];

export default function PresentationOverviewPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Angkop Thesis Defense
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Answers to the Dean&rsquo;s questions
        </h1>
        <p className="mt-3 text-sm text-balance text-muted-foreground sm:text-base">
          On Computer Science content, ranking criteria, and computations —
          walked through as three slides. Pick one, then read top to bottom
          at your own pace.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SLIDES.map((slide, index) => (
          <SlideCard key={slide.slug} slide={slide} index={index} />
        ))}
      </div>
    </div>
  );
}

function SlideCard({ slide, index }) {
  const Icon = slide.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 + index * 0.08, ease: "easeOut" }}
    >
      <Link
        href={`/presentation/${slide.slug}`}
        className="group flex h-full flex-col rounded-xl border border-border p-6 transition-colors hover:border-primary/40"
      >
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-lg",
            slide.accentBg
          )}
        >
          <Icon className={cn("size-5", slide.accent)} strokeWidth={1.75} />
        </span>
        <p className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {slide.subtitle}
        </p>
        <h2 className="mt-1 text-base font-semibold text-foreground">
          {slide.name}
        </h2>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {slide.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Open slide
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
