"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  ListChecks,
  Plus,
  Sparkles,
  Target,
  Upload,
  User,
  Wand2,
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
import { ScoreRing } from "@/components/design-two/score-ring";
import { toast } from "@/components/shared/use-toast";
import { currentUser } from "@/lib/data";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "about",
    label: "About you",
    icon: User,
    encouragement: "First, the basics — this takes less than a minute.",
  },
  {
    id: "skills",
    label: "Skills",
    icon: ListChecks,
    encouragement: "Every skill you add sharpens your match score.",
  },
  {
    id: "background",
    label: "Education & experience",
    icon: GraduationCap,
    encouragement: "No experience yet? Skills alone can carry a great match.",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Target,
    encouragement: "Tell us what you're chasing, and we'll chase it with you.",
  },
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    encouragement: "Almost there — a resume gives your matches the strongest signal.",
  },
  {
    id: "review",
    label: "Review",
    icon: Sparkles,
    encouragement: "Take one last look before we start matching.",
  },
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
          className="h-7 w-32 text-xs"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground"
        >
          <Plus className="size-3" />
          Add
        </button>
      )}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
      <span className="size-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}

function StepSection({ eyebrow, title, description, children }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="max-w-xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function OnboardingSplitTwoPage() {
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
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

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
      { title: "", company: "", period: "", description: "" },
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

  const handlePrefill = () => {
    setStatus("fresh-grad");
    setLocation(currentUser.location);
    setSkills(currentUser.skills);
    setEducation(currentUser.education);
    setExperience(currentUser.experience);
    setDesiredRoles(currentUser.desiredRoles);
    setResumeFileName(currentUser.resumeFileName);
    toast({
      variant: "success",
      title: "Prefilled from resume",
      description:
        "We filled in every step from your resume — review each one and edit anything that's off.",
    });
  };

  const handleFinish = () => {
    toast({
      variant: "success",
      title: "Profile created",
      description:
        skills.length > 0
          ? "We'll start surfacing matches based on the skills and preferences you shared."
          : "Your matches will improve as you use Angkop and add more to your profile.",
    });
    router.push("/design-two/dashboard");
  };

  const handleSkip = () => {
    toast({
      title: "Onboarding skipped",
      description:
        "You can fill in your profile anytime from Profile — matches will be less refined until you do.",
    });
    router.push("/design-two/dashboard");
  };

  return (
    <div className="theme-blue grid min-h-screen bg-background lg:grid-cols-[380px_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <Link
          href="/"
          className="relative inline-flex w-fit items-center gap-2 text-sm font-medium"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary-foreground/15 text-sm font-semibold">
            A
          </span>
          Angkop
        </Link>

        <div className="relative">
          <ScoreRing
            score={progress}
            size={96}
            strokeWidth={6}
            className="[&_circle.stroke-muted]:stroke-primary-foreground/20 [&_circle.stroke-primary]:stroke-primary-foreground [&_span]:text-primary-foreground"
          />
          <p className="mt-6 text-xs font-medium tracking-wide text-primary-foreground/70 uppercase">
            Step {step + 1} of {STEPS.length}
          </p>
          <h1 className="mt-2 max-w-xs text-2xl font-semibold tracking-tight">
            {activeStep.label}
          </h1>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/75">
            {activeStep.encouragement}
          </p>

          <div className="mt-8 flex items-center gap-1.5">
            {STEPS.map((s, index) => {
              const isActive = index === step;
              const isDone = index < step;
              return (
                <button
                  key={s.id}
                  type="button"
                  title={s.label}
                  aria-label={s.label}
                  onClick={() => index <= step && setStep(index)}
                  disabled={index > step}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed",
                    isActive && "bg-primary-foreground text-primary",
                    !isActive &&
                      isDone &&
                      "bg-primary-foreground/20 text-primary-foreground",
                    !isActive && !isDone && "text-primary-foreground/40"
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" />
                  ) : (
                    <s.icon className="size-4" strokeWidth={1.75} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs text-primary-foreground/50">
          Angkop — thesis prototype
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-10">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
              A
            </span>
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <span className="hidden text-sm font-medium text-foreground lg:inline">
            Get matched faster
          </span>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrefill}
            >
              <Wand2 className="size-3.5" />
              Prefill with resume
            </Button>
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Skip onboarding
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-10">
          {activeStep.id === "about" ? (
            <StepSection
              eyebrow="Get matched faster"
              title="About you"
              description="A little context so we can start narrowing down what fits."
            >
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    {currentUser.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {currentUser.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
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
                  <SelectTrigger id="status" className="w-full">
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
                />
              </div>
            </StepSection>
          ) : null}

          {activeStep.id === "skills" ? (
            <StepSection
              eyebrow="Get matched faster"
              title="Skills"
              description="Add the skills, tools, and technologies you'd put on a resume. The more specific, the better your matches."
            >
              <div className="rounded-xl border border-border p-4">
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
              eyebrow="Get matched faster"
              title="Education & experience"
              description="Fresh graduate with no work experience yet? That's completely fine — leave the experience section empty and we'll match mostly on your skills."
            >
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Education
                </h3>
                {education.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-3"
                  >
                    <Input
                      value={item.school}
                      onChange={(event) =>
                        updateEducation(index, "school", event.target.value)
                      }
                      placeholder="School"
                    />
                    <Input
                      value={item.degree}
                      onChange={(event) =>
                        updateEducation(index, "degree", event.target.value)
                      }
                      placeholder="Degree"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={item.period}
                        onChange={(event) =>
                          updateEducation(index, "period", event.target.value)
                        }
                        placeholder="2022 – 2026"
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

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Experience{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </h3>
                {experience.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-2 rounded-xl border border-border p-3"
                  >
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input
                        value={item.title}
                        onChange={(event) =>
                          updateExperience(index, "title", event.target.value)
                        }
                        placeholder="Job title"
                      />
                      <Input
                        value={item.company}
                        onChange={(event) =>
                          updateExperience(index, "company", event.target.value)
                        }
                        placeholder="Company"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={item.period}
                          onChange={(event) =>
                            updateExperience(index, "period", event.target.value)
                          }
                          placeholder="Jan 2026 – Apr 2026"
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
                  </div>
                ))}
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
              eyebrow="Get matched faster"
              title="What are you looking for?"
              description="Roles you'd want to be matched with. You can change these anytime from Profile."
            >
              <div className="rounded-xl border border-border p-4">
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
              eyebrow="Get matched faster"
              title="Upload your resume"
              description="Optional, but it gives the strongest starting signal for your matches — especially before you've saved or applied to anything."
            >
              {resumeFileName ? (
                <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
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
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-8 text-center hover:border-primary/40 hover:bg-primary/5">
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Click to upload, or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, up to 10MB
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
              eyebrow="Get matched faster"
              title="Review"
              description="Here's what we'll use to start matching you. Everything here stays editable from Profile later."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Status &amp; location
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {STATUS_OPTIONS.find((o) => o.value === status)?.label ||
                      "Not set"}
                    {location ? ` · ${location}` : ""}
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Skills ({skills.length})
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {skills.length > 0 ? skills.join(", ") : "None added"}
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Desired roles ({desiredRoles.length})
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {desiredRoles.length > 0
                      ? desiredRoles.join(", ")
                      : "None added"}
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Resume
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {resumeFileName || "Not uploaded"}
                  </p>
                </div>
              </div>
            </StepSection>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
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
