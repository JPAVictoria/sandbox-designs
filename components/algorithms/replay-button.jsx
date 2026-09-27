"use client";

import { RotateCcw } from "lucide-react";

export function ReplayButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <RotateCcw className="size-3.5" strokeWidth={1.75} />
      Replay
    </button>
  );
}
