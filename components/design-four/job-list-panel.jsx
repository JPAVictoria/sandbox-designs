"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Bookmark, BookmarkCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jobs as initialJobs } from "@/lib/data";

export function JobListPanel({ selectedId }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [query, setQuery] = useState("");

  const handleSave = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, savedState: job.savedState === "saved" ? "matched" : "saved" }
          : job
      )
    );
  };

  const handleDismiss = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, savedState: job.savedState === "dismissed" ? "matched" : "dismissed" }
          : job
      )
    );
  };

  const filtered = useMemo(() => {
    const ranked = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
    if (query.trim().length === 0) return ranked;
    return ranked.filter(
      (job) =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase())
    );
  }, [jobs, query]);

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-r border-border lg:w-80">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search jobs..."
            className="h-8 pl-8"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((job) => {
          const active = job.id === selectedId;
          const saved = job.savedState === "saved";
          const dismissed = job.savedState === "dismissed";
          return (
            <Link
              key={job.id}
              href={`/design-four/jobs/${job.id}`}
              className={cn(
                "group flex items-start justify-between gap-2 border-b border-border px-3 py-3 transition-colors",
                active ? "bg-primary/10" : "hover:bg-muted",
                dismissed && "opacity-50"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {job.matchScore}% match
                </p>
                <p
                  className={cn(
                    "truncate text-sm",
                    active ? "font-semibold text-foreground" : "font-medium text-foreground"
                  )}
                >
                  {job.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {job.company}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 has-[:focus-visible]:opacity-100">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={saved ? "Unsave job" : "Save job"}
                  onClick={(event) => {
                    event.preventDefault();
                    handleSave(job.id);
                  }}
                >
                  {saved ? (
                    <BookmarkCheck className="size-3.5 text-primary" />
                  ) : (
                    <Bookmark className="size-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Dismiss job"
                  onClick={(event) => {
                    event.preventDefault();
                    handleDismiss(job.id);
                  }}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
