import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { courses as allCourses } from "@/lib/data";

export function SkillGapRow({ gap }) {
  const mappedCourses = gap.courseIds
    .map((id) => allCourses.find((course) => course.id === id))
    .filter(Boolean);

  return (
    <div className="border-l-2 border-transparent py-4 pl-4 transition-colors hover:border-primary hover:bg-accent/40">
      <p className="text-sm font-medium text-foreground">{gap.skill}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{gap.reason}</p>
      {mappedCourses.length > 0 ? (
        <div className="mt-2 flex flex-col gap-1">
          {mappedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/design-seven/courses?skill=${encodeURIComponent(gap.skill)}`}
              className="group inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              {course.title}
              <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
