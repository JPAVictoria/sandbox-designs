import Link from "next/link";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/design-two/page-header";
import { SpotlightCard } from "@/components/design-two/spotlight-card";
import { JobCard } from "@/components/design-two/job-card";
import { PipelineStrip } from "@/components/design-two/pipeline-strip";
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
  const [topMatch, ...rest] = ranked;
  const moreMatches = rest.slice(0, 3);
  const draftEntries = Object.entries(draftsByJobId);
  const pipelineCounts = applicationStatuses.map((status) => ({
    ...status,
    count: applications.filter((app) => app.status === status.value).length,
  }));
  const recommendedCourses = courses.filter((course) => !course.saved).slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Welcome back"
        title={`Hi, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's worth your attention today."
      />

      <section className="mb-10">
        <SpotlightCard job={topMatch} />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          More matches for you
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreMatches.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Application pipeline
        </h2>
        <PipelineStrip stages={pipelineCounts} />
      </section>

      {draftEntries.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Drafts awaiting review
          </h2>
          <div className="flex flex-col gap-2">
            {draftEntries.map(([jobId]) => {
              const job = getJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/design-two/jobs/${jobId}`}
                  className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" strokeWidth={1.75} />
                  </div>
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

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recommended courses
          </h2>
          <Link
            href="/design-two/courses"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-two/courses?skill=${encodeURIComponent(course.skillTag)}`}
              className="rounded-xl border border-border p-4 text-sm hover:border-primary/40"
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
