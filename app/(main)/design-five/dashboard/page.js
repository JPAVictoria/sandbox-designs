import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { PageHeader } from "@/components/design-five/page-header";
import { JobTile } from "@/components/design-five/job-tile";
import {
  jobs,
  applications,
  applicationStatuses,
  draftsByJobId,
  courses,
  currentUser,
  getJob,
} from "@/lib/data";

export default function DashboardPage() {
  const ranked = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  const topMatches = ranked.slice(0, 3);
  const newMatchCount = jobs.filter((job) => job.savedState === "matched").length;
  const draftEntries = Object.entries(draftsByJobId);
  const pipelineCounts = applicationStatuses.map((status) => ({
    ...status,
    count: applications.filter((app) => app.status === status.value).length,
  }));
  const recommendedCourses = courses.filter((course) => !course.saved).slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's new with your matches, skill gaps, and applications."
        actions={
          <Link
            href="/design-five/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Browse jobs
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-medium text-foreground">
            Application pipeline
          </p>
          <Link
            href="/design-five/applications"
            className="text-xs font-medium text-primary hover:underline"
          >
            Open board
          </Link>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border sm:grid-cols-6">
          {pipelineCounts.map((status) => (
            <div key={status.value} className="px-3 py-3 text-center">
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {status.count}
              </p>
              <p className="text-[11px] text-muted-foreground">{status.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Top matches ({newMatchCount} new)
          </h2>
          <Link
            href="/design-five/jobs"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {topMatches.map((job) => (
            <JobTile key={job.id} job={job} />
          ))}
        </div>
      </section>

      {draftEntries.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Drafts awaiting review
          </h2>
          <div className="flex flex-col gap-2">
            {draftEntries.map(([jobId]) => {
              const job = getJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/design-five/jobs/${jobId}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/40"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {job.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {job.company}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-primary">
                    Review
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recommended courses
          </h2>
          <Link
            href="/design-five/courses"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-five/courses?skill=${encodeURIComponent(course.skillTag)}`}
              className="rounded-lg border border-border bg-card p-4 text-sm hover:border-primary/40"
            >
              <p className="font-medium text-foreground">{course.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {course.provider} &middot; {course.skillTag}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
