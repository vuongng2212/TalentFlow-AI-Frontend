export type Role = 'admin' | 'recruiter' | 'hiring_manager';

export interface RoleContext {
  role: Role;
  tenantId: string;
  tenantName: string;
  permissions: string[];
}

export interface FilterState {
  query?: string;
  status?: string[];
  roles?: string[];
  dateRange?: {
    start: string;
    end: string;
  } | null;
  savedViewId?: string | null;
}

export type ApplicationStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface ListState<T> {
  status: ApplicationStatus;
  error?: string | null;
  data: T[];
  totalCount: number;
}
