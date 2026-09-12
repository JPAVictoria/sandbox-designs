"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function JobRow({ job, showActions = false, onSave, onDismiss }) {
  const saved = job.savedState === "saved";
  const dismissed = job.savedState === "dismissed";

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/40",
        dismissed && "opacity-60"
      )}
    >
      <div className="w-12 shrink-0 text-center">
        <p className="text-lg font-semibold tabular-nums text-primary">
          {job.matchScore}
          <span className="text-xs font-medium text-muted-foreground">%</span>
        </p>
      </div>
      <Link href={`/design-nine/jobs/${job.id}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {job.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {job.company} &middot; {job.location}
        </p>
      </Link>
      <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
        {job.platform}
      </Badge>
      {showActions ? (
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={saved ? "Unsave job" : "Save job"}
            onClick={() => onSave?.(job.id)}
          >
            {saved ? (
              <BookmarkCheck className="size-4 text-primary" />
            ) : (
              <Bookmark className="size-4" />
            )}
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
