"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "cn";
import { toast } from "@/components/shared/use-toast";
import { draftsByJobId, currentUser } from "@/lib/data";

const STAGES = [
  { key: "draft", label: "Draft" },
  { key: "consent", label: "Permission" },
  { key: "sent", label: "Sent" },
];

function StageProgress({ stage }) {
  const activeIndex = STAGES.findIndex((s) => s.key === stage);
  return (
    <div className="flex items-center gap-1.5">
      {STAGES.map((s, index) => (
        <div
          key={s.key}
          aria-hidden="true"
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            index <= activeIndex ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

function StageIcon({ icon: Icon, className }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10",
        className
      )}
    >
      <Icon className="size-4 text-primary" />
    </span>
  );
}

function buildFallbackDraft(job) {
  return {
    subject: `Application for ${job.title} — ${currentUser.name}`,
    body: `Hi ${job.company} Hiring Team,

I'm writing to apply for the ${job.title} role. Based on the listing, my background in ${currentUser.skills
      .slice(0, 3)
      .join(", ")} lines up closely with what you're looking for, and I'd welcome the chance to contribute.

I'd be glad to share more about my background whenever convenient.

Best,
${currentUser.name}`,
  };
}

export function CoverLetterDialog({ job, trigger }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("draft");
  const initial = draftsByJobId[job.id] ?? buildFallbackDraft(job);
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) {
      setStage("draft");
    }
  };

  const handleApproveClick = () => {
    setStage(currentUser.gmailSendConnected ? "sent" : "consent");
  };

  const handleGrantConsent = () => {
    setStage("sent");
  };

  const handleDone = () => {
    handleOpenChange(false);
    toast({
      variant: "success",
      title: "Application sent",
      description: `${job.title} at ${job.company} moved to Applied.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <StageProgress stage={stage} />

        {stage === "draft" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <StageIcon icon={Sparkles} />
                <DialogTitle>Cover letter &amp; email draft</DialogTitle>
              </div>
              <DialogDescription>
                Generated from this job&apos;s description and your profile. Review
                and edit before sending — nothing is sent automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="draft-subject">Subject</Label>
                <Input
                  id="draft-subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="draft-body">Message</Label>
                <Textarea
                  id="draft-body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={9}
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                Discard
              </Button>
              <Button onClick={handleApproveClick}>Approve &amp; send</Button>
            </DialogFooter>
          </>
        ) : null}

        {stage === "consent" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <StageIcon icon={ShieldCheck} />
                <DialogTitle>Allow Angkop to send from your Gmail</DialogTitle>
              </div>
              <DialogDescription>
                Sending on your behalf requires a separate Gmail permission beyond
                your basic sign-in. You can revoke this at any time from your Google
                Account settings.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
              Angkop is requesting:{" "}
              <span className="font-medium text-foreground">
                Send email as {currentUser.email}
              </span>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setStage("draft")}>
                Back
              </Button>
              <Button onClick={handleGrantConsent}>Allow &amp; send</Button>
            </DialogFooter>
          </>
        ) : null}

        {stage === "sent" ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <StageIcon icon={CheckCircle2} className="bg-status-success/10 [&_svg]:text-status-success" />
                <DialogTitle>Application sent</DialogTitle>
              </div>
              <DialogDescription>
                Your email was sent to {job.company}. This job&apos;s status has
                been updated to Applied.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleDone}>Done</Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
