import { cn } from "@/lib/utils";

export function PipelineStrip({ stages }) {
  return (
    <div className="flex items-start justify-between gap-1 overflow-x-auto rounded-xl border border-border p-5">
      {stages.map((stage, index) => (
        <div key={stage.value} className="flex flex-1 items-start">
          <div className="flex min-w-[64px] flex-col items-center gap-2 text-center">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                stage.count > 0
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {stage.count}
            </div>
            <span className="text-[11px] leading-tight text-muted-foreground">
              {stage.label}
            </span>
          </div>
          {index < stages.length - 1 ? (
            <div className="mt-4.5 h-px flex-1 bg-border" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
