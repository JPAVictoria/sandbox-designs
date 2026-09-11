"use client";

import { useState } from "react";
import { Plus, X, FileText, CheckCircle2, Upload } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/design-five/page-header";
import { currentUser } from "@/lib/data";

function ChipList({ items, onAdd, onRemove, placeholder }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (value) onAdd(value);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="gap-1 pr-1">
          {item}
          <button
            type="button"
            aria-label={`Remove ${item}`}
            onClick={() => onRemove(item)}
            className="rounded-full p-0.5 hover:bg-foreground/10"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {adding ? (
        <Input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
            if (event.key === "Escape") {
              setDraft("");
              setAdding(false);
            }
          }}
          onBlur={commit}
          placeholder={placeholder}
          className="h-6 w-28 text-xs"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground"
        >
          <Plus className="size-3" />
          Add
        </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [skills, setSkills] = useState(currentUser.skills);
  const [desiredRoles, setDesiredRoles] = useState(currentUser.desiredRoles);
  const [resumeFileName, setResumeFileName] = useState(currentUser.resumeFileName);
  const [gmailConnected, setGmailConnected] = useState(currentUser.gmailSendConnected);

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Profile"
        description="This is what powers your matches — keep it up to date."
      />

      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center">
        <Avatar className="size-14">
          <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
            {currentUser.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-foreground">
            {currentUser.name}
          </p>
          <p className="text-sm text-muted-foreground">{currentUser.role}</p>
          <p className="text-sm text-muted-foreground">{currentUser.location}</p>
        </div>
        <Badge variant="outline" className="w-fit gap-1.5">
          <CheckCircle2 className="size-3.5 text-primary" />
          Signed in with Google
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Skills</h2>
            <ChipList
              items={skills}
              onAdd={(value) => setSkills((prev) => [...prev, value])}
              onRemove={(value) => setSkills((prev) => prev.filter((s) => s !== value))}
              placeholder="Skill name"
            />
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Desired roles
            </h2>
            <ChipList
              items={desiredRoles}
              onAdd={(value) => setDesiredRoles((prev) => [...prev, value])}
              onRemove={(value) =>
                setDesiredRoles((prev) => prev.filter((r) => r !== value))
              }
              placeholder="Role title"
            />
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Experience
            </h2>
            <div className="space-y-4">
              {currentUser.experience.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.company} &middot; {item.period}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Education
            </h2>
            <div className="space-y-2">
              {currentUser.education.map((item) => (
                <div key={item.school}>
                  <p className="text-sm font-medium text-foreground">
                    {item.degree}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.school} &middot; {item.period}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Resume</h2>
            <div className="flex items-center gap-2 rounded-md border border-border p-2.5">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {resumeFileName}
              </span>
            </div>
            <label className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted">
              <Upload className="size-3.5" />
              Replace resume
              <input
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setResumeFileName(file.name);
                }}
              />
            </label>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Connected accounts
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Google sign-in</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="pr-3">
                  <Label htmlFor="gmail-send" className="text-sm text-foreground">
                    Gmail send permission
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Required to send AI-generated application emails on your behalf.
                  </p>
                </div>
                <Switch
                  id="gmail-send"
                  checked={gmailConnected}
                  onCheckedChange={setGmailConnected}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
