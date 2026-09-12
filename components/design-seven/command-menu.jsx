"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Target,
  GraduationCap,
  ClipboardList,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { jobs } from "@/lib/data";

const MODULES = [
  { href: "/design-seven/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/design-seven/jobs", label: "Jobs", icon: Briefcase },
  { href: "/design-seven/skill-gaps", label: "Skill Gaps", icon: Target },
  { href: "/design-seven/courses", label: "Courses", icon: GraduationCap },
  { href: "/design-seven/applications", label: "Applications", icon: ClipboardList },
  { href: "/design-seven/profile", label: "Profile", icon: User },
];

export function CommandMenu({ open, onOpenChange }) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const go = (href) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search or jump to a page..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Modules">
          {MODULES.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <Icon className="size-4" />
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Jobs">
          {jobs.map((job) => (
            <CommandItem
              key={job.id}
              onSelect={() => go(`/design-seven/jobs/${job.id}`)}
            >
              <Briefcase className="size-4" />
              {job.title} — {job.company}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
