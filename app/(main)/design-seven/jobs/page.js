"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/design-seven/page-header";
import { JobRow } from "@/components/design-seven/job-row";
import { EmptyState } from "@/components/shared/empty-state";
import { jobs as initialJobs, platforms } from "@/lib/data";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "matched", label: "New Matches" },
  { value: "saved", label: "Saved" },
  { value: "dismissed", label: "Dismissed" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("match");

  const handleSave = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, savedState: job.savedState === "saved" ? "matched" : "saved" }
          : job
      )
    );
  };

  const handleDismiss = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, savedState: job.savedState === "dismissed" ? "matched" : "dismissed" }
          : job
      )
    );
  };

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesQuery =
        query.trim().length === 0 ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase());
      const matchesPlatform = platform === "all" || job.platform === platform;
      const matchesStatus = status === "all" || job.savedState === status;
      return matchesQuery && matchesPlatform && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.postedAt) - new Date(a.postedAt);
      }
      return b.matchScore - a.matchScore;
    });

    return result;
  }, [jobs, query, platform, status, sort]);

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Ranked by how well they match your skills and preferences."
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or company"
              className="h-9 pl-8"
            />
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="h-9 w-full sm:w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {platforms.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Highest match</SelectItem>
              <SelectItem value="newest">Newest posted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              variant={status === filter.value ? "secondary" : "ghost"}
              size="sm"
              className={cn(status === filter.value && "text-foreground")}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {filteredJobs.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredJobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                showActions
                onSave={handleSave}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No jobs match your filters"
            description="Try adjusting your search, platform, or status filters."
          />
        )}
      </div>
    </div>
  );
}
