"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockJobs, mockCandidates } from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Clock,
  Target,
} from "lucide-react";

export default function AnalyticsPage() {
  // Calculate metrics from mock data
  const hiredCount = mockCandidates.filter((c) => c.stage === "HIRED").length;
  const avgAIScore = Math.round(
    mockCandidates.reduce((sum, c) => sum + (c.aiScore || 0), 0) /
      mockCandidates.length,
  );

  const activeCandidates = mockCandidates.filter(
    (c) => c.stage !== "HIRED" && c.stage !== "REJECTED",
  ).length;

  const totalCandidates = mockCandidates.length;

  // Mock time-to-hire data
  const avgTimeToHire = 21; // days
  const prevTimeToHire = 28;
  const timeToHireChange = Math.round(
    ((avgTimeToHire - prevTimeToHire) / prevTimeToHire) * 100,
  );

  // Mock pipeline conversion rates
  const conversionRates = [
    { stage: "Applied → Screening", rate: 65, count: "52/80" },
    { stage: "Screening → Interview", rate: 48, count: "25/52" },
    { stage: "Interview → Offer", rate: 32, count: "8/25" },
    { stage: "Offer → Hired", rate: 88, count: "7/8" },
  ];

  const openJobs = mockJobs.filter((j) => j.status === "OPEN").length;

  // Top performing jobs
  const topJobs = mockJobs
    .filter((j) => j.status === "OPEN")
    .sort((a, b) => b.applicationCount - a.applicationCount)
    .slice(0, 5);

  // Source effectiveness (mock)
  const sources = [
    { name: "LinkedIn", candidates: 35, hired: 3, rate: 8.6 },
    { name: "Direct Apply", candidates: 28, hired: 2, rate: 7.1 },
    { name: "Referral", candidates: 12, hired: 2, rate: 16.7 },
    { name: "Job Boards", candidates: 18, hired: 1, rate: 5.6 },
  ];

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
              Avg. Time to Hire
            </CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTimeToHire} days</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500 font-medium">
                {Math.abs(timeToHireChange)}% faster
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((hiredCount / totalCandidates) * 100)}%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500 font-medium">+5%</span>
              <span className="text-xs text-muted-foreground ml-1">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. AI Match Score
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgAIScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {totalCandidates} candidates
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

        {/* Source Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>Source Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {source.candidates} candidates • {source.hired} hired
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{source.rate}%</p>
                    <p className="text-xs text-muted-foreground">
                      Success rate
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
          <div className="space-y-3">
            {topJobs.map((job, index) => (
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
                    {job.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{job.applicationCount}</p>
                  <p className="text-xs text-muted-foreground">Applications</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Interview-to-Offer Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">32%</div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary w-[32%]" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              8 offers from 25 interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avg. Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">$3,200</div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">-12%</span>
              <span className="text-xs text-muted-foreground ml-1">
                vs target
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Candidate Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">4.6/5.0</div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`h-4 w-4 rounded-sm ${
                    star <= 4.6 ? "bg-yellow-500" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on 42 survey responses
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
