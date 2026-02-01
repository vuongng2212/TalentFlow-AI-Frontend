import type { User, Job, Candidate, Application, KanbanColumn } from "@/types";

// ============================================
// MOCK USERS
// ============================================

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@talentflow.ai",
    fullName: "Admin User",
    role: "ADMIN",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    email: "recruiter@talentflow.ai",
    fullName: "Jane Recruiter",
    role: "RECRUITER",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    createdAt: new Date("2026-01-05"),
  },
  {
    id: "3",
    email: "interviewer@talentflow.ai",
    fullName: "John Interviewer",
    role: "INTERVIEWER",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    createdAt: new Date("2026-01-10"),
  },
];

// ============================================
// MOCK JOBS
// ============================================

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Full-Stack Developer",
    description:
      "We are looking for an experienced full-stack developer to join our growing team. You will work on cutting-edge technologies including Next.js, NestJS, and PostgreSQL.",
    status: "OPEN",
    salaryRange: "$100k - $150k",
    location: "Remote",
    requirements: {
      skills: ["NestJS", "Next.js", "PostgreSQL", "TypeScript", "Kafka"],
      experience: "5+ years",
      education: "Bachelor's degree in Computer Science",
    },
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
    createdBy: mockUsers[1],
    applicationCount: 24,
  },
  {
    id: "2",
    title: "Frontend Developer (React/Next.js)",
    description:
      "Join our frontend team and help build beautiful, user-friendly interfaces. Experience with React, Next.js 16, and TailwindCSS required.",
    status: "OPEN",
    salaryRange: "$80k - $120k",
    location: "Hybrid - San Francisco",
    requirements: {
      skills: ["React", "Next.js", "TailwindCSS", "TypeScript"],
      experience: "3+ years",
    },
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-01-20"),
    createdBy: mockUsers[1],
    applicationCount: 18,
  },
  {
    id: "3",
    title: "Backend Engineer (Node.js/NestJS)",
    description:
      "We're seeking a backend engineer with strong Node.js skills. You'll design and implement scalable microservices architecture.",
    status: "OPEN",
    salaryRange: "$120k - $160k",
    location: "Remote",
    requirements: {
      skills: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Docker"],
      experience: "4+ years",
      education: "Bachelor's degree preferred",
    },
    createdAt: new Date("2026-01-25"),
    updatedAt: new Date("2026-01-25"),
    createdBy: mockUsers[1],
    applicationCount: 15,
  },
  {
    id: "4",
    title: "DevOps Engineer",
    description:
      "Build and maintain our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines essential.",
    status: "OPEN",
    salaryRange: "$110k - $145k",
    location: "Remote",
    requirements: {
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub Actions"],
      experience: "3+ years",
    },
    createdAt: new Date("2026-01-28"),
    updatedAt: new Date("2026-01-28"),
    createdBy: mockUsers[1],
    applicationCount: 8,
  },
  {
    id: "5",
    title: "UI/UX Designer",
    description:
      "Create stunning user experiences for our recruitment platform. Proficiency in Figma and design systems required.",
    status: "DRAFT",
    salaryRange: "$85k - $115k",
    location: "Hybrid - New York",
    requirements: {
      skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
      experience: "3+ years",
    },
    createdAt: new Date("2026-01-30"),
    updatedAt: new Date("2026-01-30"),
    createdBy: mockUsers[1],
    applicationCount: 0,
  },
];

// ============================================
// MOCK CANDIDATES
// ============================================

