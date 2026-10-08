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
          Step through the five tabs below to see it happen.
        </p>
      </motion.div>

      <div className="mt-6">
        <NcfDemo />
      </div>

      <div className="mt-8">
        <ForwardPassPanel />
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
            different rankings. New users lean almost entirely on the
            semantic score (90%) — this is the{" "}
            <span className="font-medium text-foreground">Cold Start</span>{" "}
            case — and NCF&rsquo;s share grows as their history does, up to a
            60% ceiling (see Hybrid Ranking).
          </p>
        </div>
        <ComputationPanel />
      </div>
    </div>
  );
}

// Toy 2-dim embeddings / 4→4→2 MLP standing in for the real 8-dim embeddings
// and 16→16→8 MLP (ml/app/models/ncf.py) — same architecture and ratios,
// small enough to compute and display by hand. Weights below are fixed toy
// numbers, not real trained weights from weights/ncf.pt.
function dotVec(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
function linear(W, x, b) {
  return W.map((row, i) => dotVec(row, x) + b[i]);
}
function relu(v) {
  return v.map((n) => Math.max(0, n));
}
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function ForwardPassPanel() {
  const gmfUser = [0.9, 0.2];
  const gmfItem = [0.8, 0.4];
  const gmfOutput = gmfUser.map((v, i) => v * gmfItem[i]);

  const mlpUser = [0.6, -0.1];
  const mlpItem = [0.3, 0.5];
  const mlpInput = [...mlpUser, ...mlpItem];

  const W1 = [
    [0.5, 0.2, -0.3, 0.1],
    [0.1, 0.4, 0.2, -0.2],
    [-0.2, 0.3, 0.5, 0.1],
    [0.3, -0.1, 0.1, 0.4],
  ];
  const b1 = [0.1, 0.0, -0.1, 0.05];
  const h1 = relu(linear(W1, mlpInput, b1));

  const W2 = [
    [0.4, 0.3, -0.2, 0.5],
    [-0.1, 0.6, 0.2, 0.3],
  ];
  const b2 = [0.0, -0.05];
  const mlpOutput = relu(linear(W2, h1, b2));

  const merged = [...gmfOutput, ...mlpOutput];
  const W3 = [0.5, 0.3, 0.4, 0.6];
  const b3 = -0.2;
  const logit = dotVec(W3, merged) + b3;
  const score = sigmoid(logit);

  const fmt = (v) => v.map((n) => n.toFixed(3)).join(", ");

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 sm:p-8">
      <h2 className="text-sm font-semibold text-foreground">
        Under the hood — a worked forward pass
      </h2>
      <p className="mt-1.5 max-w-2xl text-xs text-muted-foreground">
        The real model uses 8-dim embeddings and a 16→16→8 MLP. Shown here at
        2 dimensions and a 4→4→2 MLP — identical architecture, small enough to
        verify by hand.
      </p>

      <div className="mt-5 grid gap-4 font-mono text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-2 font-sans text-xs font-semibold text-foreground">
            GMF branch
          </p>
          <p className="text-muted-foreground">user_emb = [{fmt(gmfUser)}]</p>
          <p className="text-muted-foreground">item_emb = [{fmt(gmfItem)}]</p>
          <p className="mt-1.5 text-foreground">
            GMF_output = user_emb ⊙ item_emb = [{fmt(gmfOutput)}]
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-2 font-sans text-xs font-semibold text-foreground">
            MLP branch
          </p>
          <p className="text-muted-foreground">concat = [{fmt(mlpInput)}]</p>
          <p className="mt-1.5 text-foreground">
            h1 = ReLU(W1·x + b1) = [{fmt(h1)}]
          </p>
          <p className="mt-1 text-foreground">
            MLP_output = ReLU(W2·h1 + b2) = [{fmt(mlpOutput)}]
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-muted/60 p-5 text-center font-mono text-xs">
        <p className="text-muted-foreground">
          merged = concat(GMF_output, MLP_output) = [{fmt(merged)}]
        </p>
        <p className="mt-1 text-muted-foreground">
          logit = W3·merged + b3 = {logit.toFixed(4)}
        </p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          collaborative_score = sigmoid(logit)
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
          {(score * 100).toFixed(1)}%
        </p>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Compare against Cold Start (tab 5 above): if either id were unmapped,
        none of this arithmetic would run at all — the service returns a flat
        50% directly instead.
      </p>
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
  const normalized = (total + 2) / 7;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 font-mono text-xs">
      <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">
        How training labels are built (train_ncf.py)
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
          raw weight = (1×{weights.view}) + (1×{weights.save}) + (1×
          {weights.apply}) + (0×{weights.dismiss}) = {total}
        </p>
        <p>
          label = (raw weight + 2) / 7 = ({total} + 2) / 7 ={" "}
          <span className="font-semibold text-primary">{normalized.toFixed(3)}</span>
        </p>
      </div>
      <p className="mt-3 font-sans text-[11px] text-muted-foreground">
        This normalized label is only used to train the network offline —
        see the worked forward pass above for how a trained NCF actually
        produces a Collaborative Score at request time (GMF ⊙ MLP → sigmoid),
        and how it falls back to a flat 0.5 for a user or job it has never
        seen (Cold Start, tab 5 above).
      </p>
    </div>
  );
}
