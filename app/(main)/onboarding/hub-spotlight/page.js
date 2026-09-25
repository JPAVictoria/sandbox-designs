"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DESIGNS = [
  {
    slug: "design-one",
    name: "Design One",
    tagline: "Structured & dense",
    description:
      "A traditional application layout with a persistent sidebar and a dense, information-first hierarchy.",
  },
  {
    slug: "design-two",
    name: "Design Two",
    tagline: "Visual & discovery-first",
    description:
      "An icon-rail navigation with a visual, content-forward layout — spotlight cards and radial match scores.",
  },
  {
    slug: "design-three",
    name: "Design Three",
    tagline: "Calm & focused",
    description:
      "A top navigation bar with a centered single-column flow — one thing at a time, editorial and unhurried.",
  },
  {
    slug: "split-screen",
    name: "Split-Screen",
    tagline: "Guided & reassuring",
    description:
      "A persistent brand panel tracks your progress alongside a focused, single-column form — always clear how far along you are.",
  },
  {
    slug: "split-one",
    name: "Split One",
    tagline: "Structured & dense, split",
    description:
      "Design One's dense, information-first steps with a persistent step-checklist panel pinned to the left.",
  },
  {
    slug: "split-two",
    name: "Split Two",
    tagline: "Visual & discovery-first, split",
    description:
      "Design Two's visual, encouraging steps with a full-bleed brand panel and radial progress pinned to the left.",
  },
  {
    slug: "split-three",
    name: "Split Three",
    tagline: "Calm & focused, split",
    description:
      "Design Three's calm, editorial steps with a quiet, reassuring panel pinned to the left.",
  },
];

export default function OnboardingHubSpotlightPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(DESIGNS[0].slug);
  const active = DESIGNS.find((d) => d.slug === selected) ?? DESIGNS[0];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in oklch, var(--primary), transparent 88%), transparent 60%)",
        }}
      />

      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:top-8 sm:left-8"
      >
        <ArrowLeft className="size-3.5" />
        All designs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative flex w-full max-w-xl flex-col items-center text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground">
            A
          </span>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Angkop
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
          Try the onboarding flow
        </h1>
        <p className="mt-4 max-w-md text-base text-balance text-muted-foreground">
          See how a new user sets up their profile before their first match.
        </p>

        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DESIGNS.map((design) => {
            const isActive = design.slug === selected;
            return (
              <button
                key={design.slug}
                type="button"
                onClick={() => setSelected(design.slug)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-foreground/20"
                )}
              >
                <span className="flex w-full items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {design.name}
                  </span>
                  {isActive ? (
                    <Check className="size-3.5 text-primary" />
                  ) : null}
                </span>
                <span className="text-xs text-muted-foreground">
                  {design.tagline}
                </span>
              </button>
            );
          })}
        </div>

        <motion.p
          key={active.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="mt-5 max-w-md text-sm text-muted-foreground"
        >
          {active.description}
        </motion.p>

        <Button
          size="lg"
          className="mt-8"
          onClick={() => router.push(`/onboarding/${selected}`)}
        >
          <Sparkles className="size-4" />
          Start onboarding
          <ArrowRight className="size-4" />
        </Button>
      </motion.div>
    </div>
  );
}
