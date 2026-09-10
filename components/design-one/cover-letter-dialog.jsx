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
import { draftsByJobId, currentUser } from "@/lib/data";

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {stage === "draft" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Cover letter & email draft
              </DialogTitle>
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
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Allow Angkop to send from your Gmail
              </DialogTitle>
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
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-status-success" />
                Application sent
              </DialogTitle>
              <DialogDescription>
                Your email was sent to {job.company}. This job&apos;s status has
                been updated to Applied.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
