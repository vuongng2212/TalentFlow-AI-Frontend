/**
 * SWR-based Data Fetching Hooks
 *
 * Vercel best practices applied:
 * - `client-swr-dedup`: Automatic request deduplication
 * - `async-parallel`: Multiple hooks on same page = parallel fetches
 * - `rerender-derived-state`: Return derived states (isEmpty, etc.)
 * - Type-safe with generics
 */

"use client";

import useSWR, { type SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { api } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse, ListParams } from "@/lib/api/types";
import { getErrorMessage, type ApiError } from "@/lib/api/errors";

/** Default SWR config optimized for performance */
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  dedupingInterval: 5_000,
  errorRetryCount: 2,
  shouldRetryOnError: (error: unknown) => {
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      return status >= 500;
    }
    return false;
  },
};

/** Generic fetcher for SWR */
async function fetcher<T>(url: string): Promise<T> {
  return api.get<T>(url);
}

/**
 * Hook for fetching a single resource
 *
 * @example
 * const { data, error, isLoading } = useFetch<Job>('/jobs/123');
 */
export function useFetch<T>(
  path: string | null,
  config?: SWRConfiguration<ApiResponse<T>, ApiError>,
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<T>, ApiError>(
    path,
    fetcher<ApiResponse<T>>,
    { ...defaultConfig, ...config },
  );

  return {
    data: data?.data,
    raw: data,
    error,
    errorMessage: error ? getErrorMessage(error) : null,
    isLoading,
    isValidating,
    mutate,
  };
}

/**
 * Hook for fetching paginated lists
 *
 * @example
 * const { data, pagination, isLoading } = useFetchList<Job>('/jobs', { page: 1, limit: 20 });
 */
export function useFetchList<T>(
  path: string | null,
  params?: ListParams,
  config?: SWRConfiguration<PaginatedResponse<T>, ApiError>,
) {
  // Build cache key with params for proper SWR deduplication
  const searchParams = params ? new URLSearchParams() : null;
  if (params && searchParams) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    }
  }
  const cacheKey = path ? (searchParams?.toString() ? `${path}?${searchParams.toString()}` : path) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<PaginatedResponse<T>, ApiError>(
    cacheKey,
    fetcher<PaginatedResponse<T>>,
    { ...defaultConfig, ...config },
  );

  return {
    data: data?.data?.data || [],
    pagination: data?.data?.meta,
    raw: data,
    error,
    errorMessage: error ? getErrorMessage(error) : null,
    isLoading,
    isValidating,
    isEmpty: !isLoading && (data?.data?.data?.length ?? 0) === 0,
    mutate,
  };
}

/**
 * Hook for mutations (POST, PUT, PATCH, DELETE)
 *
 * @example
 * const { trigger, isMutating } = useMutation<Job>('/jobs', 'POST');
 * await trigger({ title: 'New Job' });
 */
export function useMutation<TResponse, TBody = unknown>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
) {
  const { trigger, isMutating, error, data } = useSWRMutation<
    ApiResponse<TResponse>,
    ApiError,
    string,
    TBody
  >(
    path,
    async (url: string, { arg }: { arg: TBody }) => {
      switch (method) {
        case "POST":
          return api.post<ApiResponse<TResponse>>(url, arg);
        case "PUT":
          return api.put<ApiResponse<TResponse>>(url, arg);
        case "PATCH":
          return api.patch<ApiResponse<TResponse>>(url, arg);
        case "DELETE":
          return api.delete<ApiResponse<TResponse>>(url);
      }
    },
  );

  return {
    trigger,
    isMutating,
    error,
    errorMessage: error ? getErrorMessage(error) : null,
    data: data?.data,
  };
}
