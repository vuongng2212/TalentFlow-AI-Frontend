import { api, apiClient, ApiResponse, PaginatedData } from '@/lib/api-client';
import { Application, ApplicationStage } from '@/types';

export const applicationService = {
  getApplications: async (params?: {
    page?: number;
    limit?: number;
    jobId?: string;
    stage?: ApplicationStage;
  }) => {
    return api.get<PaginatedData<Application>>('/applications', params);
  },

  getApplicationById: async (id: string) => {
    return api.get<Application>(`/applications/${id}`);
  },

  createApplication: async (data: Partial<Application>) => {
    return api.post<Application>('/applications', data);
  },

  uploadApplicationCv: async (formData: FormData) => {
    return apiClient.post<unknown, ApiResponse<Application>>('/applications/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data);
  },

  updateApplicationStage: async (id: string, stage: ApplicationStage) => {
    return api.put<Application>(`/applications/${id}`, { stage });
  },

  deleteApplication: async (id: string) => {
    return api.delete<boolean>(`/applications/${id}`);
  }
};
