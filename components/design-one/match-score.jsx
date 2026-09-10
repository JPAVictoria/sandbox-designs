import { cn } from "@/lib/utils";

export function MatchScore({ score, size = "default", className }) {
  return (
    <div className={cn("flex shrink-0 items-center gap-2", className)}>
      <span
        className={cn(
          "font-semibold tabular-nums text-foreground",
          size === "lg" ? "text-3xl" : "w-9 text-sm"
        )}
      >
        {score}%
      </span>
      {size !== "lg" ? (
        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${score}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
