/**
 * API Module — Barrel Export
 *
 * Single import point for all API utilities:
 * import { api, endpoints, ApiError } from '@/lib/api';
 *
 * NOTE: Per `bundle-barrel-imports` rule, this barrel file is acceptable
 * because all items are lightweight re-exports (no side-effects).
 * For large modules, prefer direct imports.
 */

export { api, tokenManager } from "./client";
export { apiConfig, authConfig, endpoints, featureFlags } from "./config";
export { ApiError, getErrorMessage } from "./errors";
export type {
  ApiErrorResponse,
  ApiResponse,
  AuthUser,
  ApplicationListParams,
  CandidateListParams,
  CreateApplicationRequest,
  CreateJobRequest,
  JobListParams,
  ListParams,
  LoginRequest,
  LoginResponseData,
  MutationResult,
  PaginatedResponse,
  PaginationMeta,
  SignupRequest,
  SignupResponseData,
  UpdateApplicationRequest,
  UpdateJobRequest,
  UploadCvResponse,
} from "./types";
