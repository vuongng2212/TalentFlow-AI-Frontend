export type UserRole = "ADMIN" | "RECRUITER" | "INTERVIEWER";
export type JobStatus = "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";
export type ApplicationStage =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";
export type ApplicationStatus =
  | "ACTIVE"
  | "WITHDRAWN"
  | "REJECTED";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  /** @deprecated Will be removed when backend adds avatar support */
  avatar?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

/**
 * Job as returned by backend GET /jobs and GET /jobs/:id.
 *
 * When listing jobs (`findAll`), backend includes:
 * - `createdBy`: partial User object `{ id, email, fullName }`
 * - `_count.applications`: number of applications for this job
 */
export interface Job {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  employmentType: EmploymentType;
  salaryMin: number | null;
  salaryMax: number | null;
  status: JobStatus;
  requirements: string[] | Record<string, unknown> | null;
  createdById?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  /** Included by backend via Prisma `include` on list queries */
  createdBy?:
    | {
        id: string;
        email: string;
        fullName: string;
      }
    | User;
  /** Included by backend via Prisma `_count` on list queries */
  _count?: {
    applications: number;
  };
  /**
   * @deprecated Use `salaryMin`/`salaryMax` instead. Kept for mock data compatibility.
   * Will be removed when mock data is fully replaced by API.
   */
  salaryRange?: string;
  /**
   * @deprecated Use `_count.applications` instead. Kept for mock data compatibility.
   * Will be removed when mock data is fully replaced by API.
   */
  applicationCount?: number;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  resumeText?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * View-model for UI components that display candidate data derived from
 * Application records. Extends Candidate with display fields mapped from
 * the Application and its relations.
 */
export interface CandidateViewModel extends Candidate {
  _applicationId: string;
  stage?: ApplicationStage;
  aiScore?: number;
  appliedPosition?: string;
  appliedDate?: Date | string;
  skills?: string[];
  avatar?: string;
}

/**
 * Application as returned by backend GET /applications.
 *
 * When listing applications (`findAll`), backend includes:
 * - `job`: partial Job `{ id, title, department, location, employmentType }`
 * - `candidate`: partial Candidate `{ id, email, fullName }`
 */
export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  cvFileKey: string | null;
  cvFileUrl: string | null;
  coverLetter: string | null;
  notes: string | null;
  appliedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Included by backend via Prisma `include` on list queries */
  job?: {
    id: string;
    title: string;
    department: string | null;
    location: string | null;
    employmentType: EmploymentType;
  };
  /** Included by backend via Prisma `include` on list queries */
  candidate?: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface KanbanColumn {
  id: ApplicationStage;
  title: string;
  candidates: CandidateViewModel[];
  count: number;
}

// ─── Analytics Types ───────────────────────────────────────

export interface AnalyticsOverview {
  totalJobs: number;
  openJobs: number;
  totalCandidates: number;
  totalApplications: number;
  hiredCount: number;
  hireRate: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
}

export interface TrendPoint {
  date: string;
  applications: number;
}

export interface TopJob {
  id: string;
  title: string;
  department: string | null;
  status: string;
  applicationCount: number;
}

// ─── Interview Types ───────────────────────────────────────

export type InterviewType =
  | "PHONE"
  | "VIDEO"
  | "IN_PERSON"
  | "PANEL"
  | "TECHNICAL";

export type InterviewStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  duration: number;
  type: InterviewType;
  location: string | null;
  notes: string | null;
  status: InterviewStatus;
  interviewerId: string | null;
  createdAt: string;
  updatedAt: string;
  application?: {
    id: string;
    candidate: { id: string; fullName: string; email: string };
    job: { id: string; title: string };
  };
  interviewer?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}
