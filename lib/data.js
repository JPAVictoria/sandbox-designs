// Static/mock data for the Angkop design prototypes.
// No backend — this stands in for the Express API + FastAPI ML microservice.

export const currentUser = {
  name: "Andre Victoria",
  email: "andre.victoria@gmail.com",
  role: "Fresh Graduate — BS Computer Science",
  location: "Muntinlupa City, Metro Manila",
  desiredRoles: ["Frontend Developer", "Product Designer"],
  avatarInitials: "AV",
  skills: [
    "JavaScript",
    "React",
    "HTML/CSS",
    "Figma",
    "Git",
    "REST APIs",
    "SQL",
  ],
  experience: [
    {
      title: "IT Intern",
      company: "Lyceum of Alabang — MIS Office",
      period: "Jan 2026 – Apr 2026",
      description:
        "Maintained internal record-keeping tools and assisted with front-end fixes on the student portal.",
    },
  ],
  education: [
    {
      school: "Lyceum of Alabang",
      degree: "BS Computer Science",
      period: "2022 – 2026",
    },
  ],
  resumeFileName: "andre-victoria-resume.pdf",
  gmailSendConnected: false,
};

export const platforms = [
  "JobStreet",
  "Indeed",
  "LinkedIn",
  "Kalibrr",
  "PhilJobNet",
  "Glassdoor",
];

export const jobs = [
  {
    id: "frontend-shopee",
    title: "Frontend Developer",
    company: "Shopee Philippines",
    platform: "JobStreet",
    location: "Taguig City (Hybrid)",
    salaryRange: "₱45,000 – ₱60,000",
    postedAt: "2026-09-05",
    matchScore: 92,
    semanticScore: 89,
    collaborativeScore: 95,
    savedState: "matched",
    tags: [],
    interviewDate: null,
    description:
      "Build and maintain customer-facing storefront components used by millions of shoppers. Work closely with design and backend teams to ship features on a two-week release cadence.",
    requiredSkills: [
      "JavaScript",
      "React",
      "HTML/CSS",
      "REST APIs",
      "TypeScript",
      "Testing (Jest)",
    ],
  },
  {
    id: "product-designer-canva",
    title: "Product Designer",
    company: "Canva",
    platform: "LinkedIn",
    location: "Remote (PH)",
    salaryRange: "₱55,000 – ₱70,000",
    postedAt: "2026-09-03",
    matchScore: 81,
    semanticScore: 84,
    collaborativeScore: 76,
    savedState: "saved",
    tags: ["Dream role"],
    interviewDate: null,
    description:
      "Design end-to-end user flows for Canva's editing tools, partnering with researchers and engineers from concept through launch.",
    requiredSkills: [
      "Figma",
      "Design Systems",
      "User Research",
      "Prototyping",
      "HTML/CSS",
    ],
  },
  {
    id: "ui-engineer-kumu",
    title: "UI Engineer",
    company: "Kumu",
    platform: "Kalibrr",
    location: "Pasig City (Onsite)",
    salaryRange: "₱40,000 – ₱52,000",
    postedAt: "2026-09-06",
    matchScore: 88,
    semanticScore: 90,
    collaborativeScore: 85,
    savedState: "saved",
    tags: ["Applying this week"],
    interviewDate: "2026-09-18",
    description:
      "Own the component library powering Kumu's livestreaming web app. Collaborate directly with product designers to keep the UI kit consistent.",
    requiredSkills: ["React", "JavaScript", "Figma", "Git", "REST APIs"],
  },
  {
    id: "junior-dev-accenture",
    title: "Junior Software Developer",
    company: "Accenture Philippines",
    platform: "Indeed",
    location: "Quezon City (Hybrid)",
    salaryRange: "₱32,000 – ₱42,000",
    postedAt: "2026-08-29",
    matchScore: 74,
    semanticScore: 78,
    collaborativeScore: 68,
    savedState: "matched",
    tags: [],
    interviewDate: null,
    description:
      "Join a delivery team building internal tooling for enterprise clients. Rotational exposure to front-end and backend maintenance work.",
    requiredSkills: ["JavaScript", "SQL", "Git", "Java", "REST APIs"],
  },
  {
    id: "web-developer-paymongo",
    title: "Web Developer",
    company: "PayMongo",
    platform: "Glassdoor",
    location: "Makati City (Hybrid)",
    salaryRange: "₱48,000 – ₱62,000",
    postedAt: "2026-09-01",
    matchScore: 85,
    semanticScore: 83,
    collaborativeScore: 88,
    savedState: "dismissed",
    tags: [],
    interviewDate: null,
    description:
      "Maintain the merchant-facing dashboard used to manage payment integrations, with a strong focus on reliability and clear data presentation.",
    requiredSkills: ["React", "TypeScript", "REST APIs", "SQL", "Testing (Jest)"],
  },
  {
    id: "business-analyst-metrobank",
    title: "Junior Business Analyst",
    company: "Metrobank",
    platform: "PhilJobNet",
    location: "Makati City (Onsite)",
    salaryRange: "₱30,000 – ₱38,000",
    postedAt: "2026-08-25",
    matchScore: 58,
    semanticScore: 61,
    collaborativeScore: 52,
    savedState: "matched",
    tags: [],
    interviewDate: null,
    description:
      "Support process documentation and reporting for the digital banking team, translating stakeholder requirements into technical specs.",
    requiredSkills: ["SQL", "Excel", "Documentation", "Stakeholder Communication"],
  },
  {
    id: "qa-engineer-globe",
    title: "QA Engineer",
    company: "Globe Telecom",
    platform: "JobStreet",
    location: "Taguig City (Onsite)",
    salaryRange: "₱38,000 – ₱48,000",
    postedAt: "2026-08-30",
    matchScore: 69,
    semanticScore: 72,
    collaborativeScore: 64,
    savedState: "matched",
    tags: [],
    interviewDate: null,
    description:
      "Own manual and automated test coverage for customer-facing web features across Globe's self-service portal.",
    requiredSkills: ["Testing (Jest)", "SQL", "Git", "REST APIs"],
  },
  {
    id: "frontend-jollibee-tech",
    title: "Frontend Engineer",
    company: "Jollibee Group Digital",
    platform: "LinkedIn",
    location: "Pasig City (Hybrid)",
    salaryRange: "₱42,000 – ₱55,000",
    postedAt: "2026-09-07",
    matchScore: 79,
    semanticScore: 77,
    collaborativeScore: 82,
    savedState: "matched",
    tags: [],
    interviewDate: null,
    description:
      "Build ordering-experience UI shared across the group's food-service brands, working from a shared design system.",
    requiredSkills: ["React", "JavaScript", "HTML/CSS", "Design Systems"],
  },
];