export const mockCandidates: Candidate[] = [
  {
    id: "c1",
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    resumeUrl: "https://example.com/resumes/alex-johnson.pdf",
    appliedPosition: "Senior Full-Stack Developer",
    appliedDate: new Date("2026-01-20"),
    stage: "APPLIED",
    aiScore: 92,
    skills: ["NestJS", "Next.js", "PostgreSQL", "TypeScript"],
  },
  {
    id: "c2",
    fullName: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    resumeUrl: "https://example.com/resumes/sarah-chen.pdf",
    appliedPosition: "Senior Full-Stack Developer",
    appliedDate: new Date("2026-01-21"),
    stage: "SCREENING",
    aiScore: 88,
    skills: ["React", "Node.js", "MongoDB", "AWS"],
  },
  {
    id: "c3",
    fullName: "Michael Brown",
    email: "michael.brown@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    resumeUrl: "https://example.com/resumes/michael-brown.pdf",
    appliedPosition: "Frontend Developer (React/Next.js)",
    appliedDate: new Date("2026-01-22"),
    stage: "INTERVIEW",
    aiScore: 95,
    skills: ["React", "Next.js", "TailwindCSS", "TypeScript"],
  },
  {
    id: "c4",
    fullName: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 345-6789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    resumeUrl: "https://example.com/resumes/emily-davis.pdf",
    appliedPosition: "Backend Engineer (Node.js/NestJS)",
    appliedDate: new Date("2026-01-23"),
    stage: "OFFER",
    aiScore: 90,
    skills: ["NestJS", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: "c5",
    fullName: "David Wilson",
    email: "david.wilson@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    resumeUrl: "https://example.com/resumes/david-wilson.pdf",
    appliedPosition: "DevOps Engineer",
    appliedDate: new Date("2026-01-24"),
    stage: "HIRED",
    aiScore: 87,
    skills: ["AWS", "Kubernetes", "Terraform"],
  },
  {
    id: "c6",
    fullName: "Lisa Martinez",
    email: "lisa.martinez@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    resumeUrl: "https://example.com/resumes/lisa-martinez.pdf",
    appliedPosition: "Senior Full-Stack Developer",
    appliedDate: new Date("2026-01-25"),
    stage: "REJECTED",
    aiScore: 65,
    skills: ["PHP", "Laravel", "MySQL"],
  },
  {
    id: "c7",
    fullName: "James Taylor",
    email: "james.taylor@email.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    resumeUrl: "https://example.com/resumes/james-taylor.pdf",
    appliedPosition: "Frontend Developer (React/Next.js)",
    appliedDate: new Date("2026-01-26"),
    stage: "APPLIED",
    aiScore: 82,
    skills: ["React", "Vue.js", "JavaScript"],
  },
  {
    id: "c8",
    fullName: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
    resumeUrl: "https://example.com/resumes/jennifer-lee.pdf",
    appliedPosition: "Backend Engineer (Node.js/NestJS)",
    appliedDate: new Date("2026-01-27"),
    stage: "SCREENING",
    aiScore: 91,
    skills: ["Node.js", "Express", "MongoDB"],
  },
];

// ============================================
// MOCK KANBAN DATA
// ============================================

export const mockKanbanColumns: KanbanColumn[] = [
  {
    id: "APPLIED",
    title: "Applied",
    candidates: mockCandidates.filter((c) => c.stage === "APPLIED"),
    count: mockCandidates.filter((c) => c.stage === "APPLIED").length,
  },
  {
    id: "SCREENING",
    title: "Screening",
    candidates: mockCandidates.filter((c) => c.stage === "SCREENING"),
    count: mockCandidates.filter((c) => c.stage === "SCREENING").length,
  },
  {
    id: "INTERVIEW",
    title: "Interview",
    candidates: mockCandidates.filter((c) => c.stage === "INTERVIEW"),
    count: mockCandidates.filter((c) => c.stage === "INTERVIEW").length,
  },
  {
    id: "OFFER",
    title: "Offer",
    candidates: mockCandidates.filter((c) => c.stage === "OFFER"),
    count: mockCandidates.filter((c) => c.stage === "OFFER").length,
  },
  {
    id: "HIRED",
    title: "Hired",
    candidates: mockCandidates.filter((c) => c.stage === "HIRED"),
    count: mockCandidates.filter((c) => c.stage === "HIRED").length,
  },
  {
    id: "REJECTED",
    title: "Rejected",
    candidates: mockCandidates.filter((c) => c.stage === "REJECTED"),
    count: mockCandidates.filter((c) => c.stage === "REJECTED").length,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getMockUser(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}

export function getMockJob(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id);
}

export function getMockCandidate(id: string): Candidate | undefined {
  return mockCandidates.find((candidate) => candidate.id === id);
}
