"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DarkModeToggle } from "@/components/shared/dark-mode-toggle";
import { useDarkMode } from "@/components/shared/use-dark-mode";
import { PageTransition } from "@/components/shared/page-transition";
import { currentUser } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/design-five/dashboard", label: "Dashboard" },
  { href: "/design-five/jobs", label: "Jobs" },
  { href: "/design-five/skill-gaps", label: "Skill Gaps" },
  { href: "/design-five/courses", label: "Courses" },
  { href: "/design-five/applications", label: "Applications" },
  { href: "/design-five/profile", label: "Profile" },
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="theme-blue flex min-h-screen flex-col bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/design-five/dashboard" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary-foreground/15 text-sm font-semibold">
              A
            </span>
            <span className="text-sm font-semibold tracking-tight">Angkop</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 rounded-full bg-primary-foreground/10 p-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary-foreground text-primary"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <DarkModeToggle
              dark={dark}
              onToggle={toggleDark}
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            />
            <Link
              href="/"
              className="hidden px-2 text-xs text-primary-foreground/70 hover:text-primary-foreground sm:block"
            >
              All designs
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/40">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary-foreground/15 text-xs font-medium text-primary-foreground">
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
                  <Link href="/design-five/profile">Profile settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">Switch design</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="flex flex-col gap-0.5 border-t border-primary-foreground/15 px-4 py-2 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-primary-foreground text-primary"
                    : "text-primary-foreground/80"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
