"use client";

import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { JobListPanel } from "@/components/design-four/job-list-panel";

export default function JobsSplitLayout({ children }) {
  const params = useParams();
  const hasSelection = Boolean(params?.jobId);

  return (
    <div className="flex h-[calc(100vh-3rem)] lg:h-screen">
      <div className={cn(hasSelection && "hidden", "lg:flex")}>
        <JobListPanel selectedId={params?.jobId} />
      </div>
      <div
        className={cn(
          "min-w-0 flex-1 overflow-y-auto",
          !hasSelection && "hidden lg:block"
        )}
      >
        {children}
      </div>
    </div>
  );
}
