"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const designs = [
  {
    slug: "design-one",
    name: "Design One",
    tagline: "Structured & dense",
    description:
      "A traditional application layout with a persistent sidebar and a dense, information-first hierarchy — built for users who want everything at a glance.",
    available: true,
  },
  {
    slug: "design-two",
    name: "Design Two",
    tagline: "Visual & discovery-first",
    description:
      "An icon-rail navigation with a visual, content-forward layout — spotlight cards, radial match scores, and a mobile tab bar.",
    available: true,
  },
  {
    slug: "design-three",
    name: "Design Three",
    tagline: "Calm & focused",
    description:
      "A top navigation bar with a centered single-column flow — one thing at a time, editorial and unhurried.",
    available: true,
  },
  {
    slug: "design-four",
    name: "Design Four",
    tagline: "Split-view workspace",
    description:
      "A slim text-only nav rail with a true master-detail workspace for jobs — list on the left, persistent detail pane on the right, like an email client.",
    available: true,
  },
  {
    slug: "design-five",
    name: "Design Five",
    tagline: "Kanban-first",
    description:
      "A bold colored header with pill navigation and a dark mode toggle. Applications is a real status-column board instead of a list.",
    available: true,
  },
  {
    slug: "design-six",
    name: "Design Six",
    tagline: "No chrome, bento grid",
    description:
      "No persistent bar or sidebar — full-bleed content with a floating dock for navigation, an asymmetric bento dashboard, and dark mode.",
    available: true,
  },
  {
    slug: "design-seven",
    name: "Design Seven",
    tagline: "Command palette",
    description:
      "Near-zero chrome — a Cmd/Ctrl+K palette is the primary way to jump between modules or straight to a job. Dark mode toggle included.",
    available: true,
  },
  {
    slug: "design-eight",
    name: "Design Eight",
    tagline: "Spreadsheet-styled",
    description:
      "Real tables with zebra-striped rows and monospace numerics, switched between with flat rectangular tabs like a spreadsheet's sheet selector.",
    available: true,
  },
  {
    slug: "design-nine",
    name: "Design Nine",
    tagline: "Timeline-driven",
    description:
      "A vertical timeline rail for navigation, and Applications reads as a literal timeline of your job search journey.",
    available: true,
  },
];

export default function DesignSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-10 max-w-xl text-center"
      >
        <div className="mb-5 inline-flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            A
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Angkop
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Choose a design to preview
        </h1>
        <p className="mt-3 text-sm text-balance text-muted-foreground sm:text-base">
          Nine UI/UX approaches for the same career recommendation system,
          built to compare side by side during thesis defense.
        </p>
      </motion.div>

      <div className="grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((design, index) => (
          <DesignCard key={design.slug} design={design} index={index} />
        ))}
      </div>
    </div>
  );
}

function DesignCard({ design, index }) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.08, ease: "easeOut" }}
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border p-6 transition-colors",
        design.available ? "hover:border-primary/40" : "opacity-60"
      )}
    >
      <DesignPreview slug={design.slug} />

      <div className="mt-5 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">
          {design.name}
        </h2>
        {design.available ? (
          <Badge variant="secondary">{design.tagline}</Badge>
        ) : (
          <Badge variant="outline">Coming soon</Badge>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{design.description}</p>

      {design.available ? (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          View dashboard
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      ) : (
        <span className="mt-4 text-sm font-medium text-muted-foreground">
          Not yet available
        </span>
      )}
    </motion.div>
  );

  if (!design.available) {
    return card;
  }

  return (
    <Link href={`/${design.slug}/dashboard`} className="block h-full">
      {card}
    </Link>
  );
}

