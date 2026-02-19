"use client";

import { useState, useMemo, useCallback } from "react";
import { mockJobs } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  CreateJobDialog,
  JobFilters,
  JobCard,
  EmptyJobsState,
  initialNewJobState,
  NewJobForm,
  JobStatusFilter,
} from "@/components/jobs";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("ALL");
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [newJob, setNewJob] = useState<NewJobForm>(initialNewJobState);

  // Filter jobs with memoization
  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate status counts
  const statusCounts = useMemo(() => ({
    ALL: mockJobs.length,
    OPEN: mockJobs.filter((j) => j.status === "OPEN").length,
    DRAFT: mockJobs.filter((j) => j.status === "DRAFT").length,
    CLOSED: mockJobs.filter((j) => j.status === "CLOSED").length,
  }), []);

  // Stable callbacks
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleStatusChange = useCallback((status: JobStatusFilter) => {
    setStatusFilter(status);
  }, []);

  const handleFormChange = useCallback((data: NewJobForm) => {
    setNewJob(data);
  }, []);

  const handleCreateJob = useCallback(() => {
    toast.success("Job created successfully!", {
      description: `"${newJob.title}" has been added to your job postings.`,
    });
    setCreateJobOpen(false);
    setNewJob(initialNewJobState);
  }, [newJob.title]);

  const handleOpenCreate = useCallback(() => {
    setCreateJobOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your open positions and recruitment campaigns
          </p>
        </div>
        <CreateJobDialog
          open={createJobOpen}
          onOpenChange={setCreateJobOpen}
          formData={newJob}
          onFormChange={handleFormChange}
          onSubmit={handleCreateJob}
        />
      </div>

      {/* Filters */}
      <JobFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        statusCounts={statusCounts}
      />

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyJobsState
          hasSearchQuery={searchQuery !== ""}
          onCreateClick={handleOpenCreate}
        />
      )}
    </div>
  );
}
