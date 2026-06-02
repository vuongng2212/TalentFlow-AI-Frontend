import { api, PaginatedData } from '@/lib/api-client';
import { Job, TopJobData } from '@/types';

export const jobService = {
  // Lấy danh sách công việc có phân trang
  getJobs: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    return api.get<PaginatedData<Job>>('/jobs', params);
  },

  // Lấy chi tiết một công việc
  getJobById: async (id: string) => {
    return api.get<Job>(`/jobs/${id}`);
  },

  // Tạo công việc mới
  createJob: async (data: Partial<Job>) => {
    return api.post<Job>('/jobs', data);
  },

  // Cập nhật công việc
  updateJob: async (id: string, data: Partial<Job>) => {
    return api.put<Job>(`/jobs/${id}`, data);
  },

  // Xóa công việc
  deleteJob: async (id: string) => {
    return api.delete<boolean>(`/jobs/${id}`);
  },

  // (Optional) Analytics cho job nếu cần lấy riêng
  getTopJobs: async () => {
    return api.get<TopJobData[]>('/analytics/top-jobs');
  }
};
