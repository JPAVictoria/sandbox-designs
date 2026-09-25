"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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

export default function OnboardingHubGridPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <div className="inline-flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            A
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Angkop
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All designs
        </Link>
      </header>

      <div className="px-6 pt-10 pb-6 text-center sm:px-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Try the onboarding flow
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a design to see how a new user sets up their profile.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
        {DESIGNS.map((design, index) => (
          <Link
            key={design.slug}
            href={`/onboarding/${design.slug}`}
            className={cn(
              "group flex flex-col items-center justify-center gap-3 p-10 text-center transition-colors hover:bg-muted/40",
              index === 0 && "bg-muted/10"
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {index + 1}
            </span>
            <div>
              <p className="text-base font-semibold text-foreground">
                {design.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {design.tagline}
              </p>
            </div>
            <p className="max-w-52 text-sm text-muted-foreground">
              {design.description}
            </p>
            <span
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-2 group-hover:border-primary/40 group-hover:text-foreground"
              )}
            >
              Start onboarding
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
