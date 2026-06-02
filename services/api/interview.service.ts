import { api, PaginatedData } from '@/lib/api-client';
import { Interview, InterviewStatus, InterviewType } from '@/types';

export const interviewService = {
  getInterviews: async (params?: {
    page?: number;
    limit?: number;
    applicationId?: string;
    interviewerId?: string;
    status?: InterviewStatus;
  }) => {
    return api.get<PaginatedData<Interview>>('/interviews', params);
  },

  getInterviewById: async (id: string) => {
    return api.get<Interview>(`/interviews/${id}`);
  },

  createInterview: async (data: {
    applicationId: string;
    interviewerId: string;
    type: InterviewType;
    scheduledAt: string;
    duration: number;
    location?: string;
    notes?: string;
  }) => {
    return api.post<Interview>('/interviews', data);
  },

  updateInterview: async (id: string, data: Partial<Interview>) => {
    return api.patch<Interview>(`/interviews/${id}`, data);
  },

  deleteInterview: async (id: string) => {
    return api.delete<boolean>(`/interviews/${id}`);
  }
};