export const applications = jobs
  .filter((job) => job.savedState === "saved")
  .map((job, index) => ({
    jobId: job.id,
    status: ["applied", "interviewed"][index] ?? "pending",
    hasDraft: index === 0,
  }));

export const applicationStatuses = [
  { value: "pending", label: "Pending" },
  { value: "applied", label: "Applied" },
  { value: "awaiting_interview", label: "Awaiting Interview" },
  { value: "interviewed", label: "Interviewed" },
  { value: "successful", label: "Successful" },
  { value: "unsuccessful", label: "Unsuccessful" },
];

export const statusStyles = {
  pending: { label: "Pending", token: "status-pending" },
  applied: { label: "Applied", token: "status-applied" },
  awaiting_interview: { label: "Awaiting Interview", token: "status-interview" },
  interviewed: { label: "Interviewed", token: "status-interviewed" },
  successful: { label: "Successful", token: "status-success" },
  unsuccessful: { label: "Unsuccessful", token: "status-unsuccessful" },
};

export const skillGapsByRole = {
  "frontend-shopee": {
    targetRole: "Frontend Developer",
    basedOn: "Shopee Philippines",
    matchedSkills: ["JavaScript", "React", "HTML/CSS", "REST APIs"],
    missingSkills: [
      {
        skill: "TypeScript",
        reason: "Listed as a requirement in 4 of your top 5 matches.",
        courseIds: ["ts-fundamentals", "ts-react"],
      },
      {
        skill: "Testing (Jest)",
        reason: "Frequently required alongside React in your matched roles.",
        courseIds: ["jest-basics"],
      },
    ],
  },
  "product-designer-canva": {
    targetRole: "Product Designer",
    basedOn: "Canva",
    matchedSkills: ["Figma", "HTML/CSS"],
    missingSkills: [
      {
        skill: "User Research",
        reason: "Core requirement for product design roles you've matched with.",
        courseIds: ["ux-research-101"],
      },
      {
        skill: "Design Systems",
        reason: "Appears in 3 of your saved design-adjacent listings.",
        courseIds: ["design-systems-figma"],
      },
      {
        skill: "Prototyping",
        reason: "Commonly paired with Figma in job descriptions you've matched.",
        courseIds: ["advanced-prototyping"],
      },
    ],
  },
};

export const courses = [
  {
    id: "ts-fundamentals",
    title: "TypeScript Fundamentals",
    provider: "Coursera",
    level: "Beginner",
    duration: "6 hours",
    skillTag: "TypeScript",
    saved: true,
  },
  {
    id: "ts-react",
    title: "TypeScript for React Developers",
    provider: "Udemy",
    level: "Intermediate",
    duration: "8 hours",
    skillTag: "TypeScript",
    saved: false,
  },
  {
    id: "jest-basics",
    title: "Testing JavaScript Applications with Jest",
    provider: "freeCodeCamp",
    level: "Beginner",
    duration: "4 hours",
    skillTag: "Testing (Jest)",
    saved: true,
  },
  {
    id: "ux-research-101",
    title: "Foundations of User Research",
    provider: "Google (Coursera)",
    level: "Beginner",
    duration: "10 hours",
    skillTag: "User Research",
    saved: false,
  },
  {
    id: "design-systems-figma",
    title: "Building Design Systems in Figma",
    provider: "DesignLab",
    level: "Intermediate",
    duration: "5 hours",
    skillTag: "Design Systems",
    saved: false,
  },
  {
    id: "advanced-prototyping",
    title: "Advanced Prototyping in Figma",
    provider: "Udemy",
    level: "Intermediate",
    duration: "3 hours",
    skillTag: "Prototyping",
    saved: false,
  },
];

export const draftsByJobId = {
  "product-designer-canva": {
    subject: "Application for Product Designer — Andre Victoria",
    body: `Hi Canva Hiring Team,

I'm writing to apply for the Product Designer role. As a BS Computer Science graduate with hands-on Figma and front-end experience, I've spent the past year designing and building interfaces end-to-end — which I think gives me a practical edge in handing off and validating designs with engineering.

I'd welcome the chance to walk you through a recent project and learn more about the team.

Best,
Andre Victoria`,
  },
};

export function getJob(jobId) {
  return jobs.find((job) => job.id === jobId);
}
