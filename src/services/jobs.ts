/**
 * Jobs Service
 *
 * Hooks for fetching and mutating Job data.
 * Optimized for SWR-caching and type-safety.
 */

import { useFetch, useFetchList, useMutation } from "@/hooks/use-fetch";
import { endpoints } from "@/lib/api/config";
import type { JobListParams } from "@/lib/api/types";
import type { Job as DomainJob } from "@/types";

/**
 * Hook for fetching a paginated list of jobs
 * 
 * @param params Filter and pagination parameters
 * @returns Paginated job data, loading state, and mutate function
 */
export function useJobs(params?: JobListParams) {
  return useFetchList<DomainJob>(endpoints.jobs.list, params);
}

/**
 * Hook for fetching a single job by its ID
 * 
 * @param id Job ID
 * @returns Job detail, loading state, and mutate function
 */
export function useJob(id: string | null) {
  return useFetch<DomainJob>(id ? endpoints.jobs.detail(id) : null);
}

/**
 * Hook for creating a new job
 */
export function useCreateJob() {
  return useMutation<DomainJob, Partial<DomainJob>>(endpoints.jobs.create, "POST");
}

/**
 * Hook for updating an existing job
 * 
 * @param id Job ID
 */
export function useUpdateJob(id: string) {
  return useMutation<DomainJob, Partial<DomainJob>>(endpoints.jobs.detail(id), "PUT");
}

/**
 * Hook for deleting a job
 * 
 * @param id Job ID
 */
export function useDeleteJob(id: string) {
  return useMutation<void>(endpoints.jobs.detail(id), "DELETE");
}
