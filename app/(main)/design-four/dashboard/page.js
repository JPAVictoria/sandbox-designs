import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { PageHeader } from "@/components/design-four/page-header";
import { StatStrip } from "@/components/design-four/stat-strip";
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
  const topMatches = ranked.slice(0, 4);
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
    <div className="mx-auto max-w-3xl p-6 lg:p-10">
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's new with your matches, skill gaps, and applications."
      />

      <StatStrip
        stats={[
          { label: "New Matches", value: newMatchCount },
          { label: "Skill Gaps", value: skillGapCount },
          { label: "Active Applications", value: activeApplications.length },
          { label: "Drafts Waiting", value: draftEntries.length },
        ]}
      />

      <div className="mt-8">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Top matches</h2>
          <Link
            href="/design-four/jobs"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div>
          {topMatches.map((job) => (
            <Link
              key={job.id}
              href={`/design-four/jobs/${job.id}`}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-muted"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {job.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {job.company} &middot; {job.platform}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                {job.matchScore}%
              </span>
            </Link>
          ))}
        </div>
      </div>

      {draftEntries.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-1 text-sm font-semibold text-foreground">
            Drafts awaiting review
          </h2>
          <div>
            {draftEntries.map(([jobId]) => {
              const job = getJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/design-four/jobs/${jobId}`}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">
                      {job.title} at {job.company}
                    </p>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recommended courses
          </h2>
          <Link
            href="/design-four/courses"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div>
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-four/courses?skill=${encodeURIComponent(course.skillTag)}`}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-muted"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {course.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {course.provider} &middot; {course.skillTag}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
