"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Plus,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/shared/use-toast";
import { currentUser } from "@/lib/data";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "about", label: "About you" },
  { id: "skills", label: "Skills" },
  { id: "background", label: "Education & experience" },
  { id: "preferences", label: "Preferences" },
  { id: "resume", label: "Resume" },
  { id: "review", label: "Review" },
];

const STATUS_OPTIONS = [
  { value: "fresh-grad", label: "Fresh graduate" },
  { value: "recent-grad", label: "Recent graduate (1-2 yrs)" },
  { value: "career-shifter", label: "Career shifter" },
  { value: "employed", label: "Currently employed, exploring" },
];

function ChipList({ items, onAdd, onRemove, placeholder }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    if (value && !items.includes(value)) onAdd(value);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="gap-1 pr-1 font-mono text-xs">
          {item}
          <button
            type="button"
            aria-label={`Remove ${item}`}
            onClick={() => onRemove(item)}
            className="rounded-sm p-0.5 hover:bg-foreground/10"
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
          className="h-7 w-32 rounded-sm text-xs"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 rounded-sm border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground"
        >
          <Plus className="size-3" />
          Add
        </button>
      )}
    </div>
  );
}

function StepSection({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-border p-2.5 last:border-b-0 sm:grid-cols-[140px_1fr] sm:items-center">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export default function DesignEightOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([
    { school: "", degree: "", period: "" },
  ]);
  const [experience, setExperience] = useState([]);
  const [desiredRoles, setDesiredRoles] = useState([]);
  const [resumeFileName, setResumeFileName] = useState("");

  const activeStep = STEPS[step];

  const updateEducation = (index, field, value) => {
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addEducation = () =>
    setEducation((prev) => [...prev, { school: "", degree: "", period: "" }]);

  const removeEducation = (index) =>
    setEducation((prev) => prev.filter((_, i) => i !== index));

  const addExperience = () =>
    setExperience((prev) => [
      ...prev,
      { title: "", company: "", period: "" },
    ]);

  const updateExperience = (index, field, value) => {
    setExperience((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeExperience = (index) =>
    setExperience((prev) => prev.filter((_, i) => i !== index));

  const canContinue = step !== 0 || status.length > 0;

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = () => {
    toast({
      variant: "success",
      title: "Profile created",
      description:
        skills.length > 0
          ? "We'll start surfacing matches based on the skills and preferences you shared."
          : "Your matches will improve as you use Angkop and add more to your profile.",
    });
    router.push("/design-eight/dashboard");
  };

  const handleSkip = () => {
    toast({
      title: "Onboarding skipped",
      description:
        "You can fill in your profile anytime from Profile — matches will be less refined until you do.",
    });
    router.push("/design-eight/dashboard");
  };

  return (
    <div className="theme-orange min-h-screen bg-background">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-xs font-semibold text-primary-foreground">
            A
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Angkop
          </span>
        </Link>
        <span className="font-mono text-xs text-muted-foreground">
          Onboarding — Design Eight
        </span>
        <button
          type="button"
          onClick={handleSkip}
          className="ml-auto text-xs text-muted-foreground hover:text-foreground"
        >
          Skip onboarding
        </button>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-stretch overflow-x-auto rounded-t-lg border border-b-0 border-border bg-muted/40">
          {STEPS.map((s, index) => {
            const isActive = index === step;
            const isDone = index < step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => index <= step && setStep(index)}
                disabled={index > step}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 border-r border-border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors last:border-r-0 disabled:cursor-not-allowed",
                  isActive
                    ? "border-t-2 border-t-primary bg-background text-foreground"
                    : isDone
                      ? "text-foreground hover:bg-background/60"
                      : "text-muted-foreground"
                )}
              >
                <span className="font-mono tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-b-lg border border-border p-5">
          {activeStep.id === "about" ? (
            <StepSection
              title="About you"
              description="A little context so we can start narrowing down what fits."
            >
              <div className="flex items-center gap-3 rounded-md border border-border bg-muted/20 p-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    {currentUser.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {currentUser.name}
                  </p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  Google
                </Badge>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Where are you in your job search?</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="w-full rounded-sm">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">Where are you based?</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Muntinlupa City, Metro Manila"
                  className="rounded-sm"
                />
              </div>
            </StepSection>
          ) : null}

          {activeStep.id === "skills" ? (
            <StepSection
              title="Skills"
              description="Add the skills, tools, and technologies you'd put on a resume. The more specific, the better your matches."
            >
              <div className="rounded-md border border-border p-3">
                <ChipList
                  items={skills}
                  onAdd={(value) => setSkills((prev) => [...prev, value])}
                  onRemove={(value) =>
                    setSkills((prev) => prev.filter((s) => s !== value))
                  }
                  placeholder="e.g. React"
                />
                {skills.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    No skills yet — matches will lean on your resume once you
                    upload it.
                  </p>
                ) : null}
              </div>
            </StepSection>
          ) : null}

          {activeStep.id === "background" ? (
            <StepSection
              title="Education & experience"
              description="Fresh graduate with no work experience yet? That's completely fine — leave the experience section empty and we'll match mostly on your skills."
            >
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-foreground">
                  Education
                </h3>
                <div className="overflow-hidden rounded-md border border-border">
                  {education.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "grid gap-2 border-b border-border p-2.5 last:border-b-0 sm:grid-cols-3",
                        index % 2 === 1 && "bg-muted/20"
                      )}
                    >
                      <Input
                        value={item.school}
                        onChange={(event) =>
                          updateEducation(index, "school", event.target.value)
                        }
                        placeholder="School"
                        className="rounded-sm"
                      />
                      <Input
                        value={item.degree}
                        onChange={(event) =>
                          updateEducation(index, "degree", event.target.value)
                        }
                        placeholder="Degree"
                        className="rounded-sm"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={item.period}
                          onChange={(event) =>
                            updateEducation(index, "period", event.target.value)
                          }
                          placeholder="2022 – 2026"
                          className="rounded-sm font-mono"
                        />
                        {education.length > 1 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Remove education entry"
                            onClick={() => removeEducation(index)}
                          >
                            <X className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                >
                  <Plus className="size-3.5" />
                  Add education
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-foreground">
                  Experience{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </h3>
                {experience.length > 0 ? (
                  <div className="overflow-hidden rounded-md border border-border">
                    {experience.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "grid gap-2 border-b border-border p-2.5 last:border-b-0 sm:grid-cols-3",
                          index % 2 === 1 && "bg-muted/20"
                        )}
                      >
                        <Input
                          value={item.title}
                          onChange={(event) =>
                            updateExperience(index, "title", event.target.value)
                          }
                          placeholder="Job title"
                          className="rounded-sm"
                        />
                        <Input
                          value={item.company}
                          onChange={(event) =>
                            updateExperience(index, "company", event.target.value)
                          }
                          placeholder="Company"
                          className="rounded-sm"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={item.period}
                            onChange={(event) =>
                              updateExperience(index, "period", event.target.value)
                            }
                            placeholder="Jan 2026 – Apr 2026"
                            className="rounded-sm font-mono"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Remove experience entry"
                            onClick={() => removeExperience(index)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExperience}
                >
                  <Plus className="size-3.5" />
                  Add experience
                </Button>
              </div>
            </StepSection>
          ) : null}

          {activeStep.id === "preferences" ? (
            <StepSection
              title="What are you looking for?"
              description="Roles you'd want to be matched with. You can change these anytime from Profile."
            >
              <div className="rounded-md border border-border p-3">
                <ChipList
                  items={desiredRoles}
                  onAdd={(value) => setDesiredRoles((prev) => [...prev, value])}
                  onRemove={(value) =>
                    setDesiredRoles((prev) => prev.filter((r) => r !== value))
                  }
                  placeholder="e.g. Frontend Developer"
                />
              </div>
            </StepSection>
          ) : null}

          {activeStep.id === "resume" ? (
            <StepSection
              title="Upload your resume"
              description="Optional, but it gives the strongest starting signal for your matches — especially before you've saved or applied to anything."
            >
              {resumeFileName ? (
                <div className="flex items-center gap-2 rounded-md border border-border p-3">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
                    {resumeFileName}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove resume"
                    onClick={() => setResumeFileName("")}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-border p-8 text-center hover:border-foreground/30 hover:bg-muted/20">
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Click to upload, or drag and drop
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    .pdf — up to 10MB
                  </span>
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
              )}
            </StepSection>
          ) : null}

          {activeStep.id === "review" ? (
            <StepSection
              title="Review"
              description="Here's what we'll use to start matching you. Everything here stays editable from Profile later."
            >
              <div className="overflow-hidden rounded-md border border-border">
                <FieldRow label="Status">
                  <span className="text-sm text-foreground">
                    {STATUS_OPTIONS.find((o) => o.value === status)?.label ||
                      "Not set"}
                  </span>
                </FieldRow>
                <FieldRow label="Location">
                  <span className="font-mono text-sm text-foreground">
                    {location || "Not set"}
                  </span>
                </FieldRow>
                <FieldRow label={`Skills (${skills.length})`}>
                  <span className="text-sm text-foreground">
                    {skills.length > 0 ? skills.join(", ") : "None added"}
                  </span>
                </FieldRow>
                <FieldRow label={`Desired roles (${desiredRoles.length})`}>
                  <span className="text-sm text-foreground">
                    {desiredRoles.length > 0
                      ? desiredRoles.join(", ")
                      : "None added"}
                  </span>
                </FieldRow>
                <FieldRow label="Resume">
                  <span className="font-mono text-sm text-foreground">
                    {resumeFileName || "Not uploaded"}
                  </span>
                </FieldRow>
              </div>
            </StepSection>
          ) : null}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <span className="font-mono text-xs text-muted-foreground">
              {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </span>
            {step === STEPS.length - 1 ? (
              <Button type="button" onClick={handleFinish}>
                Finish setup
                <Sparkles className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={goNext} disabled={!canContinue}>
                Continue
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
