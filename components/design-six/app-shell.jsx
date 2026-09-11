"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Target,
  GraduationCap,
  ClipboardList,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  { href: "/design-six/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/design-six/jobs", label: "Jobs", icon: Briefcase },
  { href: "/design-six/skill-gaps", label: "Skill Gaps", icon: Target },
  { href: "/design-six/courses", label: "Courses", icon: GraduationCap },
  { href: "/design-six/applications", label: "Applications", icon: ClipboardList },
  { href: "/design-six/profile", label: "Profile", icon: User },
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const [dark, toggleDark] = useDarkMode();
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="theme-yellow min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 pt-8 pb-28 sm:pt-10">
        <PageTransition>{children}</PageTransition>
      </main>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
        <DarkModeToggle dark={dark} onToggle={toggleDark} className="size-8" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/20 text-xs font-medium text-foreground">
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
              <Link href="/design-six/profile">Profile settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">Switch design</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card p-1.5 shadow-sm">
        <Link
          href="/design-six/dashboard"
          className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          aria-label="Angkop home"
        >
          A
        </Link>
        <div className="mx-0.5 h-5 w-px bg-border" />
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-primary/20 text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
