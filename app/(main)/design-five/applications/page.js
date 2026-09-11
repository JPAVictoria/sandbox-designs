"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/design-five/page-header";
import { KanbanBoard } from "@/components/design-five/kanban-board";
import { EmptyState } from "@/components/shared/empty-state";
import { applications as initialApplications, getJob } from "@/lib/data";

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

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track saved jobs through your application pipeline. Move a card between columns with its status control."
      />

      {rows.length > 0 ? (
        <KanbanBoard
          rows={rows}
          onStatusChange={handleStatusChange}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications here yet"
          description="Save a job from your matches to start tracking it through your pipeline."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/design-five/jobs">Browse jobs</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
