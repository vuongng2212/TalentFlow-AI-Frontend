import { api, PaginatedData } from '@/lib/api-client';
import { Candidate } from '@/types';

export const candidateService = {
  getCandidates: async (params?: { page?: number; limit?: number; search?: string }) => {
    return api.get<PaginatedData<Candidate>>('/candidates', params);
  },

  getCandidateById: async (id: string) => {
    return api.get<Candidate>(`/candidates/${id}`);
  },

  updateCandidate: async (id: string, data: Partial<Candidate>) => {
    return api.patch<Candidate>(`/candidates/${id}`, data);
  },

  deleteCandidate: async (id: string) => {
    return api.delete<boolean>(`/candidates/${id}`);
  }
};
