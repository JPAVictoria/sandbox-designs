"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CourseCard({ course, saved, onToggleSave }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="outline">{course.skillTag}</Badge>
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
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{course.title}</p>
        <p className="text-xs text-muted-foreground">
          {course.provider} &middot; {course.level} &middot; {course.duration}
        </p>
      </div>

      <Button variant="outline" size="sm" className="mt-1 w-fit">
        View course
        <ExternalLink className="size-3.5" />
      </Button>
    </div>
  );
}
