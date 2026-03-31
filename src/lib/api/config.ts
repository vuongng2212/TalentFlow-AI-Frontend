/**
 * API Configuration
 *
 * Centralized config for all API-related settings.
 * Uses environment variables with sensible defaults.
 */

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1",
  internalUrl: process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
  timeout: 30_000,
  retryAttempts: 2,
  retryDelay: 1_000,
} as const;

export const authConfig = {
  tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "talentflow_access_token",
  refreshKey: process.env.NEXT_PUBLIC_AUTH_REFRESH_KEY || "talentflow_refresh_token",
  endpoints: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
} as const;

export const featureFlags = {
  enableMockApi: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === "true",
} as const;

/** Endpoints grouped by domain for easy discovery */
export const endpoints = {
  auth: authConfig.endpoints,
  jobs: {
    list: "/jobs",
    detail: (id: string) => `/jobs/${id}`,
    create: "/jobs",
    update: (id: string) => `/jobs/${id}`,
    delete: (id: string) => `/jobs/${id}`,
  },
  candidates: {
    list: "/candidates",
    detail: (id: string) => `/candidates/${id}`,
    update: (id: string) => `/candidates/${id}`,
  },
  applications: {
    list: "/applications",
    detail: (id: string) => `/applications/${id}`,
    create: "/applications",
    upload: "/applications/upload",
    delete: (id: string) => `/applications/${id}`,
    byJob: (jobId: string) => `/jobs/${jobId}/applications`,
  },
  analytics: {
    overview: "/analytics/overview",
    pipeline: "/analytics/pipeline",
    trends: "/analytics/trends",
    topJobs: "/analytics/top-jobs",
  },
  interviews: {
    list: "/interviews",
    detail: (id: string) => `/interviews/${id}`,
    schedule: "/interviews",
    update: (id: string) => `/interviews/${id}`,
    cancel: (id: string) => `/interviews/${id}`,
  },
  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    updateRole: (id: string) => `/users/${id}/role`,
    delete: (id: string) => `/users/${id}`,
  },
} as const;
