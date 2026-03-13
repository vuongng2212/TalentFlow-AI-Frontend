"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Briefcase,
  Target,
  Loader2,
  BarChart3,
} from "lucide-react";
import {
  useAnalyticsOverview,
  useAnalyticsPipeline,
  useAnalyticsTopJobs,
} from "@/services/analytics";

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useAnalyticsOverview();
  const { data: pipeline, isLoading: pipelineLoading } = useAnalyticsPipeline();
  const { data: topJobs, isLoading: topJobsLoading } = useAnalyticsTopJobs(5);

  const isLoading = overviewLoading || pipelineLoading || topJobsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <BarChart3 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold">Failed to load analytics</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  // Derived values from real data
  const totalCandidates = overview?.totalCandidates ?? 0;
  const totalApplications = overview?.totalApplications ?? 0;
  const hiredCount = overview?.hiredCount ?? 0;
  const hireRate = overview?.hireRate ?? 0;
  const openJobs = overview?.openJobs ?? 0;

  // Calculate pipeline conversion rates from real pipeline data
  const pipelineData = pipeline ?? [];
  const stageCountMap = new Map(pipelineData.map((s) => [s.stage, s.count]));
  const appliedCount = stageCountMap.get("APPLIED") ?? 0;
  const screeningCount = stageCountMap.get("SCREENING") ?? 0;
  const interviewCount = stageCountMap.get("INTERVIEW") ?? 0;
  const offerCount = stageCountMap.get("OFFER") ?? 0;
  const pipelineHiredCount = stageCountMap.get("HIRED") ?? 0;

  const activeCandidates = totalApplications - hiredCount - (stageCountMap.get("REJECTED") ?? 0);

  const conversionRates = [
    {
      stage: "Applied → Screening",
      rate: appliedCount > 0 ? Math.round((screeningCount / appliedCount) * 100) : 0,
      count: `${screeningCount}/${appliedCount}`,
    },
    {
      stage: "Screening → Interview",
      rate: screeningCount > 0 ? Math.round((interviewCount / screeningCount) * 100) : 0,
      count: `${interviewCount}/${screeningCount}`,
    },
    {
      stage: "Interview → Offer",
      rate: interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0,
      count: `${offerCount}/${interviewCount}`,
    },
    {
      stage: "Offer → Hired",
      rate: offerCount > 0 ? Math.round((pipelineHiredCount / offerCount) * 100) : 0,
      count: `${pipelineHiredCount}/${offerCount}`,
    },
  ];

  const topJobsList = topJobs ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track recruitment metrics and performance insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hire Rate
            </CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{hireRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hiredCount} hired from {totalApplications} applications
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Candidates
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCandidates}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalApplications} applications submitted
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Pipeline
            </CardTitle>
            <Briefcase className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCandidates}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {openJobs} open positions
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hired This Period
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{hiredCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {overview?.totalJobs ?? 0} total jobs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline Conversion */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Conversion Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversionRates.map((item) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                    <span className="text-sm font-semibold">{item.rate}%</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary transition-all"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pipeline Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineData.map((stage) => (
                <div
                  key={stage.stage}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {stage.stage.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{stage.count}</p>
                    <p className="text-xs text-muted-foreground">
                      {totalApplications > 0
                        ? Math.round((stage.count / totalApplications) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {topJobsList.length > 0 ? (
            <div className="space-y-3">
              {topJobsList.map((job, index) => (
                <div
                  key={job.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {job.department ?? "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{job.applicationCount}</p>
                    <p className="text-xs text-muted-foreground">Applications</p>
                  </div>
                  <Badge variant={job.status === "OPEN" ? "success" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No job data available yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Interview-to-Offer Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {interviewCount > 0
                ? Math.round((offerCount / interviewCount) * 100)
                : 0}
              %
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary"
                style={{
                  width: `${interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {offerCount} offers from {interviewCount} interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{overview?.totalJobs ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {openJobs} open • {(overview?.totalJobs ?? 0) - openJobs} closed/draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rejection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {totalApplications > 0
                ? Math.round(((stageCountMap.get("REJECTED") ?? 0) / totalApplications) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {stageCountMap.get("REJECTED") ?? 0} rejected out of{" "}
              {totalApplications} applications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
