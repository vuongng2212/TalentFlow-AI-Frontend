export type WorkspaceRole = 'Recruiter' | 'Admin';

export interface ActivityEvent {
  id: string;
  date: string;
  user: string;
  action: string;
  notes?: string;
}

export interface EvaluationCriteria {
  criteria: string;
  score: number; // 0 to 100 or 1 to 5
  notes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  avatar: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  score: number;
  scoreCategory: 'high' | 'mid' | 'low';
  skills: string[];
  appliedDate: string;
  email: string;
  phone?: string;
  summary: string;
  timeline: ActivityEvent[];
  scorecard: EvaluationCriteria[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // e.g. 'Full-time', 'Contract'
  status: 'open' | 'draft' | 'closed';
  applicantsCount: number;
  filledPipelines: number; // 0 to 5
  createdAt: string;
  salaryRange?: string;
  owner?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
}

export interface CandidateFilters {
  search?: string;
  stage?: string;
  minScore?: number;
}

export interface RoleContextProps {
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  isMounted: boolean;
}
