"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/design-two/score-ring";

export function JobCard({ job, showActions = false, onSave, onDismiss, className }) {
  const saved = job.savedState === "saved";
  const dismissed = job.savedState === "dismissed";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border p-5 transition-colors hover:border-primary/40",
        dismissed && "opacity-60",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge variant="outline">{job.platform}</Badge>
        <ScoreRing score={job.matchScore} size={48} strokeWidth={4} />
      </div>

      <Link href={`/design-two/jobs/${job.id}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {job.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {job.company}
        </p>
        <p className="truncate text-xs text-muted-foreground">{job.location}</p>
      </Link>

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
