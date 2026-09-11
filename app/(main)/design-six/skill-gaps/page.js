"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/design-six/page-header";
import { BentoTile } from "@/components/design-six/bento-tile";
import { SkillGapCard } from "@/components/design-six/skill-gap-card";
import { EmptyState } from "@/components/shared/empty-state";
import { skillGapsByRole, getJob } from "@/lib/data";

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
    <div className="max-w-3xl">
      <PageHeader
        title="Skill gap report"
        description="See what's missing for a specific target role, and the courses that can close the gap."
      />

      <div className="mb-6 max-w-xs">
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
        <div className="space-y-6">
          <BentoTile>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Readiness for {report.targetRole}
              </span>
              <span className="font-medium tabular-nums text-foreground">
                {report.matchedSkills.length} of {totalSkills} skills
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
          </BentoTile>

          {report.matchedSkills.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Skills you already have
              </h2>
              <div className="flex flex-wrap gap-2">
                {report.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    <CheckCircle2 className="size-3.5 text-primary" />
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Skills to develop
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {report.missingSkills.map((gap) => (
                <SkillGapCard key={gap.skill} gap={gap} />
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
