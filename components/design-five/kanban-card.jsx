"use client";

import Link from "next/link";
import { CalendarDays, Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoverLetterDialog } from "@/components/shared/cover-letter-dialog";
import { applicationStatuses } from "@/lib/data";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

export function KanbanCard({ row, job, onAddTag, onRemoveTag, onStatusChange }) {
  const [addingTag, setAddingTag] = useState(false);
  const [tagDraft, setTagDraft] = useState("");

  const commitTag = () => {
    const value = tagDraft.trim();
    if (value) onAddTag(row.jobId, value);
    setTagDraft("");
    setAddingTag(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/design-five/jobs/${job.id}`}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {job.title}
          </Link>
          <p className="text-xs text-muted-foreground">
            {job.company} &middot; {job.matchScore}% match
          </p>
        </div>
      </div>

      <Select value={row.status} onValueChange={(value) => onStatusChange(row.jobId, value)}>
        <SelectTrigger size="sm" className="mt-2 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {applicationStatuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-2 flex flex-wrap items-center gap-1">
        {row.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-[11px]">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag} tag`}
              onClick={() => onRemoveTag(row.jobId, tag)}
              className="rounded-full p-0.5 hover:bg-foreground/10"
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
        {addingTag ? (
          <Input
            autoFocus
            value={tagDraft}
            onChange={(event) => setTagDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitTag();
              if (event.key === "Escape") {
                setTagDraft("");
                setAddingTag(false);
              }
            }}
            onBlur={commitTag}
            placeholder="Tag"
            className="h-5 w-16 text-[11px]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingTag(true)}
            className="inline-flex items-center rounded-full border border-dashed border-border p-0.5 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            aria-label="Add tag"
          >
            <Plus className="size-2.5" />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        {row.interviewDate ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3" />
            {formatDate(row.interviewDate)}
          </span>
        ) : (
          <span />
        )}
        <CoverLetterDialog
          job={job}
          trigger={
            <button
              type="button"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              {row.hasDraft ? "Review draft" : "Generate draft"}
            </button>
          }
        />
      </div>
    </div>
  );
}
