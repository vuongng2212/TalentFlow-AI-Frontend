/**
 * Applications Service
 *
 * Hooks for fetching and mutating Application data.
 */

import { useFetch, useFetchList, useMutation } from "@/hooks/use-fetch";
import useSWRMutation from "swr/mutation";
import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/config";
import type {
  ApplicationListParams,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ApiResponse,
  UploadCvResponse,
} from "@/lib/api/types";
import type { ApiError } from "@/lib/api/errors";
import type { Application, ApplicationStage } from "@/types";

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
  return useMutation<Application, CreateApplicationRequest>(
    endpoints.applications.create,
    "POST",
  );
}

/**
 * Hook for updating an application (e.g., stage or status)
 */
export function useUpdateApplication(id: string) {
  return useMutation<Application, UpdateApplicationRequest>(
    endpoints.applications.detail(id),
    "PUT",
  );
}

/**
 * Hook for deleting (withdrawing) an application
 */
export function useDeleteApplication(id: string) {
  return useMutation<void>(endpoints.applications.delete(id), "DELETE");
}

/**
 * Imperative function for updating application stage.
 * Used in Kanban drag-and-drop where hook-based approach isn't practical.
 *
 * NOTE: This function does NOT catch errors internally.
 * Callers MUST wrap in try/catch and handle errors (e.g., toast + rollback).
 */
export async function updateApplicationStage(
  id: string,
  stage: ApplicationStage,
): Promise<Application> {
  const response = await api.put<ApiResponse<Application>>(
    endpoints.applications.detail(id),
    { stage },
  );
  return response.data;
}

/**
 * Hook for uploading a CV with multipart/form-data
 *
 * Uses api.upload() to send FormData to POST /applications/upload
 */
export function useUploadCV() {
  const { trigger, isMutating, error, data } = useSWRMutation<
    ApiResponse<UploadCvResponse>,
    ApiError,
    string,
    { file: File; jobId: string; coverLetter?: string }
  >(
    endpoints.applications.upload,
    async (
      url: string,
      { arg }: { arg: { file: File; jobId: string; coverLetter?: string } },
    ) => {
      const formData = new FormData();
      formData.append("file", arg.file);
      formData.append("jobId", arg.jobId);
      if (arg.coverLetter) {
        formData.append("coverLetter", arg.coverLetter);
      }
      return api.upload<ApiResponse<UploadCvResponse>>(url, formData);
    },
  );

  return {
    trigger,
    isMutating,
    error,
    data: data?.data,
  };
}
