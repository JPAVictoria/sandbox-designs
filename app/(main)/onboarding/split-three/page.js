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
import { toast } from "@/components/shared/use-toast";
import { currentUser } from "@/lib/data";

const STEPS = [
  {
    id: "about",
    label: "About you",
    note: "No rush — just a little context so we know where to start.",
  },
  {
    id: "skills",
    label: "Skills",
    note: "Add what feels true. You can always come back and add more later.",
  },
  {
    id: "background",
    label: "Education & experience",
    note: "Nothing here is a requirement — an empty section is a fine answer too.",
  },
  {
    id: "preferences",
    label: "Preferences",
    note: "This isn't permanent. You can change your mind anytime from Profile.",
  },
  {
    id: "resume",
    label: "Resume",
    note: "Optional. Skip it for now if you'd rather add it later.",
  },
  {
    id: "review",
    label: "Review",
    note: "Take your time. Nothing is sent until you're ready.",
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

export default function OnboardingSplitThreePage() {
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
    router.push("/design-three/dashboard");
  };

  const handleSkip = () => {
    toast({
      title: "Onboarding skipped",
      description:
        "You can fill in your profile anytime from Profile — matches will be less refined until you do.",
    });
    router.push("/design-three/dashboard");
  };

  return (
    <div className="theme-yellow grid min-h-screen bg-background lg:grid-cols-[300px_1fr]">
      <div className="hidden flex-col justify-between p-10 lg:flex">
        <Link href="/" className="inline-flex w-fit items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            A
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Angkop
          </span>
        </Link>

        <div>
          <p className="text-xs text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-6 text-base leading-relaxed text-foreground">
            {activeStep.note}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Angkop — thesis prototype
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background">
          <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                A
              </span>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Angkop
              </span>
            </div>
            <span className="hidden text-xs text-muted-foreground lg:inline">
              {activeStep.label}
            </span>
            <div className="ml-auto flex items-center gap-3">
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
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Skip onboarding
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
          <div className="mb-10 lg:hidden">
            <p className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length} &middot; {activeStep.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {activeStep.note}
            </p>
          </div>

          {activeStep.id === "about" ? (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  About you
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A little context so we can start narrowing down what fits.
                </p>
              </div>

              <div className="flex items-center gap-3 py-4">
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

              <div className="space-y-1.5 border-t border-border pt-6">
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
            </div>
          ) : null}

          {activeStep.id === "skills" ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Skills
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Add the skills, tools, and technologies you&apos;d put on a
                  resume. The more specific, the better your matches.
                </p>
              </div>
              <div className="border-t border-border pt-6">
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
            </div>
          ) : null}

          {activeStep.id === "background" ? (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Education &amp; experience
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Fresh graduate with no work experience yet? That&apos;s
                  completely fine — leave the experience section empty and
                  we&apos;ll match mostly on your skills.
                </p>
              </div>

              <div className="space-y-4 border-t border-border pt-6">
                <h2 className="text-sm font-semibold text-foreground">
                  Education
                </h2>
                <div className="divide-y divide-border">
                  {education.map((item, index) => (
                    <div key={index} className="grid gap-2 py-3 sm:grid-cols-3">
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

              <div className="space-y-4 border-t border-border pt-6">
                <h2 className="text-sm font-semibold text-foreground">
                  Experience{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </h2>
                <div className="divide-y divide-border">
                  {experience.map((item, index) => (
                    <div key={index} className="grid gap-2 py-3 sm:grid-cols-3">
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
                  ))}
                </div>
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
            </div>
          ) : null}

          {activeStep.id === "preferences" ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  What are you looking for?
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Roles you&apos;d want to be matched with. You can change
                  these anytime from Profile.
                </p>
              </div>
              <div className="border-t border-border pt-6">
                <ChipList
                  items={desiredRoles}
                  onAdd={(value) => setDesiredRoles((prev) => [...prev, value])}
                  onRemove={(value) =>
                    setDesiredRoles((prev) => prev.filter((r) => r !== value))
                  }
                  placeholder="e.g. Frontend Developer"
                />
              </div>
            </div>
          ) : null}

          {activeStep.id === "resume" ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Upload your resume
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Optional, but it gives the strongest starting signal for
                  your matches — especially before you&apos;ve saved or
                  applied to anything.
                </p>
              </div>
              <div className="border-t border-border pt-6">
                {resumeFileName ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border p-3">
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
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center hover:border-foreground/30 hover:bg-muted/40">
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
              </div>
            </div>
          ) : null}

          {activeStep.id === "review" ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Review
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Here&apos;s what we&apos;ll use to start matching you.
                  Everything here stays editable from Profile later.
                </p>
              </div>
              <div className="divide-y divide-border border-t border-border">
                <div className="py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Status &amp; location
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {STATUS_OPTIONS.find((o) => o.value === status)?.label ||
                      "Not set"}
                    {location ? ` · ${location}` : ""}
                  </p>
                </div>
                <div className="py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Skills ({skills.length})
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {skills.length > 0 ? skills.join(", ") : "None added"}
                  </p>
                </div>
                <div className="py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Desired roles ({desiredRoles.length})
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {desiredRoles.length > 0
                      ? desiredRoles.join(", ")
                      : "None added"}
                  </p>
                </div>
                <div className="py-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Resume
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {resumeFileName || "Not uploaded"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
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
