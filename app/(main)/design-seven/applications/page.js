"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus, X, ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/design-seven/page-header";
import { CoverLetterDialog } from "@/components/shared/cover-letter-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { applications as initialApplications, applicationStatuses, getJob } from "@/lib/data";
import { cn } from "@/lib/utils";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ApplicationRow({ row, onStatusChange, onAddTag, onRemoveTag, onSetInterviewDate }) {
  const [addingTag, setAddingTag] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const job = getJob(row.jobId);
  if (!job) return null;

  const commitTag = () => {
    const value = tagDraft.trim();
    if (value) onAddTag(row.jobId, value);
    setTagDraft("");
    setAddingTag(false);
  };

  return (
    <div className="border-l-2 border-transparent py-5 pl-4 transition-colors hover:border-primary hover:bg-accent/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href={`/design-seven/jobs/${job.id}`}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {job.title}
          </Link>
          <p className="text-xs text-muted-foreground">
            {job.company} &middot; {job.platform}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 pr-2">
          <Select value={row.status} onValueChange={(value) => onStatusChange(row.jobId, value)}>
            <SelectTrigger size="sm" className="w-[160px]">
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
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 pr-2">
        {row.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag} tag`}
              onClick={() => onRemoveTag(row.jobId, tag)}
              className="rounded-full p-0.5 hover:bg-foreground/10"
            >
              <X className="size-3" />
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
            placeholder="Tag name"
            className="h-6 w-24 text-xs"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingTag(true)}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          >
            <Plus className="size-3" />
            Add tag
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 pr-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {row.interviewDate ? (
            formatDate(row.interviewDate)
          ) : (
            <label className="cursor-pointer underline decoration-dotted underline-offset-2 hover:text-foreground">
              Set interview date
              <input
                type="date"
                className="sr-only"
                onChange={(event) => onSetInterviewDate(row.jobId, event.target.value)}
              />
            </label>
          )}
        </span>
        <CoverLetterDialog
          job={job}
          trigger={
            <button type="button" className="font-medium text-primary hover:underline">
              {row.hasDraft ? "Review draft" : "Generate draft"}
            </button>
          }
        />
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [rows, setRows] = useState(() =>
    initialApplications.map((app) => {
      const job = getJob(app.jobId);
      return {
        ...app,
        tags: job?.tags ?? [],
        interviewDate: job?.interviewDate ?? null,
      };
    })
  );
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusChange = (jobId, status) => {
    setRows((prev) => prev.map((row) => (row.jobId === jobId ? { ...row, status } : row)));
  };

  const handleAddTag = (jobId, tag) => {
    setRows((prev) =>
      prev.map((row) =>
        row.jobId === jobId && !row.tags.includes(tag)
          ? { ...row, tags: [...row.tags, tag] }
          : row
      )
    );
  };

  const handleRemoveTag = (jobId, tag) => {
    setRows((prev) =>
      prev.map((row) =>
        row.jobId === jobId
          ? { ...row, tags: row.tags.filter((item) => item !== tag) }
          : row
      )
    );
  };

  const handleSetInterviewDate = (jobId, value) => {
    setRows((prev) =>
      prev.map((row) => (row.jobId === jobId ? { ...row, interviewDate: value } : row))
    );
  };

  const filteredRows =
    statusFilter === "all" ? rows : rows.filter((row) => row.status === statusFilter);

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track saved jobs through your application pipeline."
      />

      <div className="mb-2 flex flex-wrap gap-1.5">
        <Button
          variant={statusFilter === "all" ? "secondary" : "ghost"}
          size="sm"
          className={cn(statusFilter === "all" && "text-foreground")}
          onClick={() => setStatusFilter("all")}
        >
          All
        </Button>
        {applicationStatuses.map((status) => (
          <Button
            key={status.value}
            variant={statusFilter === status.value ? "secondary" : "ghost"}
            size="sm"
            className={cn(statusFilter === status.value && "text-foreground")}
            onClick={() => setStatusFilter(status.value)}
          >
            {status.label}
          </Button>
        ))}
      </div>

      {filteredRows.length > 0 ? (
        <div className="divide-y divide-border">
          {filteredRows.map((row) => (
            <ApplicationRow
              key={row.jobId}
              row={row}
              onStatusChange={handleStatusChange}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onSetInterviewDate={handleSetInterviewDate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications here yet"
          description="Save a job from your matches to start tracking it through your pipeline."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/design-seven/jobs">Browse jobs</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
