"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageTransition } from "@/components/shared/page-transition";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/design-eight/dashboard", label: "Dashboard" },
  { href: "/design-eight/jobs", label: "Jobs" },
  { href: "/design-eight/skill-gaps", label: "Skill Gaps" },
  { href: "/design-eight/courses", label: "Courses" },
  { href: "/design-eight/applications", label: "Applications" },
  { href: "/design-eight/profile", label: "Profile" },
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="theme-orange flex min-h-screen flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
        <Link href="/design-eight/dashboard" className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-xs font-semibold text-primary-foreground">
            A
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Angkop
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="hidden text-xs text-muted-foreground hover:text-foreground sm:block"
          >
            All designs
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
                    {currentUser.avatarInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/design-eight/profile">Profile settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Switch design</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-16 sm:px-6">
        <PageTransition>{children}</PageTransition>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-10 items-stretch overflow-x-auto border-t border-border bg-muted/40">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center border-r border-border px-4 text-xs font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-t-2 border-t-primary bg-background text-foreground"
                  : "text-muted-foreground hover:bg-background/60"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
