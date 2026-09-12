import Link from "next/link";
import { Sparkles, Target, FileText, GraduationCap, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/design-nine/page-header";
import { TimelineEntry } from "@/components/design-nine/timeline-entry";
import {
  jobs,
  skillGapsByRole,
  draftsByJobId,
  courses,
  currentUser,
  getJob,
} from "@/lib/data";

export default function DashboardPage() {
  const ranked = [...jobs].sort((a, b) => b.matchScore - a.matchScore);
  const topMatch = ranked[0];
  const newMatchCount = jobs.filter((job) => job.savedState === "matched").length;
  const draftEntries = Object.entries(draftsByJobId);
  const recommendedCourses = courses.filter((course) => !course.saved).slice(0, 3);
  const firstGapRole = Object.values(skillGapsByRole)[0];

  const entries = [
    {
      icon: Sparkles,
      content: (
        <>
          <p className="text-sm text-foreground">
            <span className="font-medium">{newMatchCount} new matches</span> found
            since your last visit — your top one is{" "}
            <span className="font-medium">{topMatch.title}</span> at{" "}
            {topMatch.company} ({topMatch.matchScore}% match).
          </p>
          <Link
            href={`/design-nine/jobs/${topMatch.id}`}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View this match
            <ArrowRight className="size-3" />
          </Link>
        </>
      ),
    },
  ];

  if (firstGapRole) {
    entries.push({
      icon: Target,
      content: (
        <>
          <p className="text-sm text-foreground">
            You&apos;re missing{" "}
            <span className="font-medium">
              {firstGapRole.missingSkills.length} skills
            </span>{" "}
            for {firstGapRole.targetRole} roles like {firstGapRole.basedOn}.
          </p>
          <Link
            href="/design-nine/skill-gaps"
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View skill gap report
            <ArrowRight className="size-3" />
          </Link>
        </>
      ),
    });
  }

  draftEntries.forEach(([jobId]) => {
    const job = getJob(jobId);
    if (!job) return;
    entries.push({
      icon: FileText,
      content: (
        <>
          <p className="text-sm text-foreground">
            A cover letter draft for{" "}
            <span className="font-medium">
              {job.title} at {job.company}
            </span>{" "}
            is ready for your review.
          </p>
          <Link
            href={`/design-nine/jobs/${jobId}`}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Review draft
            <ArrowRight className="size-3" />
          </Link>
        </>
      ),
    });
  });

  entries.push({
    icon: GraduationCap,
    content: (
      <>
        <p className="text-sm text-foreground">Recommended courses for you:</p>
        <div className="mt-1 flex flex-col gap-0.5">
          {recommendedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-nine/courses?skill=${encodeURIComponent(course.skillTag)}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {course.title}
            </Link>
          ))}
        </div>
      </>
    ),
  });

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's new with your matches, skill gaps, and applications."
      />
      <div>
        {entries.map((entry, index) => (
          <TimelineEntry
            key={index}
            icon={entry.icon}
            isLast={index === entries.length - 1}
          >
            {entry.content}
          </TimelineEntry>
        ))}
      </div>
    </div>
  );
}
