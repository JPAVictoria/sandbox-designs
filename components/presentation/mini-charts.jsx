"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CircleAlert, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}
export function magnitude(a) {
  return Math.sqrt(dot(a, a));
}
export function cosineSim(a, b) {
  return dot(a, b) / (magnitude(a) * magnitude(b));
}

// A vector rendered as a row of big colored tiles, shaded by each value —
// a "fingerprint" of the embedding rather than a bar chart (no axis, no
// length encoding, just color intensity).
export function VectorFingerprint({ label, vector, colorVar = "var(--color-chart-1)" }) {
  return (
    <div>
      {label ? <p className="mb-2.5 text-xs font-medium text-muted-foreground">{label}</p> : null}
      <div className="flex flex-wrap gap-2">
        {vector.map((v, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
            className="size-10 rounded-xl sm:size-12"
            style={{ backgroundColor: colorVar, opacity: Math.max(v, 0.12) }}
          />
        ))}
      </div>
    </div>
  );
}

// Two vectors from a shared origin, angled apart by `angleDeg` — a smaller
// angle reads as "more similar," which is literally what cosine similarity
// measures. No axes, just the two arrows and the angle between them.
export function AngleDiagram({ angleDeg, nameA = "Profile", nameB = "Job", colorA = "var(--color-chart-4)", colorB = "var(--color-chart-1)" }) {
  const originX = 26;
  const originY = 150;
  const length = 118;
  const baseAngle = 62;
  const clampedAngle = Math.min(Math.max(angleDeg, 4), 80);
  const angleARad = (baseAngle * Math.PI) / 180;
  const angleBRad = ((baseAngle - clampedAngle) * Math.PI) / 180;
  const ax = originX + length * Math.cos(angleARad);
  const ay = originY - length * Math.sin(angleARad);
  const bx = originX + length * Math.cos(angleBRad);
  const by = originY - length * Math.sin(angleBRad);
  const arcR = 40;
  const arcStartX = originX + arcR * Math.cos(angleARad);
  const arcStartY = originY - arcR * Math.sin(angleARad);
  const arcEndX = originX + arcR * Math.cos(angleBRad);
  const arcEndY = originY - arcR * Math.sin(angleBRad);

  return (
    <svg viewBox="0 0 220 170" className="h-44 w-full sm:h-52">
      <circle cx={originX} cy={originY} r="3.5" fill="var(--color-muted-foreground)" />
      <path
        d={`M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}`}
        fill="none"
        stroke="var(--color-muted-foreground)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <motion.line
        x1={originX}
        y1={originY}
        initial={{ x2: originX, y2: originY }}
        animate={{ x2: ax, y2: ay }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        stroke={colorA}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <motion.circle initial={{ cx: originX, cy: originY }} animate={{ cx: ax, cy: ay }} transition={{ duration: 0.7, ease: "easeOut" }} r="5" fill={colorA} />
      <motion.line
        x1={originX}
        y1={originY}
        initial={{ x2: originX, y2: originY }}
        animate={{ x2: bx, y2: by }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
        stroke={colorB}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <motion.circle initial={{ cx: originX, cy: originY }} animate={{ cx: bx, cy: by }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }} r="5" fill={colorB} />
      <text x={ax + 8} y={ay - 4} fontSize="13" fontWeight="600" fill={colorA}>
        {nameA}
      </text>
      <text x={bx + 8} y={by + 6} fontSize="13" fontWeight="600" fill={colorB}>
        {nameB}
      </text>
    </svg>
  );
}

export function NetworkDiagram({ layers }) {
  return (
    <div className="flex items-center py-2">
      {layers.map((layer, li) => (
        <div key={li} className="flex flex-1 items-center">
          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-3">
              {Array.from({ length: layer.count }).map((_, ni) => (
                <motion.span
                  key={ni}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: li * 0.3 + ni * 0.15,
                    ease: "easeInOut",
                  }}
                  className={cn("size-4 rounded-full sm:size-5", layer.colorClass ?? "bg-chart-2")}
                />
              ))}
            </div>
            <p className="text-center text-xs leading-tight font-medium text-muted-foreground">
              {layer.label}
            </p>
          </div>
          {li < layers.length - 1 ? <NetworkRail /> : null}
        </div>
      ))}
    </div>
  );
}

