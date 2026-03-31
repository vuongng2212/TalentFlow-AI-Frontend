/**
 * Users Service
 *
 * Hooks for fetching and mutating User data.
 */

import { useFetch, useFetchList, useMutation } from "@/hooks/use-fetch";
import { endpoints } from "@/lib/api/config";
import type { UpdateUserRequest, ListParams } from "@/lib/api/types";
import type { User, UserRole } from "@/types";

/**
 * Hook for fetching a paginated list of users
 */
export function useUsers(params?: ListParams) {
  return useFetchList<User>(endpoints.users.list, params);
}

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

/**
 * Hook for updating a user's role
 */
export function useUpdateUserRole(id: string) {
  return useMutation<User, { role: UserRole }>(
    endpoints.users.updateRole(id),
    "PATCH",
  );
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser(id: string) {
  return useMutation<void>(
    endpoints.users.delete(id),
    "DELETE",
  );
}
