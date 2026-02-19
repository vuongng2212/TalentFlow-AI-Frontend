"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockJobs, mockCandidates } from "@/lib/mock-data";
import { Briefcase, Users, Calendar, TrendingUp } from "lucide-react";
import { WelcomeBanner } from "@/components/shared/WelcomeBanner";
import { AIScoreBadge } from "@/components/candidates";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const { user } = useAuthStore();
  // Calculate stats
  const openJobs = mockJobs.filter((job) => job.status === "OPEN").length;
  const totalApplications = mockJobs.reduce(
    (sum, job) => sum + job.applicationCount,
    0,
  );
  const activeCandidates = mockCandidates.filter(
    (c) => c.stage !== "HIRED" && c.stage !== "REJECTED",
  ).length;
  const upcomingInterviews = mockCandidates.filter(
    (c) => c.stage === "INTERVIEW",
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
          <div className="space-y-4">
            {mockJobs.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-smooth"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {job.location} • {job.salaryRange}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {job.applicationCount} applications
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
          </div>
        </CardContent>
      </Card>

      {/* Recent Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCandidates.slice(0, 5).map((candidate) => (
              <Link
                key={candidate.id}
                href={`/dashboard/candidates/${candidate.id}`}
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
                      Applied{" "}
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{candidate.stage}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
