"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
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
import { CommandMenu } from "@/components/design-seven/command-menu";
import { currentUser } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/design-seven/dashboard", label: "Dashboard" },
  { href: "/design-seven/jobs", label: "Jobs" },
  { href: "/design-seven/skill-gaps", label: "Skill Gaps" },
  { href: "/design-seven/courses", label: "Courses" },
  { href: "/design-seven/applications", label: "Applications" },
  { href: "/design-seven/profile", label: "Profile" },
];

export function AppShell({ children }) {
  const [dark, toggleDark] = useDarkMode();
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="theme-purple flex min-h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
        <Link href="/design-seven/dashboard" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            A
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
            Angkop
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="flex h-8 flex-1 max-w-sm items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm text-muted-foreground hover:bg-muted dark:bg-input/30 dark:hover:bg-input/50"
        >
          <Search className="size-3.5" />
          <span className="flex-1 text-left">Search or jump to...</span>
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <DarkModeToggle dark={dark} onToggle={toggleDark} />
          <Link
            href="/"
            className="hidden px-2 text-xs text-muted-foreground hover:text-foreground sm:block"
          >
            All designs
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
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
              {NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Switch design</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <PageTransition>{children}</PageTransition>
      </main>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