function NetworkRail() {
  return (
    <div className="relative mx-1.5 h-px w-12 shrink-0 bg-border sm:w-20">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-primary"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.45,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Renders `items` in their given order, then re-sorts them descending by
// `valueKey` after `delay` ms — a big rank-badge before/after visual.
export function ReorderList({ items, valueKey = "value", delay = 900, unit = "%", beforeLabel = "As retrieved", afterLabel = "Ranked by relevance" }) {
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSorted(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  const list = sorted ? [...items].sort((a, b) => b[valueKey] - a[valueKey]) : items;

  return (
    <div>
      <p className="mb-3 text-xs font-medium text-muted-foreground">{sorted ? afterLabel : beforeLabel}</p>
      <div className="flex flex-col gap-2">
        {list.map((item, i) => (
          <motion.div
            layout
            key={item.id}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
              {item.sublabel ? (
                <p className="truncate text-xs text-muted-foreground">{item.sublabel}</p>
              ) : null}
            </div>
            <span className="shrink-0 text-lg font-semibold tabular-nums text-foreground">
              {item[valueKey]}
              {unit}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Big icon + number callouts side by side, sized by value — a "race"
// metaphor for comparing magnitudes without drawing a bar chart.
export function IconStats({ rows }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {rows.map((row, i) => {
        const Icon = row.icon;
        return (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.1, ease: "easeOut" }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span className={cn("flex size-14 items-center justify-center rounded-2xl sm:size-16", row.bg ?? "bg-primary/10")}>
              <Icon className={cn("size-6 sm:size-7", row.color ?? "text-primary")} strokeWidth={1.75} />
            </span>
            <p className="text-xl font-semibold tabular-nums text-foreground sm:text-2xl">
              {row.value}
              <span className="text-xs font-normal text-muted-foreground">{row.unit}</span>
            </p>
            <p className="text-[11px] leading-tight text-muted-foreground">{row.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// Big circles sized by relative magnitude — used for comparing weights
// (interaction signals, or the semantic/behavioral split) without a bar.
export function WeightBubbles({ items }) {
  const maxAbs = Math.max(...items.map((i) => Math.abs(i.value))) || 1;
  return (
    <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-6">
      {items.map((item) => {
        const ratio = Math.abs(item.value) / maxAbs;
        const sizePx = Math.round(52 + ratio * 60);
        return (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ width: sizePx, height: sizePx }}
              className={cn(
                "flex items-center justify-center rounded-full text-sm font-semibold text-primary-foreground sm:text-base",
                item.colorClass ?? "bg-primary"
              )}
            >
              {item.display}
            </motion.div>
            <p className="max-w-20 text-center text-[11px] leading-tight text-muted-foreground">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// A grid of icon tiles standing in for actual candidates — pass named
// `items` ({label, hit}) for a concrete tally (e.g. real job titles), or
// `total` + `highlighted` for an anonymous pool (e.g. "12 relevant jobs
// somewhere in the full catalog").
export function TallyGrid({ items, total, highlighted, icon: Icon, resultValue, resultLabel }) {
  const cells = items ?? Array.from({ length: total }, (_, i) => ({ label: null, hit: i < highlighted }));
  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-2.5">
        {cells.map((cell, i) => (
          <motion.div
            key={cell.label ?? i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg sm:size-10",
                cell.hit ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground/40"
              )}
            >
              <Icon className="size-4" strokeWidth={2} />
            </span>
            {cell.label ? (
              <span className="max-w-16 truncate text-[10px] text-muted-foreground">{cell.label}</span>
            ) : null}
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{resultValue}</p>
      <p className="text-xs text-muted-foreground">{resultLabel}</p>
    </div>
  );
}

export function StarRating({ mean, max = 5, label }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, mean - i)) * 100;
          return (
            <span key={i} className="relative inline-block size-8 sm:size-9">
              <Star className="absolute inset-0 size-full text-muted-foreground/25" strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <Star className="size-8 fill-chart-3 text-chart-3 sm:size-9" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      <p className="text-3xl font-semibold tabular-nums text-foreground">{mean.toFixed(2)}</p>
      {label ? <p className="text-xs font-medium text-primary">{label}</p> : null}
    </div>
  );
}

// A named skill-by-skill table: profile score vs. job requirement vs. the
// gap between them — the actual vector-subtraction result, but readable as
// "which skill, how big a gap" instead of an abstract per-dimension bar.
export function SkillGapTable({ rows, gapIndex }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-100 border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-2 pr-3 font-medium">Skill dimension</th>
            <th className="px-3 py-2 text-center font-medium">Your profile</th>
            <th className="px-3 py-2 text-center font-medium">Job requires</th>
            <th className="px-3 py-2 text-center font-medium">Gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const gap = row.job - row.profile;
            const isGap = i === gapIndex;
            return (
              <motion.tr
                key={row.skill}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className={cn("border-b border-border/60 last:border-0", isGap && "bg-chart-5/10")}
              >
                <td className="py-2.5 pr-3 font-medium text-foreground">
                  {row.skill}
                  {isGap ? <CircleAlert className="ml-1.5 inline size-3.5 text-chart-5" strokeWidth={2} /> : null}
                </td>
                <td className="px-3 py-2.5 text-center font-mono tabular-nums text-muted-foreground">
                  {row.profile.toFixed(2)}
                </td>
                <td className="px-3 py-2.5 text-center font-mono tabular-nums text-muted-foreground">
                  {row.job.toFixed(2)}
                </td>
                <td
                  className={cn(
                    "px-3 py-2.5 text-center font-mono font-semibold tabular-nums",
                    isGap ? "text-chart-5" : "text-foreground"
                  )}
                >
                  {gap >= 0 ? "+" : ""}
                  {gap.toFixed(2)}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// A word (or short phrase) with its illustrative weight and the reason it
// was scored that way — the concrete, readable stand-in for "what an
// embedding pays attention to," rather than an abstract number.
export function WordWeightPanel({ title, words, accent = "text-primary" }) {
  return (
    <div>
      {title ? (
        <p className="mb-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      ) : null}
      <ul className="space-y-2">
        {Object.entries(words).map(([word, { weight, reason }], i) => (
          <motion.li
            key={word}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-2.5"
          >
            <span className={cn("shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-sm font-semibold", accent)}>
              {weight.toFixed(2)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{word}</p>
              <p className="text-xs text-muted-foreground">{reason}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// The full worked cosine-similarity arithmetic, term by term, using the
// actual annotated words on each side — not just the final percentage.
export function DotProductWork({ profileWords, jobWords }) {
  const profileEntries = Object.entries(profileWords);
  const jobEntries = Object.entries(jobWords);
  const terms = profileEntries.map(([pWord, pInfo], i) => {
    const [jWord, jInfo] = jobEntries[i];
    return { pWord, jWord, pWeight: pInfo.weight, jWeight: jInfo.weight, product: pInfo.weight * jInfo.weight };
  });
  const dotSum = terms.reduce((sum, t) => sum + t.product, 0);
  const magA = Math.sqrt(profileEntries.reduce((sum, [, info]) => sum + info.weight ** 2, 0));
  const magB = Math.sqrt(jobEntries.reduce((sum, [, info]) => sum + info.weight ** 2, 0));
  const cosine = dotSum / (magA * magB);

  return (
    <div className="space-y-1 font-mono text-xs text-muted-foreground sm:text-[13px]">
      {terms.map((t, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
        >
          {t.pWord}({t.pWeight.toFixed(2)}) × {t.jWord}({t.jWeight.toFixed(2)}) ={" "}
          <span className="text-foreground">{t.product.toFixed(3)}</span>
        </motion.p>
      ))}
      <p className="border-t border-border pt-1.5 text-foreground">
        U · J = {terms.map((t) => t.product.toFixed(2)).join(" + ")} = {dotSum.toFixed(3)}
      </p>
      <p>
        ‖U‖ = {magA.toFixed(3)}, ‖J‖ = {magB.toFixed(3)}
      </p>
      <p className="text-foreground">
        cos θ = {dotSum.toFixed(3)} / ({magA.toFixed(3)} × {magB.toFixed(3)}) ={" "}
        <span className="font-semibold text-primary">{cosine.toFixed(3)}</span>
      </p>
    </div>
  );
}

// A left-to-right (stacked on mobile) sequence of labeled stages — the
// actual mechanism behind a number, not just the number itself.
export function MechanismFlow({ steps }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border bg-card p-4">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-4.5 text-primary" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            {i < steps.length - 1 ? (
              <div className="flex items-center justify-center py-1 sm:px-1 sm:py-0">
                <ArrowRight className="size-4 shrink-0 rotate-90 text-muted-foreground sm:rotate-0" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// A small self-attention grid: row token → column token, shaded by how
// strongly the row token "attends to" the column token. This is the real
// mechanism that produces the per-word emphasis shown elsewhere as a
// single illustrative weight — a learned softmax(Q·Kᵀ) score, not a
// hand-picked rubric.
export function AttentionMatrix({ tokens, matrix, note }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="border-collapse text-center">
          <thead>
            <tr>
              <th className="p-1" />
              {tokens.map((t) => (
                <th key={t} className="max-w-12 truncate p-1 text-[10px] font-medium text-muted-foreground">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokens.map((rowToken, ri) => (
              <tr key={rowToken}>
                <th className="max-w-24 truncate p-1 pr-2 text-right text-[11px] font-medium text-muted-foreground">
                  {rowToken}
                </th>
                {tokens.map((colToken, ci) => {
                  const v = matrix[ri][ci];
                  return (
                    <td key={colToken} className="p-0.5">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: (ri * tokens.length + ci) * 0.02 }}
                        className="size-7 rounded-md sm:size-8"
                        style={{ backgroundColor: "var(--color-chart-2)", opacity: Math.max(v, 0.08) }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="mt-2.5 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}
