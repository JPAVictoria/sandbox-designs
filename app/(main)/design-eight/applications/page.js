"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, ClipboardList } from "lucide-react";
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
import { PageHeader } from "@/components/design-eight/page-header";
import { CoverLetterDialog } from "@/components/shared/cover-letter-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { applications as initialApplications, applicationStatuses, getJob } from "@/lib/data";
import { cn } from "@/lib/utils";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

function TagsCell({ row, onAddTag, onRemoveTag }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (value) onAddTag(row.jobId, value);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
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
      {adding ? (
        <Input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
            if (event.key === "Escape") {
              setDraft("");
              setAdding(false);
            }
          }}
          onBlur={commit}
          placeholder="Tag"
          className="h-5 w-16 text-[11px]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center rounded-full border border-dashed border-border p-0.5 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          aria-label="Add tag"
        >
          <Plus className="size-2.5" />
        </button>
      )}
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

  const filteredRows =
    statusFilter === "all" ? rows : rows.filter((row) => row.status === statusFilter);

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track saved jobs through your application pipeline."
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
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
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">Job</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Tags</th>
                <th className="px-3 py-2 font-medium">Interview</th>
                <th className="px-3 py-2 font-medium">Draft</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => {
                const job = getJob(row.jobId);
                if (!job) return null;
                return (
                  <tr
                    key={row.jobId}
                    className={cn(
                      "border-b border-border last:border-b-0",
                      index % 2 === 1 && "bg-muted/20"
                    )}
                  >
                    <td className="px-3 py-2">
                      <Link
                        href={`/design-eight/jobs/${job.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </td>
                    <td className="px-3 py-2">
                      <Select
                        value={row.status}
                        onValueChange={(value) => handleStatusChange(row.jobId, value)}
                      >
                        <SelectTrigger size="sm" className="w-[150px]">
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
                    </td>
                    <td className="px-3 py-2">
                      <TagsCell
                        row={row}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {row.interviewDate ? formatDate(row.interviewDate) : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <CoverLetterDialog
                        job={job}
                        trigger={
                          <button
                            type="button"
                            className="font-medium text-primary hover:underline"
                          >
                            {row.hasDraft ? "Review" : "Generate"}
                          </button>
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications here yet"
          description="Save a job from your matches to start tracking it through your pipeline."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/design-eight/jobs">Browse jobs</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
