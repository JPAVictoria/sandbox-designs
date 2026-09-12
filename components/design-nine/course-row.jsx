"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CourseRow({ course, saved, onToggleSave }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border p-4">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="outline">{course.skillTag}</Badge>
        </div>
        <p className="truncate text-sm font-medium text-foreground">
          {course.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {course.provider} &middot; {course.level} &middot; {course.duration}
        </p>
      </div>
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
