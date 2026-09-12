import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { PageHeader } from "@/components/design-seven/page-header";
import { JobRow } from "@/components/design-seven/job-row";
import {
  jobs,
  applications,
  skillGapsByRole,
  draftsByJobId,
  courses,
  currentUser,
  getJob,
} from "@/lib/data";

export default function DashboardPage() {
  const ranked = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  const topMatches = ranked.slice(0, 3);
  const newMatchCount = jobs.filter((job) => job.savedState === "matched").length;
  const skillGapCount = Object.values(skillGapsByRole).reduce(
    (sum, role) => sum + role.missingSkills.length,
    0
  );
  const activeApplications = applications.filter(
    (app) => app.status !== "successful" && app.status !== "unsuccessful"
  );
  const draftEntries = Object.entries(draftsByJobId);
  const recommendedCourses = courses.filter((course) => !course.saved).slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's new with your matches, skill gaps, and applications."
      />

      <div className="mb-8 flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-xs text-muted-foreground">
        Press
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-medium">
          ⌘K
        </kbd>
        to search jobs or jump to any page.
      </div>

      <div className="mb-8 grid grid-cols-2 divide-x divide-border rounded-lg border border-border sm:grid-cols-4">
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">New Matches</p>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {newMatchCount}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Skill Gaps</p>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {skillGapCount}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Applications</p>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {activeApplications.length}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Drafts</p>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {draftEntries.length}
          </p>
        </div>
      </div>

      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Top matches</h2>
        <Link
          href="/design-seven/jobs"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mb-8 divide-y divide-border">
        {topMatches.map((job) => (
          <JobRow key={job.id} job={job} />
        ))}
      </div>

      {draftEntries.length > 0 ? (
        <div className="mb-8">
          <h2 className="mb-1 text-sm font-semibold text-foreground">
            Drafts awaiting review
          </h2>
          <div className="divide-y divide-border">
            {draftEntries.map(([jobId]) => {
              const job = getJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/design-seven/jobs/${jobId}`}
                  className="flex items-center gap-3 py-3 text-sm hover:text-primary"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-foreground">
                    {job.title} at {job.company}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recommended courses
          </h2>
          <Link
            href="/design-seven/courses"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-seven/courses?skill=${encodeURIComponent(course.skillTag)}`}
              className="flex items-center justify-between gap-3 py-3 text-sm hover:text-primary"
            >
              <span className="min-w-0 flex-1 truncate">{course.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {course.provider}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
