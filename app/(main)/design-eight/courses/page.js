"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, GraduationCap, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/design-eight/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { courses as initialCourses } from "@/lib/data";
import { cn } from "@/lib/utils";

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

      <div className="mb-4 flex flex-col gap-3">
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
            <SelectTrigger className="h-9 w-full sm:w-44">
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
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-3 py-2 font-medium">Course</th>
                <th className="px-3 py-2 font-medium">Provider</th>
                <th className="px-3 py-2 font-medium">Skill</th>
                <th className="px-3 py-2 font-medium">Level</th>
                <th className="px-3 py-2 font-medium">Duration</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr
                  key={course.id}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    index % 2 === 1 && "bg-muted/20"
                  )}
                >
                  <td className="px-3 py-2 font-medium text-foreground">
                    {course.title}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {course.provider}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {course.skillTag}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {course.level}
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">
                    {course.duration}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={course.saved ? "Unsave course" : "Save course"}
                        onClick={() => handleToggleSave(course.id)}
                      >
                        {course.saved ? (
                          <BookmarkCheck className="size-4 text-primary" />
                        ) : (
                          <Bookmark className="size-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Open course">
                        <ExternalLink className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No courses found"
          description="Try a different search term or skill filter."
        />
      )}
    </div>
  );
}
