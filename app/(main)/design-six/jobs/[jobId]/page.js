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
import { BentoTile } from "@/components/design-six/bento-tile";
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
            <Link href="/design-six/jobs">Back to Jobs</Link>
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
    <div className="max-w-3xl">
      <Link
        href="/design-six/jobs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Jobs
      </Link>

      <BentoTile className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">
            {job.platform}
            {dismissed ? " · Dismissed" : ""}
          </Badge>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {job.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.company} &middot; {job.location}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.salaryRange} &middot; Posted{" "}
            {new Date(job.postedAt).toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric",
            })}
          </p>
          <div className="mt-3 flex items-center gap-2">
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
        <div className="shrink-0 text-right">
          <p className="text-4xl font-bold tabular-nums text-primary">
            {job.matchScore}%
          </p>
          <p className="text-xs text-muted-foreground">match score</p>
        </div>
      </BentoTile>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
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
                  href={`/design-six/skill-gaps?job=${job.id}`}
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

        <BentoTile className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">
            Match breakdown
          </p>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Semantic similarity</span>
              <span className="font-medium tabular-nums text-foreground">
                {job.semanticScore}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${job.semanticScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Personalized signal</span>
              <span className="font-medium tabular-nums text-foreground">
                {job.collaborativeScore}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${job.collaborativeScore}%` }}
              />
            </div>
          </div>
        </BentoTile>
      </div>
    </div>
  );
}
