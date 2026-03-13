"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  CreateJobDialog,
  DeleteJobDialog,
  JobFilters,
  JobCard,
  EmptyJobsState,
  initialNewJobState,
  jobToForm,
  NewJobForm,
  JobStatusFilter,
} from "@/components/jobs";
import { useJobs, useCreateJob, useUpdateJob } from "@/services/jobs";
import type { CreateJobRequest, UpdateJobRequest } from "@/lib/api/types";
import type { Job } from "@/types";
import { Loader2 } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const { data: jobs = [], pagination, isLoading, isValidating, error, mutate } = useJobs({ page, limit: 12 });
  const { trigger: createJob, isMutating: isCreating } = useCreateJob();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("ALL");
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [newJob, setNewJob] = useState<NewJobForm>(initialNewJobState);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<NewJobForm>(initialNewJobState);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const { trigger: updateJob, isMutating: isUpdating } = useUpdateJob(editingJobId ?? "");

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);

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
  }, [jobs, searchQuery, statusFilter]);

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
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((status: JobStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const handleFormChange = useCallback((data: NewJobForm) => {
    setNewJob(data);
  }, []);

  const handleCreateJob = useCallback(async () => {
    const skills = newJob.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreateJobRequest = {
      title: newJob.title,
      description: newJob.description || undefined,
      department: newJob.department || undefined,
      location: newJob.location || undefined,
      employmentType: newJob.employmentType,
      salaryMin: newJob.salaryMin ? Number(newJob.salaryMin) : undefined,
      salaryMax: newJob.salaryMax ? Number(newJob.salaryMax) : undefined,
      status: newJob.status,
      requirements: skills.length > 0 ? skills : undefined,
    };

    try {
      await createJob(payload);
      toast.success("Job created successfully!", {
        description: `"${newJob.title}" has been added to your job postings.`,
      });
      setCreateJobOpen(false);
      setNewJob(initialNewJobState);
      mutate();
    } catch {
      toast.error("Failed to create job", {
        description: "Please check your input and try again.",
      });
    }
  }, [newJob, createJob, mutate]);

  const handleOpenCreate = useCallback(() => {
    setCreateJobOpen(true);
  }, []);

  const handleEditFromCard = useCallback((job: Job) => {
    setEditingJobId(job.id);
    setEditForm(jobToForm(job));
    setEditOpen(true);
  }, []);

  const handleDeleteFromCard = useCallback((job: Job) => {
    setDeletingJob(job);
    setDeleteOpen(true);
  }, []);

  const handleDeleted = useCallback(() => {
    setDeletingJob(null);
    mutate();
  }, [mutate]);

  const handleEditSubmit = useCallback(async () => {
    const skills = editForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: UpdateJobRequest = {
      title: editForm.title,
      description: editForm.description || undefined,
      department: editForm.department || undefined,
      location: editForm.location || undefined,
      employmentType: editForm.employmentType,
      salaryMin: editForm.salaryMin ? Number(editForm.salaryMin) : undefined,
      salaryMax: editForm.salaryMax ? Number(editForm.salaryMax) : undefined,
      status: editForm.status,
      requirements: skills.length > 0 ? skills : undefined,
    };

    try {
      await updateJob(payload);
      toast.success("Job updated!", {
        description: `"${editForm.title}" has been saved.`,
      });
      setEditOpen(false);
      setEditingJobId(null);
      mutate();
    } catch {
      toast.error("Failed to update job", {
        description: "Please check your input and try again.",
      });
    }
  }, [editForm, updateJob, mutate]);

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
          isSubmitting={isCreating}
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
            <JobCard key={job.id} job={job} onEdit={handleEditFromCard} onDelete={handleDeleteFromCard} />
          ))}
        </div>
      ) : (
        <EmptyJobsState
          hasSearchQuery={searchQuery !== ""}
          onCreateClick={handleOpenCreate}
        />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {jobs.length} of {pagination.total} jobs
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            disabled={isValidating}
          />
        </div>
      )}

      {/* Edit Job Dialog */}
      <CreateJobDialog
        mode="edit"
        hideTrigger
        open={editOpen}
        onOpenChange={setEditOpen}
        formData={editForm}
        onFormChange={setEditForm}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      {/* Delete Job Dialog */}
      {deletingJob && (
        <DeleteJobDialog
          jobId={deletingJob.id}
          jobTitle={deletingJob.title}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
