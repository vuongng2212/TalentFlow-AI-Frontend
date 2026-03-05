/**
 * Applications Service
 *
 * Hooks for fetching and mutating Application data.
 */

import { useFetch, useFetchList, useMutation } from "@/hooks/use-fetch";
import { endpoints } from "@/lib/api/config";
import type { ApplicationListParams } from "@/lib/api/types";
import type { Application } from "@/types";

/**
 * Hook for fetching a paginated list of applications
 * 
 * @param params Filter and pagination parameters
 */
export function useApplications(params?: ApplicationListParams) {
  return useFetchList<Application>(endpoints.applications.list, params);
}

/**
 * Hook for fetching a single application by its ID
 */
export function useApplication(id: string | null) {
  return useFetch<Application>(id ? endpoints.applications.detail(id) : null);
}

/**
 * Hook for submitting a new application
 */
export function useCreateApplication() {
  return useMutation<Application, Partial<Application>>(endpoints.applications.create, "POST");
}

/**
 * Hook for updating an application (e.g., stage or status)
 */
export function useUpdateApplication(id: string) {
  return useMutation<Application, Partial<Application>>(endpoints.applications.detail(id), "PUT");
}

/**
 * Hook for deleting (withdrawing) an application
 */
export function useDeleteApplication(id: string) {
  return useMutation<void>(endpoints.applications.detail(id), "DELETE");
}
