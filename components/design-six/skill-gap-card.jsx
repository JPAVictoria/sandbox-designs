import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { courses as allCourses } from "@/lib/data";

export function SkillGapCard({ gap }) {
  const mappedCourses = gap.courseIds
    .map((id) => allCourses.find((course) => course.id === id))
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-semibold text-foreground">{gap.skill}</p>
      <p className="mt-1 text-xs text-muted-foreground">{gap.reason}</p>
      {mappedCourses.length > 0 ? (
        <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
          {mappedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-six/courses?skill=${encodeURIComponent(gap.skill)}`}
              className="group flex items-center justify-between gap-2 text-sm text-foreground hover:text-primary"
            >
              <span className="truncate">{course.title}</span>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
