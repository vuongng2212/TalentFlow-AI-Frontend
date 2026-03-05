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
import { UserRole } from "@/types";

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
