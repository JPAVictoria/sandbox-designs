import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { PageHeader } from "@/components/design-eight/page-header";
import {
  jobs,
  applications,
  applicationStatuses,
  skillGapsByRole,
  draftsByJobId,
  courses,
  currentUser,
  getJob,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const ranked = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  const topMatches = ranked.slice(0, 5);
  const newMatchCount = jobs.filter((job) => job.savedState === "matched").length;
  const skillGapCount = Object.values(skillGapsByRole).reduce(
    (sum, role) => sum + role.missingSkills.length,
    0
  );
  const draftEntries = Object.entries(draftsByJobId);
  const pipelineCounts = applicationStatuses.map((status) => ({
    ...status,
    count: applications.filter((app) => app.status === status.value).length,
  }));
  const recommendedCourses = courses.filter((course) => !course.saved).slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's new with your matches, skill gaps, and applications."
      />

      <div className="mb-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">New Matches</th>
              <th className="px-3 py-2 font-medium">Skill Gaps</th>
              {pipelineCounts.map((status) => (
                <th key={status.value} className="px-3 py-2 font-medium">
                  {status.label}
                </th>
              ))}
              <th className="px-3 py-2 font-medium">Drafts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-r border-border px-3 py-2 font-mono tabular-nums text-foreground">
                {newMatchCount}
              </td>
              <td className="border-r border-border px-3 py-2 font-mono tabular-nums text-foreground">
                {skillGapCount}
              </td>
              {pipelineCounts.map((status) => (
                <td
                  key={status.value}
                  className="border-r border-border px-3 py-2 font-mono tabular-nums text-foreground"
                >
                  {status.count}
                </td>
              ))}
              <td className="px-3 py-2 font-mono tabular-nums text-foreground">
                {draftEntries.length}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Top matches</h2>
        <Link
          href="/design-eight/jobs"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mb-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Match</th>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Company</th>
              <th className="px-3 py-2 font-medium">Platform</th>
            </tr>
          </thead>
          <tbody>
            {topMatches.map((job, index) => (
              <tr
                key={job.id}
                className={cn(
                  "border-b border-border last:border-b-0",
                  index % 2 === 1 && "bg-muted/20"
                )}
              >
                <td className="px-3 py-2 font-mono tabular-nums text-foreground">
                  {job.matchScore}%
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={`/design-eight/jobs/${job.id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {job.title}
                  </Link>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {job.company}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {job.platform}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draftEntries.length > 0 ? (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Drafts awaiting review
          </h2>
          <div className="flex flex-col gap-2">
            {draftEntries.map(([jobId]) => {
              const job = getJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/design-eight/jobs/${jobId}`}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 hover:border-primary/40"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
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
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recommended courses
          </h2>
          <Link
            href="/design-eight/courses"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">Course</th>
                <th className="px-3 py-2 font-medium">Provider</th>
                <th className="px-3 py-2 font-medium">Skill</th>
              </tr>
            </thead>
            <tbody>
              {recommendedCourses.map((course, index) => (
                <tr
                  key={course.id}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    index % 2 === 1 && "bg-muted/20"
                  )}
                >
                  <td className="px-3 py-2 font-medium text-foreground">
                    {course.title}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {course.provider}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {course.skillTag}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
