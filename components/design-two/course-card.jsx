"use client";

import { BookOpen, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CourseCard({ course, saved, onToggleSave }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="size-4.5" strokeWidth={1.75} />
        </div>
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

      <div className="space-y-1.5">
        <Badge variant="outline">{course.skillTag}</Badge>
        <p className="text-sm font-semibold text-foreground">{course.title}</p>
        <p className="text-xs text-muted-foreground">
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
