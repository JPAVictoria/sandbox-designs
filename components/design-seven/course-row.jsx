"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CourseRow({ course, saved, onToggleSave }) {
  return (
    <div className="group flex items-start justify-between gap-4 border-l-2 border-transparent py-4 pl-4 transition-colors hover:border-primary hover:bg-accent/40">
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {course.skillTag} &middot; {course.provider}
        </p>
        <p className="text-sm font-medium text-foreground">{course.title}</p>
        <p className="text-xs text-muted-foreground">
          {course.level} &middot; {course.duration}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 pr-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={saved ? "Unsave course" : "Save course"}
          onClick={() => onToggleSave?.(course.id)}
        >
          {saved ? (
            <BookmarkCheck className="size-4 text-primary" />
          ) : (
            <Bookmark className="size-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Open course">
          <ExternalLink className="size-4" />
        </Button>
      </div>
    </div>
  );
}
