"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CourseRow({ course, saved, onToggleSave }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-muted">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {course.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {course.provider} &middot; {course.level} &middot; {course.duration}
        </p>
      </div>
      <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
        {course.skillTag}
      </Badge>
      <div className="flex shrink-0 items-center gap-1">
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
