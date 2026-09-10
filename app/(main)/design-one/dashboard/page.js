import Link from "next/link";
import { ArrowRight, Sparkles, Target, ClipboardList, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/design-one/page-header";
import { StatCard } from "@/components/design-one/stat-card";
import { JobRow } from "@/components/design-one/job-row";
import {
  jobs,
  applications,
  statusStyles,
  applicationStatuses,
  skillGapsByRole,
  draftsByJobId,
  courses,
  currentUser,
  getJob,
} from "@/lib/data";

export default function DashboardPage() {
  const newMatches = jobs.filter((job) => job.savedState === "matched");
  const topMatches = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
  const totalSkillGaps = Object.values(skillGapsByRole).reduce(
    (sum, role) => sum + role.missingSkills.length,
    0
  );
  const activeApplications = applications.filter(
    (app) => app.status !== "successful" && app.status !== "unsuccessful"
  );
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
          <Button asChild size="sm">
            <Link href="/design-one/jobs">
              Browse jobs
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="New Matches"
          value={newMatches.length}
          caption="Since your last visit"
          icon={Sparkles}
        />
        <StatCard
          label="Skill Gaps Identified"
          value={totalSkillGaps}
          caption="Across your target roles"
          icon={Target}
        />
        <StatCard
          label="Active Applications"
          value={activeApplications.length}
          caption="In your pipeline"
          icon={ClipboardList}
        />
        <StatCard
          label="Drafts Awaiting Review"
          value={draftEntries.length}
          caption="Ready to send"
          icon={FileText}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Top Matches</h2>
            <Link
              href="/design-one/jobs"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {topMatches.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Application Pipeline
            </h2>
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              {pipelineCounts.map((status) => (
                <div
                  key={status.value}
                  className="flex items-center justify-between py-1 text-sm"
                >
                  <span className="text-muted-foreground">{status.label}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Drafts Awaiting Review
            </h2>
            {draftEntries.length > 0 ? (
              <div className="flex flex-col gap-2">
                {draftEntries.map(([jobId]) => {
                  const job = getJob(jobId);
                  if (!job) return null;
                  return (
                    <Link
                      key={jobId}
                      href={`/design-one/jobs/${jobId}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm hover:border-primary/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
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
            ) : (
              <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                No drafts waiting on you right now.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recommended Courses
          </h2>
          <Link
            href="/design-one/courses"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-one/courses?skill=${encodeURIComponent(course.skillTag)}`}
              className="rounded-lg border border-border p-4 text-sm hover:border-primary/40"
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
