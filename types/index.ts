// Authentication & Users
export type SystemRole = 'ADMIN' | 'RECRUITER' | 'INTERVIEWER';

/** @deprecated Use SystemRole. Kept for backwards compat. */
export type WorkspaceRole = SystemRole;

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: SystemRole;
  activeWorkspaceId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Workspaces
export type WorkspaceMemberRole = 'OWNER' | 'ADMIN' | 'RECRUITER' | 'VIEWER';
export type WorkspaceMemberStatus = 'ACTIVE' | 'INVITED' | 'REMOVED' | 'EXPIRED';

export interface Workspace {
  id: string;
  name: string;
  isBusiness: boolean;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  /** The role of the currently authenticated user in this workspace */
  memberRole?: WorkspaceMemberRole | null;
  memberCount?: number;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
  status: WorkspaceMemberStatus;
  invitedById?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: SystemRole;
  };
}

export interface WorkspaceInvitation {
  id: string;
  email: string;
  workspaceId: string;
  token: string;
  role: WorkspaceMemberRole;
  expiresAt: string;
  createdAt: string;
}

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** The full detail of the currently active workspace */
  activeWorkspace: Workspace | null;
  /** All workspaces the user belongs to (for the switcher) */
  workspaces: Workspace[];
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  /** Switch the active workspace for the current user */
  switchWorkspace: (workspaceId: string) => Promise<void>;
  /** Refresh workspace list after creating / joining a new workspace */
  refreshWorkspaces: () => Promise<void>;
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
  timeline?: unknown[];
  scorecard?: unknown[];
}

// Billing
export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

// Email Templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

