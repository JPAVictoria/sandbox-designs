import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { courses as allCourses } from "@/lib/data";

export function SkillGapCard({ gap }) {
  const mappedCourses = gap.courseIds
    .map((id) => allCourses.find((course) => course.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Target className="size-4" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-semibold text-foreground">{gap.skill}</p>
      </div>
      <p className="text-xs text-muted-foreground">{gap.reason}</p>

      {mappedCourses.length > 0 ? (
        <div className="flex flex-col gap-1.5 border-t border-border pt-3">
          {mappedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-two/courses?skill=${encodeURIComponent(gap.skill)}`}
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
