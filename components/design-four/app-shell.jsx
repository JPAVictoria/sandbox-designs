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
import { currentUser } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/design-four/dashboard", label: "Dashboard" },
  { href: "/design-four/jobs", label: "Jobs" },
  { href: "/design-four/skill-gaps", label: "Skill Gaps" },
  { href: "/design-four/courses", label: "Courses" },
  { href: "/design-four/applications", label: "Applications" },
  { href: "/design-four/profile", label: "Profile" },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm transition-colors",
              active
                ? "font-medium text-foreground bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="theme-forest flex min-h-screen bg-background">
      <aside className="hidden w-48 shrink-0 flex-col border-r border-border px-3 py-5 lg:flex">
        <Link href="/design-four/dashboard" className="mb-6 flex items-center gap-2 px-2.5">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            A
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Angkop
          </span>
        </Link>
        <NavLinks pathname={pathname} />
        <div className="mt-auto flex flex-col gap-3 px-2.5 pt-6">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            &larr; All designs
          </Link>
          <div className="flex items-center gap-2 border-t border-border pt-3">
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
                {currentUser.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">
                {currentUser.name}
              </p>
            </div>
          </div>
        </div>
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
                <Link href="/design-four/profile">Profile settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Switch design</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {mobileOpen ? (
          <nav className="border-b border-border px-4 py-2 lg:hidden">
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </nav>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
