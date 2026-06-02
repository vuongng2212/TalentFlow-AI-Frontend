import { api, PaginatedData } from '@/lib/api-client';

export interface Workspace {
  id: string;
  name: string;
  domain?: string;
  createdAt: string;
}

export const workspaceService = {
  getWorkspaces: async (params?: { page?: number; limit?: number }) => {
    return api.get<PaginatedData<Workspace>>('/workspaces', params);
  },

  getWorkspaceById: async (id: string) => {
    return api.get<Workspace>(`/workspaces/${id}`);
  },

  createWorkspace: async (data: Partial<Workspace>) => {
    return api.post<Workspace>('/workspaces', data);
  },

  updateWorkspace: async (id: string, data: Partial<Workspace>) => {
    return api.patch<Workspace>(`/workspaces/${id}`, data);
  },

  deleteWorkspace: async (id: string) => {
    return api.delete<boolean>(`/workspaces/${id}`);
  }
};