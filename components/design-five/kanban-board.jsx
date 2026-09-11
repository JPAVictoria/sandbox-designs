import { KanbanCard } from "@/components/design-five/kanban-card";
import { applicationStatuses, getJob } from "@/lib/data";

export function KanbanBoard({ rows, onStatusChange, onAddTag, onRemoveTag }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {applicationStatuses.map((status) => {
        const columnRows = rows.filter((row) => row.status === status.value);
        return (
          <div key={status.value} className="w-64 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-medium text-foreground">{status.label}</p>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {columnRows.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-2 min-h-24">
              {columnRows.map((row) => {
                const job = getJob(row.jobId);
                if (!job) return null;
                return (
                  <KanbanCard
                    key={row.jobId}
                    row={row}
                    job={job}
                    onStatusChange={onStatusChange}
                    onAddTag={onAddTag}
                    onRemoveTag={onRemoveTag}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
