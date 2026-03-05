"use client";

import { useState, useMemo, useCallback } from "react";
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
import { useJobs } from "@/services/jobs";
import { Loader2 } from "lucide-react";

export default function JobsPage() {
  const { data: jobs = [], isLoading, error } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("ALL");
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [newJob, setNewJob] = useState<NewJobForm>(initialNewJobState);

  // Filter jobs with memoization
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate status counts
  const statusCounts = useMemo(() => ({
    ALL: jobs.length,
    OPEN: jobs.filter((j) => j.status === "OPEN").length,
    DRAFT: jobs.filter((j) => j.status === "DRAFT").length,
    CLOSED: jobs.filter((j) => j.status === "CLOSED").length,
  }), [jobs]);

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
          <Loader2 className="h-8 w-8 rotate-45" />
        </div>
        <h3 className="text-xl font-semibold">Failed to load jobs</h3>
        <p className="text-muted-foreground">Please try again later or contact support.</p>
      </div>
    );
  }

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
