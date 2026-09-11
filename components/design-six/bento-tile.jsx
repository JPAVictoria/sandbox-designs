import { cn } from "@/lib/utils";

export function BentoTile({ className, children }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      {children}
    </div>
  );
}
