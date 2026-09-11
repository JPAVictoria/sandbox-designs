import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function JobsIndexPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <EmptyState
        icon={Briefcase}
        title="Select a job"
        description="Choose a listing from the list to see its full match breakdown."
      />
    </div>
  );
}
