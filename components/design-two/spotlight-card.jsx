import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/design-two/score-ring";

export function SpotlightCard({ job }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-5">
        <ScoreRing score={job.matchScore} size={72} strokeWidth={5} />
        <div>
          <Badge variant="outline" className="mb-2">
            {job.platform}
          </Badge>
          <p className="text-lg font-semibold text-foreground">{job.title}</p>
          <p className="text-sm text-muted-foreground">
            {job.company} &middot; {job.location}
          </p>
        </div>
      </div>
      <Button asChild className="w-full sm:w-auto">
        <Link href={`/design-two/jobs/${job.id}`}>
          View your top match
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}
