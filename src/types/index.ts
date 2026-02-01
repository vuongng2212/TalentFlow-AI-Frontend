export type UserRole = "ADMIN" | "RECRUITER" | "INTERVIEWER";
export type JobStatus = "DRAFT" | "OPEN" | "CLOSED";
export type ApplicationStage =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";
export type ApplicationStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "REJECTED";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  salaryRange?: string;
  location: string;
  requirements: {
    skills: string[];
    experience: string;
    education?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  applicationCount: number;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  resumeUrl: string;
  appliedPosition: string;
  appliedDate: Date;
  stage: ApplicationStage;
  aiScore?: number; // 0-100
  skills?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  job: Job;
  candidate: Candidate;
  stage: ApplicationStage;
  status: ApplicationStatus;
  aiScore?: number;
  aiSummary?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: ApplicationStage;
  title: string;
  candidates: Candidate[];
  count: number;
}
