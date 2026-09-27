"use client";

import { cn } from "@/lib/utils";

export function StepTabs({ steps, step, onSelect }) {
  return (
    <div className="mb-6 flex flex-wrap gap-1.5">
      {steps.map((s, i) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            i === step
              ? "bg-primary text-primary-foreground"
              : i < step
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