function DesignPreview({ slug }) {
  if (slug === "design-one") {
    return (
      <div className="flex h-28 overflow-hidden rounded-md border border-border bg-muted/40">
        <div className="flex w-8 flex-col gap-1.5 border-r border-border bg-background p-1.5">
          <div className="h-1.5 w-full rounded-full bg-primary/50" />
          <div className="h-1.5 w-full rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-full rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-full rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2.5">
          <div className="h-2 w-1/3 rounded-full bg-muted-foreground/30" />
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            <div className="h-6 rounded-sm bg-background" />
            <div className="h-6 rounded-sm bg-background" />
            <div className="h-6 rounded-sm bg-background" />
          </div>
          <div className="h-2.5 rounded-sm bg-background" />
          <div className="h-2.5 rounded-sm bg-background" />
        </div>
      </div>
    );
  }

  if (slug === "design-two") {
    return (
      <div className="theme-blue flex h-28 overflow-hidden rounded-md border border-border bg-muted/40">
        <div className="flex w-6 flex-col items-center gap-1.5 border-r border-border bg-background py-2">
          <div className="size-2.5 rounded-full bg-primary/60" />
          <div className="size-2.5 rounded-full bg-muted-foreground/20" />
          <div className="size-2.5 rounded-full bg-muted-foreground/20" />
          <div className="size-2.5 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2.5">
          <div className="h-8 rounded-md bg-primary/10" />
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-6 rounded-sm bg-background" />
            <div className="h-6 rounded-sm bg-background" />
          </div>
        </div>
      </div>
    );
  }

  if (slug === "design-three") {
    return (
      <div className="theme-yellow flex h-28 flex-col overflow-hidden rounded-md border border-border bg-muted/40">
        <div className="flex items-center gap-1 border-b border-border bg-background px-2 py-1.5">
          <div className="size-2 rounded-full bg-primary/70" />
          <div className="ml-1 h-1.5 w-6 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-6 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 w-6 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex flex-1 flex-col items-center gap-1.5 p-3">
          <div className="h-2 w-2/5 rounded-full bg-muted-foreground/30" />
          <div className="h-6 w-4/5 rounded-sm bg-background" />
          <div className="h-2.5 w-4/5 rounded-sm bg-background" />
        </div>
      </div>
    );
  }

  if (slug === "design-four") {
    return (
      <div className="theme-forest flex h-28 overflow-hidden rounded-md border border-border bg-muted/40">
        <div className="flex w-5 flex-col gap-1.5 border-r border-border bg-background p-1.5">
          <div className="h-1 w-full rounded-full bg-primary/50" />
          <div className="h-1 w-full rounded-full bg-muted-foreground/20" />
          <div className="h-1 w-full rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex w-8 flex-col gap-1 border-r border-border p-1.5">
          <div className="h-3 rounded-sm bg-primary/10" />
          <div className="h-3 rounded-sm bg-background" />
          <div className="h-3 rounded-sm bg-background" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2.5">
          <div className="h-2 w-1/2 rounded-full bg-muted-foreground/30" />
          <div className="h-2.5 rounded-sm bg-background" />
          <div className="h-2.5 rounded-sm bg-background" />
        </div>
      </div>
    );
  }

  if (slug === "design-five") {
    return (
      <div className="theme-blue flex h-28 flex-col overflow-hidden rounded-md border border-border bg-muted/40">
        <div className="flex items-center gap-1 bg-primary px-2 py-1.5">
          <div className="h-2.5 w-10 rounded-full bg-primary-foreground/20" />
          <div className="ml-auto size-2.5 rounded-full bg-primary-foreground/30" />
        </div>
        <div className="flex flex-1 gap-1.5 p-2">
          <div className="flex-1 rounded-sm bg-background" />
          <div className="flex-1 rounded-sm bg-background" />
          <div className="flex-1 rounded-sm bg-background" />
        </div>
      </div>
    );
  }

  if (slug === "design-six") {
    return (
      <div className="theme-yellow relative flex h-28 flex-col gap-1.5 overflow-hidden rounded-md border border-border bg-muted/40 p-2.5">
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          <div className="col-span-2 row-span-2 rounded-sm bg-primary/15" />
          <div className="rounded-sm bg-background" />
          <div className="rounded-sm bg-background" />
        </div>
        <div className="absolute bottom-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full border border-border bg-card" />
      </div>
    );
  }

  if (slug === "design-seven") {
    return (
      <div className="theme-purple flex h-28 flex-col gap-2 overflow-hidden rounded-md border border-border bg-muted/40 p-2.5">
        <div className="flex h-5 items-center gap-1.5 rounded-md border border-border bg-background px-2">
          <div className="size-2 rounded-full bg-muted-foreground/30" />
          <div className="h-1.5 w-16 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1">
          <div className="size-4 rounded-full border border-dashed border-primary/50" />
          <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    );
  }

  if (slug === "design-eight") {
    return (
      <div className="theme-orange flex h-28 flex-col overflow-hidden rounded-md border border-border bg-muted/40">
        <div className="flex flex-1 flex-col gap-px p-1.5">
          <div className="h-3 rounded-sm bg-primary/15" />
          <div className="h-3 rounded-sm bg-background" />
          <div className="h-3 rounded-sm bg-muted/60" />
          <div className="h-3 rounded-sm bg-background" />
        </div>
        <div className="flex h-3.5 items-stretch border-t border-border">
          <div className="w-8 border-t-2 border-t-primary bg-background" />
          <div className="w-8 border-r border-border" />
          <div className="w-8 border-r border-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="theme-rose flex h-28 overflow-hidden rounded-md border border-border bg-muted/40">
      <div className="relative flex w-6 flex-col items-center gap-2.5 border-r border-border bg-background py-2">
        <div className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-border" />
        <div className="z-10 size-1.5 rounded-full bg-primary" />
        <div className="z-10 size-1.5 rounded-full bg-muted-foreground/30" />
        <div className="z-10 size-1.5 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <div className="h-2 w-1/2 rounded-full bg-muted-foreground/30" />
        <div className="h-2.5 rounded-sm bg-background" />
        <div className="h-2.5 rounded-sm bg-background" />
      </div>
    </div>
  );
}
