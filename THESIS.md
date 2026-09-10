# Angkop — Thesis & Product Context

This file is the design/product source of truth for this repository. It is a UI/UX
prototyping sandbox for a real undergraduate thesis system. Every screen built here
must be traceable to something described below — do not invent features, modules,
or data that aren't part of the thesis.

This repo currently only builds the **front-end shell**: static screens, mock/sample
data, button interactions, and page-to-page navigation. There is no backend, no
database, no auth, and no real API calls. "Actions" (save job, approve draft, send
email, etc.) should visually respond (state change, toast, dialog) but do not need
to persist anything real.

## 1. What the system is

**Angkop** ("fitting" / "suitable" in Filipino) is *"A Web-Based Career
Recommendation System Using Hybrid Semantic and Collaborative Filtering with
Real-Time Browser Extension Matching."* It is a thesis project by Osio, Rosales,
Victoria, and Ydel (BS Computer Science, Lyceum of Alabang, July 2026).

It is a multi-platform hybrid job matching and career recommendation system made of
two coordinated surfaces:

- **A web dashboard** (this is what we are designing) — desktop and mobile browser
  accessible, where users manage their profile, review ranked job matches, inspect
  skill gaps, browse/save courses, and track applications.
- **A browser extension** — overlays a real-time match score directly onto job
  listings on supported third-party platforms, and captures browsing behavior
  (views, saves, dismissals, applications) as implicit feedback. The extension
  itself is **out of scope for this repo** (no browser-extension screens), but the
  dashboard should assume it exists and reflect the data it feeds in (e.g. "matched
  via extension on JobStreet").

## 2. The problem it solves

Job seekers, especially first-time entrants and fresh graduates in the Philippines,
struggle to identify roles that genuinely match their skills. Existing platforms
rely on keyword-based search, so semantically equivalent terms ("React developer"
vs. "front-end engineer") are treated as unrelated. The responsibility to interpret
job postings falls entirely on the individual, with no intelligent support. Existing
AI-powered platforms (LinkedIn, Indeed, Jobright, etc.) keep their matching
algorithms proprietary and undisclosed; government channels (PhilJobNet, PESO) are
transparent but depend on manual, human-mediated referral at limited scale.

Angkop's premise: shift the burden of interpreting job postings away from the
individual and onto a system that understands the *meaning* of a person's skills —
transparently, and specifically for this population.

## 3. Target users

- **Job seekers**, particularly first-time entrants to the Philippine workforce and
  fresh graduates, including those who studied Computer Science/IT-adjacent
  programs. They may not have a large resume/interaction history yet (cold start).
- Secondary respondent group used only for thesis evaluation (not a product
  persona): **IT/AI development experts** who evaluate technical quality.

Design tone should assume: someone anxious about job hunting, wants clarity and
reassurance rather than corporate salesy dashboards, is not necessarily a power
user, and is checking this from both a laptop and a phone browser.

## 4. Core intelligence (context only — not something we build UI internals for)

- **Sentence-BERT** — converts skills and job descriptions into 768-dimensional
  semantic embeddings; cosine similarity produces a **semantic match score**.
- **Neural Collaborative Filtering (NCF)** — learns from a user's interaction
  history (views, saves, applications, dismissals — weighted, application > save >
  view/dismissal) to personalize ranking over time. Gets better the more the user
  uses the system; early/new users get less-refined suggestions (cold start).
- **Hybrid Ranking** — combines the semantic score and the collaborative score into
  one ranked list. This combined number is "the match score" shown to users.
- **Skill Gap Detection** — vector subtraction between a user's embedding and a
  target job's embedding isolates the specific skill dimensions the user is missing,
  which are mapped to course recommendations.
- **Gemini** — drafts a tailored cover letter + application email using the job
  description and user profile. Draft is always editable and requires explicit user
  approval before it is sent via the user's Gmail account (separate incremental
  OAuth consent, `gmail.send` scope). Nothing is ever auto-sent.

