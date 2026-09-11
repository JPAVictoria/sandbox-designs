import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/design-six/page-header";
import { BentoTile } from "@/components/design-six/bento-tile";
import { JobCard } from "@/components/design-six/job-card";
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
  const topMatch = ranked[0];
  const moreMatches = ranked.slice(1, 4);
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

      <div className="grid gap-4 lg:grid-cols-3">
        <BentoTile className="flex flex-col justify-between lg:col-span-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Your top match
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {topMatch.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {topMatch.company} &middot; {topMatch.location}
            </p>
            <p className="mt-4 text-4xl font-bold tabular-nums text-primary">
              {topMatch.matchScore}%
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                match
              </span>
            </p>
          </div>
          <Button asChild className="mt-4 w-fit">
            <Link href={`/design-six/jobs/${topMatch.id}`}>
              View this match
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </BentoTile>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <BentoTile>
            <p className="text-xs text-muted-foreground">New Matches</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {newMatchCount}
            </p>
          </BentoTile>
          <BentoTile>
            <p className="text-xs text-muted-foreground">Skill Gaps</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {skillGapCount}
            </p>
          </BentoTile>
          <BentoTile>
            <p className="text-xs text-muted-foreground">Active Applications</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {activeApplications.length}
            </p>
          </BentoTile>
          <BentoTile>
            <p className="text-xs text-muted-foreground">Drafts Waiting</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {draftEntries.length}
            </p>
          </BentoTile>
        </div>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">More matches</h2>
          <Link
            href="/design-six/jobs"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {moreMatches.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {draftEntries.length > 0 ? (
        <BentoTile className="mt-6">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Drafts awaiting review
          </p>
          <div className="flex flex-col gap-2">
            {draftEntries.map(([jobId]) => {
              const job = getJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/design-six/jobs/${jobId}`}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted"
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
        </BentoTile>
      ) : null}

      <BentoTile className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            Recommended courses
          </p>
          <Link
            href="/design-six/courses"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-six/courses?skill=${encodeURIComponent(course.skillTag)}`}
              className="rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
            >
              <p className="font-medium text-foreground">{course.title}</p>
              <p className="text-xs text-muted-foreground">
                {course.provider} &middot; {course.skillTag}
              </p>
            </Link>
          ))}
        </div>
      </BentoTile>
    </div>
  );
}
