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
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageTransition } from "@/components/shared/page-transition";
import { currentUser } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/design-two/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/design-two/jobs", label: "Jobs", icon: Briefcase },
  { href: "/design-two/skill-gaps", label: "Skill Gaps", icon: Target },
  { href: "/design-two/courses", label: "Courses", icon: GraduationCap },
  { href: "/design-two/applications", label: "Applications", icon: ClipboardList },
  { href: "/design-two/profile", label: "Profile", icon: User },
];

function NavIcon({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={item.label}
      aria-label={item.label}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-xl transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </Link>
  );
}

export function AppShell({ children }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="theme-blue flex min-h-screen bg-background">
      <aside className="hidden w-18 shrink-0 flex-col items-center gap-1 border-r border-border py-4 md:flex">
        <Link
          href="/design-two/dashboard"
          className="mb-4 flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
        >
          A
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavIcon key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>
        <Link
          href="/"
          title="All designs"
          aria-label="Back to all designs"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <span className="text-xs">&larr;</span>
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              A
            </span>
            <span className="text-sm font-semibold text-foreground">Angkop</span>
          </div>

          <div className="relative ml-auto hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs, courses..."
              className="h-8 pl-8"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-auto flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:ml-0">
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
              <DropdownMenuItem asChild>
                <Link href="/design-two/profile">Profile settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Switch design</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background py-1.5 md:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
