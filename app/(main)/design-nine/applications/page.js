"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, ClipboardList, Plus, X } from "lucide-react";
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
import { PageHeader } from "@/components/design-nine/page-header";
import { TimelineEntry } from "@/components/design-nine/timeline-entry";
import { CoverLetterDialog } from "@/components/shared/cover-letter-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { applications as initialApplications, applicationStatuses, getJob } from "@/lib/data";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const [addingTagFor, setAddingTagFor] = useState(null);
  const [tagDraft, setTagDraft] = useState("");

  const handleStatusChange = (jobId, status) => {
    setRows((prev) => prev.map((row) => (row.jobId === jobId ? { ...row, status } : row)));
  };

  const commitTag = (jobId) => {
    const value = tagDraft.trim();
    if (value) {
      setRows((prev) =>
        prev.map((row) =>
          row.jobId === jobId && !row.tags.includes(value)
            ? { ...row, tags: [...row.tags, value] }
            : row
        )
      );
    }
    setTagDraft("");
    setAddingTagFor(null);
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

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Your job search, as a timeline — track saved jobs through your pipeline."
      />

      {rows.length > 0 ? (
        <div>
          {rows.map((row, index) => {
            const job = getJob(row.jobId);
            if (!job) return null;
            const statusLabel =
              applicationStatuses.find((s) => s.value === row.status)?.label ??
              row.status;
            return (
              <TimelineEntry
                key={row.jobId}
                icon={ClipboardList}
                isLast={index === rows.length - 1}
              >
                <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/design-nine/jobs/${job.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {job.company} &middot; {job.platform}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {row.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                          {tag}
                          <button
                            type="button"
                            aria-label={`Remove ${tag} tag`}
                            onClick={() => handleRemoveTag(row.jobId, tag)}
                            className="rounded-full p-0.5 hover:bg-foreground/10"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                      {addingTagFor === row.jobId ? (
                        <Input
                          autoFocus
                          value={tagDraft}
                          onChange={(event) => setTagDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") commitTag(row.jobId);
                            if (event.key === "Escape") {
                              setTagDraft("");
                              setAddingTagFor(null);
                            }
                          }}
                          onBlur={() => commitTag(row.jobId)}
                          placeholder="Tag name"
                          className="h-6 w-24 text-xs"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAddingTagFor(row.jobId)}
                          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        >
                          <Plus className="size-3" />
                          Add tag
                        </button>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {row.interviewDate ? (
                        formatDate(row.interviewDate)
                      ) : (
                        <label className="cursor-pointer underline decoration-dotted underline-offset-2 hover:text-foreground">
                          Set interview date
                          <input
                            type="date"
                            className="sr-only"
                            onChange={(event) =>
                              handleSetInterviewDate(row.jobId, event.target.value)
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <Select
                      value={row.status}
                      onValueChange={(value) => handleStatusChange(row.jobId, value)}
                    >
                      <SelectTrigger size="sm" className="w-[160px]">
                        <SelectValue>{statusLabel}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {applicationStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CoverLetterDialog
                      job={job}
                      trigger={
                        <Button variant="outline" size="sm">
                          {row.hasDraft ? "Review draft" : "Generate draft"}
                        </Button>
                      }
                    />
                  </div>
                </div>
              </TimelineEntry>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications here yet"
          description="Save a job from your matches to start tracking it through your pipeline."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/design-nine/jobs">Browse jobs</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
