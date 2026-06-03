// Authentication & Users
export type WorkspaceRole = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'INTERVIEWER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: WorkspaceRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Analytics
export interface DashboardMetrics {
  totalJobs: number;
  openJobs: number;
  totalCandidates: number;
  totalApplications: number;
  hiredCount: number;
  hireRate: number;
}

export interface PipelineStageCount {
  stage: ApplicationStage;
  count: number;
}

export interface TrendData {
  date: string;
  applications: number;
}

export interface TopJobData {
  id: string;
  title: string;
  department: string;
  status: JobStatus;
  applicationCount: number;
}

// Jobs
export type JobStatus = 'OPEN' | 'DRAFT' | 'CLOSED';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  createdById: string;
  createdBy?: Partial<User>;
  createdAt: string;
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

// Candidates & Applications
export type ApplicationStage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
export type ApplicationStatus = 'SUBMITTED' | 'IN_REVIEW' | 'DECIDED';

export interface Candidate {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  resumeText?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  cvFileKey?: string;
  cvFileUrl?: string;
  coverLetter?: string;
  notes?: string;
  appliedAt: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  candidate?: Candidate;
  job?: Partial<Job>;
}

// Interviews
export type InterviewType = 'SCREENING' | 'TECHNICAL' | 'CULTURE_FIT' | 'FINAL';
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Interview {
  id: string;
  applicationId: string;
  interviewerId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number; // in minutes
  location?: string; // e.g., Zoom link
  notes?: string;
  createdAt: string;
  updatedAt: string;
  interviewer?: Partial<User>;
  application?: Partial<Application>;
}

// Filters & UI Types (Kept for UI compatibility)
export interface CandidateFilters {
  search?: string;
  stage?: string;
  minScore?: number;
}

// UI specific backward-compatible properties that might be computed on FE
export interface UICandidate extends Candidate {
  avatar?: string;
  score?: number;
  scoreCategory?: 'high' | 'mid' | 'low';
  skills?: string[];
  summary?: string;
  timeline?: any[];
  scorecard?: any[];
}

// Billing
export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}
