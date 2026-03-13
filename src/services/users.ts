/**
 * Users Service
 *
 * Hooks for fetching and mutating User data.
 */

import { useFetch, useMutation } from "@/hooks/use-fetch";
import { endpoints } from "@/lib/api/config";
import type { UpdateUserRequest } from "@/lib/api/types";
import type { User } from "@/types";

/**
 * Hook for fetching a user profile by ID
 */
export function useUserProfile(id: string | null) {
  return useFetch<User>(id ? endpoints.users.detail(id) : null);
}

/**
 * Hook for updating a user profile
 */
export function useUpdateUser(id: string) {
  return useMutation<User, UpdateUserRequest>(
    endpoints.users.update(id),
    "PATCH",
  );
}
