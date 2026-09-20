"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
];

export default function OnboardingHubPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(DESIGNS[0].slug);
  const active = DESIGNS.find((d) => d.slug === selected) ?? DESIGNS[0];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          All designs
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              A
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Angkop
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Try the onboarding flow
          </h1>
          <p className="mt-3 text-sm text-balance text-muted-foreground sm:text-base">
            See how a new user sets up their profile before their first
            match — pick a design to preview it in.
          </p>
        </div>

        <div className="rounded-xl border border-border p-6">
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

          <motion.p
            key={active.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            {active.description}
          </motion.p>

          <Button
            className="mt-5 w-full"
            onClick={() => router.push(`/onboarding/${selected}`)}
          >
            <Sparkles className="size-4" />
            Start onboarding
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
