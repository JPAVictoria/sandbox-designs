import Link from "next/link";
import { Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

export function AlgorithmsNavLink({ className, iconOnly = false }) {
  if (iconOnly) {
    return (
      <Link
        href="/algorithms"
        title="Algorithms"
        aria-label="Algorithms"
        className={cn(
          "flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
      >
        <Workflow className="size-4" strokeWidth={1.75} />
      </Link>
    );
  }

  return (
    <Link
      href="/algorithms"
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <Workflow className="size-4" strokeWidth={1.75} />
      <span className="hidden sm:inline">Algorithms</span>
    </Link>
  );
}
