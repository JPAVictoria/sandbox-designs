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
      "A more visual, content-forward layout that leads with discovery over density.",
    available: false,
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
          Two UI/UX approaches for the same career recommendation system, built to
          compare side by side during thesis defense.
        </p>
      </motion.div>

      <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
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

  return (
    <div className="flex h-28 flex-col gap-1.5 rounded-md border border-dashed border-border bg-muted/20 p-2.5">
      <div className="h-2 w-1/4 rounded-full bg-muted-foreground/20" />
      <div className="grid flex-1 grid-cols-2 gap-1.5">
        <div className="rounded-sm bg-muted/60" />
        <div className="rounded-sm bg-muted/60" />
      </div>
    </div>
  );
}
