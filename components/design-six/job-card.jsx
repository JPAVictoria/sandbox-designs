"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function JobCard({ job, showActions = false, onSave, onDismiss }) {
  const saved = job.savedState === "saved";
  const dismissed = job.savedState === "dismissed";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50",
        dismissed && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link href={`/design-six/jobs/${job.id}`} className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {job.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {job.company} &middot; {job.platform}
          </p>
        </Link>
        <span className="shrink-0 text-2xl font-bold tabular-nums text-primary">
          {job.matchScore}
          <span className="text-sm font-medium">%</span>
        </span>
      </div>

      {showActions ? (
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onSave?.(job.id)}
          >
            {saved ? (
              <BookmarkCheck className="size-3.5 text-primary" />
            ) : (
              <Bookmark className="size-3.5" />
            )}
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Dismiss job"
            onClick={() => onDismiss?.(job.id)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
