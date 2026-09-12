"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/design-eight/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { skillGapsByRole, courses as allCourses, getJob } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function SkillGapsPage() {
  return (
    <Suspense fallback={null}>
      <SkillGapsPageContent />
    </Suspense>
  );
}

function SkillGapsPageContent() {
  const searchParams = useSearchParams();
  const roleIds = Object.keys(skillGapsByRole);
  const requestedJobId = searchParams.get("job");

  const [selectedId, setSelectedId] = useState(
    roleIds.includes(requestedJobId) ? requestedJobId : roleIds[0]
  );

  const report = skillGapsByRole[selectedId];
  const totalSkills = report
    ? report.matchedSkills.length + report.missingSkills.length
    : 0;
  const readiness = useMemo(() => {
    if (!report || totalSkills === 0) return 0;
    return Math.round((report.matchedSkills.length / totalSkills) * 100);
  }, [report, totalSkills]);

  if (roleIds.length === 0) {
    return (
      <div>
        <PageHeader
          title="Skill gap report"
          description="See what's missing for a specific target role, and the courses that can close the gap."
        />
        <EmptyState
          title="No skill gap reports yet"
          description="Save a job you're targeting to generate a skill gap report for it."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Skill gap report"
        description="See what's missing for a specific target role, and the courses that can close the gap."
      />

      <div className="mb-5 max-w-xs">
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Choose a target role" />
          </SelectTrigger>
          <SelectContent>
            {roleIds.map((id) => {
              const job = getJob(id);
              return (
                <SelectItem key={id} value={id}>
                  {skillGapsByRole[id].targetRole} — {job?.company}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {report ? (
        <div>
          <div className="mb-5 rounded-lg border border-border p-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Readiness for {report.targetRole}
              </span>
              <span className="font-mono tabular-nums text-foreground">
                {report.matchedSkills.length} / {totalSkills}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${readiness}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Based on your matches with {report.basedOn}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Skill</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Mapped courses</th>
                </tr>
              </thead>
              <tbody>
                {report.matchedSkills.map((skill, index) => (
                  <tr
                    key={skill}
                    className={cn(
                      "border-b border-border",
                      index % 2 === 1 && "bg-muted/20"
                    )}
                  >
                    <td className="px-3 py-2 font-medium text-foreground">
                      {skill}
                    </td>
                    <td className="px-3 py-2 text-primary">Matched</td>
                    <td className="px-3 py-2 text-muted-foreground">—</td>
                  </tr>
                ))}
                {report.missingSkills.map((gap, index) => {
                  const mapped = gap.courseIds
                    .map((id) => allCourses.find((course) => course.id === id))
                    .filter(Boolean);
                  return (
                    <tr
                      key={gap.skill}
                      className={cn(
                        "border-b border-border last:border-b-0",
                        (report.matchedSkills.length + index) % 2 === 1 &&
                          "bg-muted/20"
                      )}
                    >
                      <td className="px-3 py-2 font-medium text-foreground">
                        {gap.skill}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        Missing
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-1">
                          {mapped.map((course) => (
                            <Link
                              key={course.id}
                              href={`/design-eight/courses?skill=${encodeURIComponent(gap.skill)}`}
                              className="text-primary hover:underline"
                            >
                              {course.title}
                            </Link>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
