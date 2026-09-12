"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function JobRow({ job, showActions = false, onSave, onDismiss }) {
  const saved = job.savedState === "saved";
  const dismissed = job.savedState === "dismissed";

  return (
    <div
      className={cn(
        "group flex items-start justify-between gap-4 border-l-2 border-transparent py-4 pl-4 transition-colors hover:border-primary hover:bg-accent/40",
        dismissed && "opacity-60"
      )}
    >
      <Link href={`/design-seven/jobs/${job.id}`} className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          <span className="text-foreground">{job.matchScore}% match</span> &middot;{" "}
          {job.platform} &middot; {job.location}
        </p>
        <p className="text-sm font-medium text-foreground">{job.title}</p>
        <p className="text-xs text-muted-foreground">{job.company}</p>
      </Link>

      {showActions ? (
        <div className="flex shrink-0 items-center gap-1 pr-2">
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
