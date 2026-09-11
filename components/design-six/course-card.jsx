"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CourseCard({ course, saved, onToggleSave }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
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
      <div>
        <p className="text-sm font-semibold text-foreground">{course.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {course.provider} &middot; {course.level} &middot; {course.duration}
        </p>
      </div>
      <Button variant="outline" size="sm" className="mt-auto w-fit">
        View course
        <ExternalLink className="size-3.5" />
      </Button>
    </div>
  );
}
