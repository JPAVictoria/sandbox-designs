import { cn } from "@/lib/utils";
import { statusStyles } from "@/lib/data";

const dotClassByToken = {
  "status-pending": "bg-status-pending",
  "status-applied": "bg-status-applied",
  "status-interview": "bg-status-interview",
  "status-interviewed": "bg-status-interviewed",
  "status-success": "bg-status-success",
  "status-unsuccessful": "bg-status-unsuccessful",
};

const textClassByToken = {
  "status-pending": "text-status-pending",
  "status-applied": "text-status-applied",
  "status-interview": "text-status-interview",
  "status-interviewed": "text-status-interviewed",
  "status-success": "text-status-success",
  "status-unsuccessful": "text-status-unsuccessful",
};

export function StatusBadge({ status, className }) {
  const style = statusStyles[status] ?? statusStyles.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium",
        textClassByToken[style.token],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClassByToken[style.token])} />
      {style.label}
    </span>
  );
}
