import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobLine } from "@/components/design-three/job-line";
import {
  jobs,
  applications,
  skillGapsByRole,
  draftsByJobId,
  currentUser,
  getJob,
} from "@/lib/data";

export default function DashboardPage() {
  const ranked = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  const topMatch = ranked[0];
  const recentMatches = ranked.slice(1, 4);
  const newMatchCount = jobs.filter((job) => job.savedState === "matched").length;
  const skillGapCount = Object.values(skillGapsByRole).reduce(
    (sum, role) => sum + role.missingSkills.length,
    0
  );
  const draftEntries = Object.entries(draftsByJobId);
  const activeApplications = applications.filter(
    (app) => app.status !== "successful" && app.status !== "unsuccessful"
  );

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        Good to see you, {currentUser.name.split(" ")[0]}.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        You have <span className="font-medium text-foreground">{newMatchCount} new matches</span>,{" "}
        <span className="font-medium text-foreground">{skillGapCount} skill gaps</span> to close, and{" "}
        <span className="font-medium text-foreground">
          {activeApplications.length} active application{activeApplications.length === 1 ? "" : "s"}
        </span>{" "}
        in progress.
      </p>

      <div className="mt-8 rounded-lg border border-border p-5">
        <p className="text-xs font-medium text-muted-foreground">Your top match</p>
        <p className="mt-1 text-lg font-semibold text-foreground">
          {topMatch.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {topMatch.company} &middot; {topMatch.matchScore}% match
        </p>
        <Button asChild size="sm" className="mt-4">
          <Link href={`/design-three/jobs/${topMatch.id}`}>
            View this match
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {draftEntries.length > 0 ? (
        <div className="mt-8">
          <p className="text-sm font-medium text-foreground">Needs your review</p>
          <div className="mt-1 divide-y divide-border">
            {draftEntries.map(([jobId]) => {
              const job = getJob(jobId);
              if (!job) return null;
              return (
                <Link
                  key={jobId}
                  href={`/design-three/jobs/${jobId}`}
                  className="flex items-center justify-between gap-3 py-3 text-sm hover:text-primary"
                >
                  <span className="min-w-0 truncate text-foreground">
                    A cover letter draft for {job.title} at {job.company} is ready
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Recent matches</p>
          <Link
            href="/design-three/jobs"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentMatches.map((job) => (
            <JobLine key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
