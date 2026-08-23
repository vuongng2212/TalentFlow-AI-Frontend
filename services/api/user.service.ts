import { api, PaginatedData } from '@/lib/api-client';
import { User } from '@/types';

export const userService = {
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    return api.get<PaginatedData<User>>('/users', params);
  },

  getUserById: async (id: string) => {
    return api.get<User>(`/users/${id}`);
  },

  updateUser: async (id: string, data: Partial<User>) => {
    return api.patch<User>(`/users/${id}`, data);
  },

  updateUserRole: async (id: string, role: string) => {
    return api.patch<User>(`/users/${id}/role`, { role });
  },

  switchActiveWorkspace: async (workspaceId: string) => {
    return api.patch<User>('/users/active-workspace', { workspaceId });
  },

  deleteUser: async (id: string) => {
    return api.delete<boolean>(`/users/${id}`);
  }
};