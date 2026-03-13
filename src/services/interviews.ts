/**
 * Interviews Service
 *
 * Hooks for fetching and mutating Interview data.
 */

import { useFetch, useFetchList, useMutation } from "@/hooks/use-fetch";
import { endpoints } from "@/lib/api/config";
import type {
  InterviewListParams,
  CreateInterviewRequest,
  UpdateInterviewRequest,
} from "@/lib/api/types";
import type { Interview } from "@/types";

/**
 * Hook for fetching a paginated list of interviews
 */
export function useInterviews(params?: InterviewListParams) {
  return useFetchList<Interview>(endpoints.interviews.list, params);
}

/**
 * Hook for fetching a single interview by ID
 */
export function useInterview(id: string | null) {
  return useFetch<Interview>(id ? endpoints.interviews.detail(id) : null);
}

/**
 * Hook for creating/scheduling a new interview
 */
export function useCreateInterview() {
  return useMutation<Interview, CreateInterviewRequest>(
    endpoints.interviews.schedule,
    "POST",
  );
}

/**
 * Hook for updating an interview
 */
export function useUpdateInterview(id: string) {
  return useMutation<Interview, UpdateInterviewRequest>(
    endpoints.interviews.update(id),
    "PATCH",
  );
}

/**
 * Hook for cancelling an interview
 */
export function useCancelInterview(id: string) {
  return useMutation<void>(endpoints.interviews.cancel(id), "DELETE");
}
