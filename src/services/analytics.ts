/**
 * Analytics Service
 *
 * Hooks for fetching analytics data from the backend.
 */

import { useFetch } from "@/hooks/use-fetch";
import { endpoints } from "@/lib/api/config";
import type {
  AnalyticsOverview,
  PipelineStage,
  TrendPoint,
  TopJob,
} from "@/types";

/**
 * Hook for fetching analytics overview
 */
export function useAnalyticsOverview() {
  return useFetch<AnalyticsOverview>(endpoints.analytics.overview);
}

/**
 * Hook for fetching pipeline stage counts
 */
export function useAnalyticsPipeline() {
  return useFetch<PipelineStage[]>(endpoints.analytics.pipeline);
}

/**
 * Hook for fetching application trends
 *
 * @param days Number of days to look back (default: 30)
 */
export function useAnalyticsTrends(days: number = 30) {
  const path = `${endpoints.analytics.trends}?days=${days}`;
  return useFetch<TrendPoint[]>(path);
}

/**
 * Hook for fetching top jobs by application count
 *
 * @param limit Number of top jobs to return (default: 5)
 */
export function useAnalyticsTopJobs(limit: number = 5) {
  const path = `${endpoints.analytics.topJobs}?limit=${limit}`;
  return useFetch<TopJob[]>(path);
}
