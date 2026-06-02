import { api } from '@/lib/api-client';
import { DashboardMetrics, PipelineStageCount, TrendData, TopJobData } from '@/types';

export const analyticsService = {
  getOverview: async () => {
    return api.get<DashboardMetrics>('/analytics/overview');
  },

  getPipeline: async () => {
    return api.get<PipelineStageCount[]>('/analytics/pipeline');
  },

  getTrends: async () => {
    return api.get<TrendData[]>('/analytics/trends');
  },

  getTopJobs: async () => {
    return api.get<TopJobData[]>('/analytics/top-jobs');
  }
};
