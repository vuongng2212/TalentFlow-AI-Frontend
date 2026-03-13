"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Users,
  Loader2,
  Plus,
} from "lucide-react";
import { useInterviews } from "@/services/interviews";
import type { Interview, InterviewStatus } from "@/types";

const STATUS_COLORS: Record<InterviewStatus, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  NO_SHOW: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  VIDEO: <Video className="h-4 w-4" />,
  PHONE: <Phone className="h-4 w-4" />,
  IN_PERSON: <MapPin className="h-4 w-4" />,
  PANEL: <Users className="h-4 w-4" />,
  TECHNICAL: <Clock className="h-4 w-4" />,
};

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

type StatusFilter = "all" | InterviewStatus;

export default function InterviewsPage() {
  const { data: interviews = [], isLoading, error } = useInterviews({ page: 1, limit: 50 });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredInterviews = useMemo(() => {
    if (statusFilter === "all") return interviews;
    return interviews.filter((i) => i.status === statusFilter);
  }, [interviews, statusFilter]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, Interview[]>();
    for (const interview of filteredInterviews) {
      const dateKey = formatDate(interview.scheduledAt);
      const existing = groups.get(dateKey) ?? [];
      groups.set(dateKey, [...existing, interview]);
    }
    return groups;
  }, [filteredInterviews]);

  // Stats
  const stats = useMemo(() => {
    const upcoming = interviews.filter(
      (i) => i.status === "SCHEDULED" || i.status === "CONFIRMED",
    ).length;
    const completed = interviews.filter((i) => i.status === "COMPLETED").length;
    const cancelled = interviews.filter((i) => i.status === "CANCELLED").length;
    return { upcoming, completed, cancelled, total: interviews.length };
  }, [interviews]);

  const handleStatusFilter = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <Calendar className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold">Failed to load interviews</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Manage and schedule candidate interviews
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map(
          (status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter(status)}
            >
              {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
            </Button>
          ),
        )}
      </div>

      {/* Interview List */}
      {filteredInterviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Interviews</h3>
            <p className="text-muted-foreground max-w-md">
              {statusFilter === "all"
                ? "No interviews scheduled yet. Schedule your first interview to get started!"
                : `No ${statusFilter.toLowerCase().replace("_", " ")} interviews found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedByDate.entries()).map(([date, dateInterviews]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {date}
              </h3>
              <div className="space-y-3">
                {dateInterviews.map((interview) => (
                  <Card key={interview.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4 py-4">
                      {/* Type Icon */}
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary shrink-0">
                        {TYPE_ICONS[interview.type] ?? <Calendar className="h-4 w-4" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">
                            {interview.application?.candidate.fullName ?? "Unknown Candidate"}
                          </h4>
                          <Badge
                            className={`text-xs ${STATUS_COLORS[interview.status]}`}
                            variant="outline"
                          >
                            {interview.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {interview.application?.job.title ?? "Unknown Job"} •{" "}
                          {interview.type.replace("_", " ")} • {interview.duration}min
                        </p>
                      </div>

                      {/* Time */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium">
                          {formatDateTime(interview.scheduledAt)}
                        </p>
                        {interview.interviewer && (
                          <p className="text-xs text-muted-foreground">
                            with {interview.interviewer.fullName}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
