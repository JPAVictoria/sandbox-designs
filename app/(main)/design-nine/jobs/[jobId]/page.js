"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  X,
  Sparkles,
  CheckCircle2,
  Circle,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoverLetterDialog } from "@/components/shared/cover-letter-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { getJob, currentUser, skillGapsByRole } from "@/lib/data";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const [savedState, setSavedState] = useState(job?.savedState ?? "matched");

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="This listing may have been removed."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/design-nine/jobs">Back to Jobs</Link>
          </Button>
        }
      />
    );
  }

  const saved = savedState === "saved";
  const dismissed = savedState === "dismissed";
  const matchedSkills = job.requiredSkills.filter((skill) =>
    currentUser.skills.includes(skill)
  );
  const missingSkills = job.requiredSkills.filter(
    (skill) => !currentUser.skills.includes(skill)
  );
  const hasGapReport = Boolean(skillGapsByRole[job.id]);

  return (
    <div>
      <Link
        href="/design-nine/jobs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Jobs
      </Link>

      <div className="flex flex-col gap-4 rounded-lg border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 shrink-0 text-center">
            <p className="text-2xl font-semibold tabular-nums text-primary">
              {job.matchScore}
              <span className="text-sm font-medium text-muted-foreground">%</span>
            </p>
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{job.platform}</Badge>
              {dismissed ? <Badge variant="outline">Dismissed</Badge> : null}
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {job.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {job.company} &middot; {job.location}
            </p>
            <p className="text-sm text-muted-foreground">
              {job.salaryRange} &middot; Posted{" "}
              {new Date(job.postedAt).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSavedState((prev) => (prev === "saved" ? "matched" : "saved"))
            }
          >
            {saved ? (
              <BookmarkCheck className="size-4 text-primary" />
            ) : (
              <Bookmark className="size-4" />
            )}
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Dismiss job"
            onClick={() =>
              setSavedState((prev) => (prev === "dismissed" ? "matched" : "dismissed"))
            }
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            About this role
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {job.description}
          </p>
        </section>

        <section className="rounded-lg border border-border p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Match breakdown
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Semantic similarity</span>
              <span className="font-medium tabular-nums text-foreground">
                {job.semanticScore}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Personalized signal</span>
              <span className="font-medium tabular-nums text-foreground">
                {job.collaborativeScore}%
              </span>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Required skills
            </h2>
            {hasGapReport ? (
              <Link
                href={`/design-nine/skill-gaps?job=${job.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Target className="size-3.5" />
                View skill gap report
              </Link>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-foreground"
              >
                <CheckCircle2 className="size-3.5 text-primary" />
                {skill}
              </span>
            ))}
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                <Circle className="size-3.5" />
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Ready to apply?
          </h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Generate a tailored cover letter and application email based on this
            job and your profile. You&apos;ll review it before anything is sent.
          </p>
          <CoverLetterDialog
            job={job}
            trigger={
              <Button size="sm">
                <Sparkles className="size-4" />
                Generate cover letter &amp; email
              </Button>
            }
          />
        </section>
      </div>
    </div>
  );
}
