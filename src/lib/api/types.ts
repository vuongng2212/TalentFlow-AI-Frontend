/**
 * API Type Definitions
 *
 * Generic types for API responses, errors, and pagination.
 * Aligned with backend TransformInterceptor response format:
 * { status, message, data, timestamp }
 */

/** Standard API success response (matches TransformInterceptor output) */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

/** Backend paginated data structure (inside `data` field) */
export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Full paginated API response: ApiResponse wrapping PaginatedData */
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Standard API error response from backend HttpExceptionFilter.
 *
 * Format:
 * { status, error, message, details?, timestamp, requestId? }
 *
 * - `details` is an array of validation error strings from class-validator
 * - `requestId` is the tracing ID from x-request-id header
 */
export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  details?: string[];
  timestamp: string;
  requestId?: string;
}

/** Query parameters for list endpoints */
export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Extended query params per domain */
export interface JobListParams extends ListParams {
  status?: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string;
}

export interface CandidateListParams extends ListParams {
  stage?: string;
  jobId?: string;
  minScore?: number;
}

export interface ApplicationListParams extends ListParams {
  stage?: string;
  status?: string;
  jobId?: string;
  candidateId?: string;
}

/** Auth request/response types */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  role: "ADMIN" | "RECRUITER" | "INTERVIEWER";
}

/**
 * Backend auth user shape (returned inside login/signup/me responses).
 * Matches backend `{ id, email, fullName, role, createdAt }`.
 */
import { UserRole, EmploymentType, JobStatus, ApplicationStage, ApplicationStatus, InterviewType, InterviewStatus } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Login response data (after TransformInterceptor extracts `message`).
 * Actual response: `{ status, message: "Login successful", data: { user: AuthUser }, timestamp }`
 */
export interface LoginResponseData {
  user: AuthUser;
}

/**
 * Signup response data (after TransformInterceptor extracts `message`).
 * Actual response: `{ status, message: "User registered successfully", data: { user: AuthUser }, timestamp }`
 */
export interface SignupResponseData {
  user: AuthUser;
}

/** Generic mutation result */
export interface MutationResult<T = void> {
  data: T;
  message: string;
}

/** Jobs — Create request (matches backend CreateJobDto) */
export interface CreateJobRequest {
  title: string;
  description?: string;
  department?: string;
  location?: string;
  employmentType?: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  status?: JobStatus;
  requirements?: string[] | Record<string, unknown>;
}

/** Jobs — Update request (all fields optional, matches backend UpdateJobDto = PartialType(CreateJobDto)) */
export type UpdateJobRequest = Partial<CreateJobRequest>;

/** Applications — Create request (matches backend CreateApplicationDto) */
export interface CreateApplicationRequest {
  jobId: string;
  coverLetter?: string;
  cvFileKey?: string;
  cvFileUrl?: string;
}

/** Applications — Update request (matches backend UpdateApplicationDto) */
export interface UpdateApplicationRequest {
  stage?: ApplicationStage;
  status?: ApplicationStatus;
  notes?: string;
  coverLetter?: string;
}

/** Applications — Upload CV response (matches backend UploadCvResponseDto) */
export interface UploadCvResponse {
  applicationId: string;
  fileKey: string;
  fileUrl: string;
  presignedUrl?: string;
  status: string;
}

/** Interviews — Create request (matches backend CreateInterviewDto) */
export interface CreateInterviewRequest {
  applicationId: string;
  scheduledAt: string;
  duration?: number;
  type?: InterviewType;
  location?: string;
  notes?: string;
  interviewerId?: string;
}

/** Interviews — Update request (matches backend UpdateInterviewDto) */
export interface UpdateInterviewRequest {
  scheduledAt?: string;
  duration?: number;
  type?: InterviewType;
  location?: string;
  notes?: string;
  status?: InterviewStatus;
  interviewerId?: string;
}

/** Interviews — Query params */
export interface InterviewListParams extends ListParams {
  applicationId?: string;
  interviewerId?: string;
  type?: InterviewType;
  status?: InterviewStatus;
}

/** Users — Update profile request */
export interface UpdateUserRequest {
  fullName?: string;
}

/** Users — Update role request */
export interface UpdateRoleRequest {
  role: UserRole;
}
