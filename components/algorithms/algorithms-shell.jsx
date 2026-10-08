"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/shared/page-transition";

const TABS = [
  { href: "/algorithms", label: "Overview" },
  { href: "/algorithms/sbert", label: "Semantic Matching" },
  { href: "/algorithms/ncf", label: "Collaborative Filtering" },
  { href: "/algorithms/hybrid", label: "Hybrid Ranking" },
  { href: "/algorithms/output", label: "Output" },
];

export function AlgorithmsShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">All designs</span>
          </Link>
          <div className="mx-1 h-5 w-px bg-border" />
          <Link href="/algorithms" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              A
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
              How Angkop Matches You
            </span>
          </Link>
        </div>
        <nav className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 pb-2.5 sm:px-6">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
