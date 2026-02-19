"use client";

import { useState, useMemo, useCallback } from "react";
import { mockCandidates } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  InterviewCard,
  InterviewStatsCards,
  InterviewFilters,
  EmptyInterviewState,
  ScheduleInterviewDialog,
  mockInterviews,
  initialNewInterviewState,
  InterviewFilter,
  NewInterviewForm,
} from "@/components/interviews";

export default function InterviewsPage() {
  const [filter, setFilter] = useState<InterviewFilter>("UPCOMING");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [newInterview, setNewInterview] = useState<NewInterviewForm>(
    initialNewInterviewState
  );

  // Memoized date calculations
  const { today, todayEnd, now } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    return { today, todayEnd, now };
  }, []);

  // Memoized counts
  const { todayCount, upcomingCount } = useMemo(() => ({
    todayCount: mockInterviews.filter(
      (i) => i.date >= today && i.date < todayEnd
    ).length,
    upcomingCount: mockInterviews.filter((i) => i.date >= now).length,
  }), [today, todayEnd, now]);

  // Filter interviews with memoization
  const filteredInterviews = useMemo(() => {
    return mockInterviews
      .filter((interview) => {
        if (filter === "TODAY") {
          return interview.date >= today && interview.date < todayEnd;
        }
        if (filter === "UPCOMING") {
          return interview.date >= now;
        }
        return true;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filter, today, todayEnd, now]);

  // Stable callback for filter change
  const handleFilterChange = useCallback((newFilter: InterviewFilter) => {
    setFilter(newFilter);
  }, []);

  // Stable callback for form changes
  const handleFormChange = useCallback((data: NewInterviewForm) => {
    setNewInterview(data);
  }, []);

  // Handle schedule submission
  const handleScheduleInterview = useCallback(() => {
    const selectedCandidate = mockCandidates.find(
      (c) => c.id === newInterview.candidateId
    );
    toast.success("Interview scheduled!", {
      description: `Interview with ${selectedCandidate?.fullName || "candidate"} on ${newInterview.date} at ${newInterview.time}.`,
    });
    setScheduleOpen(false);
    setNewInterview(initialNewInterviewState);
  }, [newInterview.candidateId, newInterview.date, newInterview.time]);

  // Stable callback for opening schedule dialog
  const handleOpenSchedule = useCallback(() => {
    setScheduleOpen(true);
  }, []);

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
        <ScheduleInterviewDialog
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          formData={newInterview}
          onFormChange={handleFormChange}
          onSubmit={handleScheduleInterview}
        />
      </div>

      {/* Stats Cards */}
      <InterviewStatsCards
        todayCount={todayCount}
        upcomingCount={upcomingCount}
      />

      {/* Filters */}
      <InterviewFilters
        filter={filter}
        onFilterChange={handleFilterChange}
        totalCount={mockInterviews.length}
        todayCount={todayCount}
        upcomingCount={upcomingCount}
      />

      {/* Interview List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredInterviews.length === 0 ? (
          <EmptyInterviewState onScheduleClick={handleOpenSchedule} />
        ) : (
          filteredInterviews.map((interview) => {
            const isToday =
              interview.date >= today && interview.date < todayEnd;
            const isPast = interview.date < now;

            return (
              <InterviewCard
                key={interview.id}
                interview={interview}
                isToday={isToday}
                isPast={isPast}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
