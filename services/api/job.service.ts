import { api, PaginatedData } from '@/lib/api-client';
import { Job, TopJobData } from '@/types';

/**
 * Normalize requirements từ response API.
 * Backend lưu requirements dạng JSON object: { skills: string[], experience?: string }
 * Frontend dùng string[] để render.
 */
function normalizeRequirements(requirements: unknown): string[] {
  if (!requirements) return [];
  if (Array.isArray(requirements)) {
    // Fallback: nếu response đã là array (dữ liệu cũ)
    return requirements as string[];
  }
  if (typeof requirements === 'object' && requirements !== null) {
    const req = requirements as Record<string, unknown>;
    if (Array.isArray(req.skills)) {
      return req.skills as string[];
    }
  }
  return [];
}

/**
 * Transform requirements từ string[] (frontend) sang object (backend DTO).
 */
function transformRequirementsForApi(requirements: string[] | undefined): { skills: string[] } | undefined {
  if (!requirements || requirements.length === 0) return undefined;
  return { skills: requirements };
}

function normalizeJobResponse(job: Job): Job {
  if (job && job.requirements) {
    return { ...job, requirements: normalizeRequirements(job.requirements) };
  }
  return job;
}

function normalizeJobListResponse(response: PaginatedData<Job>): PaginatedData<Job> {
  return {
    ...response,
    data: response.data.map(normalizeJobResponse),
  };
}

export const jobService = {
  // Lấy danh sách công việc có phân trang
  getJobs: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const response = await api.get<PaginatedData<Job>>('/jobs', params);
    return normalizeJobListResponse(response);
  },

  // Lấy chi tiết một công việc
  getJobById: async (id: string) => {
    const job = await api.get<Job>(`/jobs/${id}`);
    return normalizeJobResponse(job);
  },

  // Tạo công việc mới
  createJob: async (data: Partial<Job>) => {
    const payload = {
      ...data,
      requirements: transformRequirementsForApi(data.requirements),
    };
    const job = await api.post<Job>('/jobs', payload);
    return normalizeJobResponse(job);
  },

  // Cập nhật công việc
  updateJob: async (id: string, data: Partial<Job>) => {
    const payload = {
      ...data,
      requirements: transformRequirementsForApi(data.requirements),
    };
    const job = await api.put<Job>(`/jobs/${id}`, payload);
    return normalizeJobResponse(job);
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
