"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { WelcomeBanner } from "@/components/shared/WelcomeBanner";
import { AIScoreBadge } from "@/components/candidates";
import { useAuthStore } from "@/store/auth-store";
import { useJobs } from "@/services/jobs";
import { useApplications } from "@/services/applications";
import { mapApplicationToViewModel } from "@/lib/mappers";

function formatSalary(min: number | null, max: number | null): string {
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  if (max) return `Up to $${max.toLocaleString()}`;
  return "Not specified";
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: jobs = [], isLoading: isJobsLoading } = useJobs();
  const { data: applications = [], isLoading: isAppsLoading } = useApplications({
    sortBy: "appliedAt",
    sortOrder: "desc",
    limit: 10,
  });

  const recentCandidates = useMemo(
    () => applications.map(mapApplicationToViewModel),
    [applications],
  );

  // Calculate stats from real API data
  const openJobs = jobs.filter((job) => job.status === "OPEN").length;
  const totalApplications = jobs.reduce(
    (sum, job) => sum + (job._count?.applications ?? 0),
    0,
  );
  const activeCandidates = applications.filter(
    (a) => a.stage !== "HIRED" && a.stage !== "REJECTED",
  ).length;
  const upcomingInterviews = applications.filter(
    (a) => a.stage === "INTERVIEW",
  ).length;

  const stats = [
    {
      title: "Open Positions",
      value: openJobs,
      icon: Briefcase,
      trend: "+2 this week",
      color: "text-primary",
    },
    {
      title: "Total Applications",
      value: totalApplications,
      icon: Users,
      trend: "+12 this week",
      color: "text-blue-500",
    },
    {
      title: "Active Candidates",
      value: activeCandidates,
      icon: TrendingUp,
      trend: "+5 this week",
      color: "text-green-500",
    },
    {
      title: "Interviews Scheduled",
      value: upcomingInterviews,
      icon: Calendar,
      trend: "3 this week",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your recruitment pipeline.
        </p>
      </div>

      {/* Welcome Banner */}
      <WelcomeBanner userName={user?.fullName} />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          {isJobsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {job.location} &bull; {formatSalary(job.salaryMin, job.salaryMax)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {job._count?.applications ?? 0} applications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={job.status === "OPEN" ? "success" : "secondary"}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </Link>
              ))}
              {jobs.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No job postings yet. Create your first job to get started.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          {isAppsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {recentCandidates.slice(0, 5).map((candidate) => (
                <Link
                  key={candidate._applicationId}
                  href={`/dashboard/candidates/${candidate._applicationId}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {candidate.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{candidate.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {candidate.appliedPosition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {candidate.aiScore && (
                      <AIScoreBadge score={candidate.aiScore} size="sm" />
                    )}
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {candidate.appliedDate
                          ? `Applied ${new Date(candidate.appliedDate).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                    {candidate.stage && <Badge>{candidate.stage}</Badge>}
                  </div>
                </Link>
              ))}
              {recentCandidates.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No applications yet. Upload CVs to get started.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
