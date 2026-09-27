"use client";

import { motion } from "framer-motion";
import { NcfDemo } from "@/components/algorithms/ncf-demo";

export default function NcfPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Collaborative Filtering — Neural Collaborative Filtering (NCF)
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Learning from what you actually do
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Every view, save, application, and dismissal is a signal.
          Applications count for more than saves, and saves count for more
          than a passive view or a dismissal. NCF turns this behavior into a{" "}
          <span className="font-medium text-foreground">Collaborative Score</span>{" "}
          — a personalized prediction that improves the more the system uses.
          This demo loops continuously through the four steps below.
        </p>
      </motion.div>

      <div className="mt-6">
        <NcfDemo />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Why this matters for Angkop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sentence-BERT alone can&rsquo;t tell that a candidate who always
            saves remote-friendly roles prefers them over onsite ones with
            near-identical skill requirements. NCF learns that preference from
            behavior, so two candidates with the same skills can still get
            different rankings. New users start on the semantic score alone —
            this is the{" "}
            <span className="font-medium text-foreground">Cold Start</span>{" "}
            case — and lean more on NCF as their history grows.
          </p>
        </div>
        <ComputationPanel />
      </div>
    </div>
  );
}

function ComputationPanel() {
  const weights = { view: 1, save: 3, apply: 5, dismiss: -2 };
  const example = { view: 1, save: 1, apply: 1, dismiss: 0 };
  const total =
    example.view * weights.view +
    example.save * weights.save +
    example.apply * weights.apply +
    example.dismiss * weights.dismiss;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs">
      <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">
        A simplified engagement score
      </h2>
      <p className="text-muted-foreground">
        weight = {"{"} view: {weights.view}, save: {weights.save}, apply:{" "}
        {weights.apply}, dismiss: {weights.dismiss} {"}"}
      </p>
      <p className="mt-2 text-muted-foreground">
        UI Engineer — Kumu: 1 view + 1 save + 1 apply
      </p>
      <div className="mt-2 space-y-1.5 text-foreground">
        <p>
          engagement = (1×{weights.view}) + (1×{weights.save}) + (1×
          {weights.apply}) + (0×{weights.dismiss}) ={" "}
          <span className="font-semibold text-primary">{total}</span>
        </p>
      </div>
      <p className="mt-3 font-sans text-[11px] text-muted-foreground">
        The real Neural Collaborative Filtering model doesn&rsquo;t use fixed
        weights like this — it learns a user vector and a job vector from
        thousands of interactions, then combines them through a small neural
        network. The weighted sum above is a readable stand-in for that
        learned function.
      </p>
    </div>
  );
}
