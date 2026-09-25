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
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative flex flex-col justify-between overflow-hidden bg-primary p-8 text-primary-foreground sm:p-12 lg:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <Link
          href="/"
          className="relative inline-flex w-fit items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All designs
        </Link>

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary-foreground/15 text-sm font-semibold">
              A
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Angkop
            </span>
          </div>
          <h1 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
            Try the onboarding flow
          </h1>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/75 sm:text-base">
            See how a new user sets up their profile before their first
            match — pick a design on the right to preview it in.
          </p>
        </div>

        <p className="relative text-xs text-primary-foreground/50">
          Angkop — thesis prototype
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-sm">
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
  );
}
