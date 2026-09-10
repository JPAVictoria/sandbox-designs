"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/design-one/page-header";
import { CourseCard } from "@/components/design-one/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { courses as initialCourses } from "@/lib/data";

export default function CoursesPage() {
  return (
    <Suspense fallback={null}>
      <CoursesPageContent />
    </Suspense>
  );
}

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState(initialCourses);
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState(searchParams.get("skill") ?? "all");
  const [tab, setTab] = useState("all");

  const skillTags = useMemo(
    () => Array.from(new Set(initialCourses.map((course) => course.skillTag))),
    []
  );

  const handleToggleSave = (courseId) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, saved: !course.saved } : course
      )
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesQuery =
      query.trim().length === 0 ||
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.provider.toLowerCase().includes(query.toLowerCase());
    const matchesSkill = skillFilter === "all" || course.skillTag === skillFilter;
    const matchesTab = tab === "all" || (tab === "saved" && course.saved);
    return matchesQuery && matchesSkill && matchesTab;
  });

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Recommended based on your skill gaps, plus everything you've saved for later."
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses or providers"
              className="h-9 pl-8"
            />
          </div>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="h-9 w-full sm:w-48">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All skills</SelectItem>
              {skillTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All courses</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              saved={course.saved}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            icon={GraduationCap}
            title="No courses found"
            description="Try a different search term or skill filter."
          />
        </div>
      )}
    </div>
  );
}
