"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function OnboardingHubSplitPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(DESIGNS[0].slug);
  const active = DESIGNS.find((d) => d.slug === selected) ?? DESIGNS[0];

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[320px_1fr]">
      <div className="hidden flex-col justify-between border-r border-border bg-muted/30 p-8 lg:flex">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
              A
            </span>
            Angkop
          </Link>

          <Link
            href="/"
            className="mt-10 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All designs
          </Link>

          <div className="mt-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Try the onboarding flow
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              See how a new user sets up their profile before their
              first match — pick a design on the right to preview it in.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Angkop — thesis prototype
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-10 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
              A
            </span>
            Angkop
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All designs
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-12 lg:p-16">
          <div className="w-full max-w-sm">
            <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground lg:hidden">
              Try the onboarding flow
            </h2>

            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Design
            </label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESIGNS.map((design) => (
                  <SelectItem key={design.slug} value={design.slug}>
                    {design.name} — {design.tagline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="mt-3 text-sm text-muted-foreground">
              {active.description}
            </p>

            <Button
              className="mt-6 w-full"
              onClick={() => router.push(`/onboarding/${selected}`)}
            >
              <Sparkles className="size-4" />
              Start onboarding
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
