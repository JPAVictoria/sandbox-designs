"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function JobLine({ job, showActions = false, onSave, onDismiss }) {
  const saved = job.savedState === "saved";
  const dismissed = job.savedState === "dismissed";

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-4",
        dismissed && "opacity-60"
      )}
    >
      <Link href={`/design-three/jobs/${job.id}`} className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          <span className="text-foreground">{job.matchScore}% match</span> &middot;{" "}
          {job.platform} &middot; {job.location}
        </p>
        <p className="text-sm font-medium text-foreground hover:text-primary">
          {job.title}
        </p>
        <p className="text-xs text-muted-foreground">{job.company}</p>
      </Link>

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
