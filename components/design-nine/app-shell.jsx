"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageTransition } from "@/components/shared/page-transition";
import { currentUser } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/design-nine/dashboard", label: "Dashboard" },
  { href: "/design-nine/jobs", label: "Jobs" },
  { href: "/design-nine/skill-gaps", label: "Skill Gaps" },
  { href: "/design-nine/courses", label: "Courses" },
  { href: "/design-nine/applications", label: "Applications" },
  { href: "/design-nine/profile", label: "Profile" },
];

function TimelineNav({ pathname, onNavigate }) {
  return (
    <nav className="relative px-6">
      <div className="absolute top-1 bottom-1 left-[29px] w-px bg-border" />
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="relative flex items-center gap-3 rounded-md py-2 pr-3 transition-colors hover:bg-muted"
            >
              <span
                className={cn(
                  "z-10 flex size-2.5 shrink-0 rounded-full",
                  active ? "bg-primary ring-4 ring-primary/15" : "bg-border"
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function BrandLockup() {
  return (
    <Link href="/design-nine/dashboard" className="mb-6 flex items-center gap-2 px-6">
      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        A
      </span>
      <span className="text-sm font-semibold tracking-tight text-foreground">
        Angkop
      </span>
    </Link>
  );
}

function UserFooter() {
  return (
    <div className="mt-auto px-6 pt-6">
      <Link
        href="/"
        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; All designs
      </Link>
      <Link
        href="/design-nine/profile"
        className="mt-3 flex items-center gap-2 border-t border-border pt-3"
      >
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
            {currentUser.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-medium text-foreground">
          {currentUser.name}
        </span>
      </Link>
    </div>
  );
}

export function AppShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="theme-rose flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border py-6 lg:flex">
        <BrandLockup />
        <TimelineNav pathname={pathname} />
        <UserFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
          <span className="text-sm font-semibold text-foreground">Angkop</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-auto flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
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
                <Link href="/">Switch design</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {mobileOpen ? (
          <div className="border-b border-border py-4 lg:hidden">
            <TimelineNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