These are *why* certain UI elements exist (e.g. a "match score", a "skill gap
breakdown", a "review before sending" step) — the dashboard should surface their
outputs clearly, not expose ML internals.

## 5. Main features / modules (what the dashboard must support)

1. **Profile / Applicant Profile** — skills, education, experience, preferences
   (desired role, location). Resume/CV upload. Basis for all matching.
2. **Job Matching** — ranked job recommendations with a visible match score;
   browsing/filtering; view job detail (scraped description, source platform: one
   of JobStreet, Indeed, LinkedIn, Kalibrr, PhilJobNet, Glassdoor); save, dismiss,
   or delete a listing.
3. **Skill Gap Detection** — per target role, show which specific skills the user
   is missing relative to that role.
4. **Course Recommendations** — courses mapped to identified skill gaps; users can
   browse and save courses for later reference. (Third-party learning resources —
   Angkop does not host its own course content.)
5. **Application Tracking** — for saved jobs: status through a fixed pipeline —
   **pending → applied → awaiting interview → interviewed → successful /
   unsuccessful**; optional manually-set interview date; custom user-defined tags
   to organize saved jobs.
6. **AI Cover Letter & Email Generation** — generate a tailored draft for a chosen
   job; user reviews/edits inline; explicit "approve & send" action (requires Gmail
   send permission) vs. "discard." Draft only ever exists in memory/session, never
   silently saved or sent.
7. **Authentication** — Google OAuth 2.0 only (no passwords). Same identity used by
   both the dashboard and the extension. (Out of scope to build a real auth flow in
   this prototype — a simple "Sign in with Google" entry screen is enough if/when
   needed; assume the user is already signed in once inside `design-*` routes.)

There is **no** native mobile app, no recruiter-facing interface, and no in-house
course content — do not design screens implying these exist.

## 6. Typical user flow

1. User signs in with Google (once) → lands on **Dashboard**.
2. Dashboard surfaces: top/new ranked matches, a skill-gap summary, application
   pipeline snapshot, and any drafts awaiting review.
3. User browses **Jobs**, filters/sorts by match score or platform, opens a job to
   see its full match breakdown, and saves or dismisses it.
4. For a saved job the user is targeting, they check **Skill Gaps** to see what's
   missing and jump into recommended **Courses**.
5. When ready to apply, user requests an AI cover letter/email draft for that job,
   reviews/edits it, and approves sending (or discards it).
6. User tracks the saved job's progress in **Applications**, updating its status and
   optionally an interview date, and organizes jobs with tags.
7. User keeps their **Profile** up to date, which feeds back into match quality.

This is the flow the navigation and cross-links between pages should reinforce
(e.g. a job card links to its skill gap view; a skill gap view links to its mapped
courses; an application row links to its cover letter draft).

## 7. Terminology (use these terms consistently in UI copy)

- **Match Score** — the hybrid (semantic + collaborative) compatibility score
  between a user and a job, 0–100%.
- **Skill Gap** — a skill the user currently lacks relative to a target role.
- **Saved Job** — a job the user explicitly kept (stronger signal than a view).
- **Application Status** — one of: Pending, Applied, Awaiting Interview,
  Interviewed, Successful, Unsuccessful.
- **Tag** — a custom label a user attaches to a saved job to organize it.
- **Draft** — an AI-generated cover letter/email awaiting the user's review.
- **Cold Start** — a new user with little/no interaction history yet, so
  recommendations lean more on semantic matching than personalization.
- **Supported platforms** — JobStreet, Indeed, LinkedIn, Kalibrr, PhilJobNet,
  Glassdoor (the six platforms the browser extension reads from).

## 8. What each major page should accomplish

- **Dashboard** — orientation + the most useful summary at a glance: how many new
  matches, top match(es) worth acting on, a compact skill-gap or readiness signal,
  application pipeline snapshot, and any drafts waiting for approval. Should answer
  "what should I do today?", not just decorate stats.
- **Jobs** — the primary matching surface. Ranked list of job matches with score,
  title, company, platform source, location; filter/sort (by score, platform,
  status, date); job detail view with full description and match breakdown; save /
  dismiss actions.
- **Skill Gaps** — pick a target role (from a saved/matched job or a desired role),
  see the specific missing skills, and see the courses mapped to closing each gap.
- **Courses** — a browsable/searchable library of recommended + saved courses,
  clearly distinguishing "recommended because of a gap" from "saved for later."
- **Applications** — the saved-jobs pipeline: status per job, tags, optional
  interview date, and access to that job's cover letter/email draft (generate,
  edit, approve & send, or discard).
- **Profile** — resume/skills/experience/preferences, since this is the input that
  drives every match.

## 9. Constraints relevant to design

- Sign-in is Google-only; no password fields anywhere.
- Sending an email is always a two-step, explicit, reversible action (review draft
  → approve). Never auto-send.
- Course content is third-party — course cards link out, they don't host lessons.
- New users may have thin data (cold start) — empty/low-data states matter and
  should not look broken.
- Only six named platforms are supported — don't imply arbitrary job-board coverage.
- No native mobile app — "responsive web," not "app-like install" messaging.
