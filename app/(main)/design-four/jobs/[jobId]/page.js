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
import { CoverLetterDialog } from "@/components/shared/cover-letter-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { getJob, currentUser, skillGapsByRole } from "@/lib/data";

export default function JobDetailPane() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const [savedState, setSavedState] = useState(job?.savedState ?? "matched");

  if (!job) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="Job not found"
          description="This listing may have been removed."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/design-four/jobs">Back to list</Link>
            </Button>
          }
        />
      </div>
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
    <div className="mx-auto max-w-2xl p-6">
      <Link
        href="/design-four/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground lg:hidden"
      >
        <ArrowLeft className="size-3.5" />
        Back to list
      </Link>

      <p className="text-xs font-medium text-muted-foreground">
        {job.matchScore}% match &middot; {job.platform}
        {dismissed ? " · Dismissed" : ""}
      </p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {job.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
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

      <div className="mt-6 grid gap-2 rounded-lg border border-border p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Semantic similarity</p>
          <p className="text-sm font-medium tabular-nums text-foreground">
            {job.semanticScore}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Personalized signal</p>
          <p className="text-sm font-medium tabular-nums text-foreground">
            {job.collaborativeScore}%
          </p>
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

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Required skills
            </h2>
            {hasGapReport ? (
              <Link
                href={`/design-four/skill-gaps?job=${job.id}`}
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
