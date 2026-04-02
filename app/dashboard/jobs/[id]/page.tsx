"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  JobNotFound,
  JobHeader,
  JobDescriptionCard,
  JobRequirementsCard,
  JobSkillsCard,
  ApplicantsList,
  JobSidebar,
} from "@/components/job-detail";
import {
  CreateJobDialog,
  jobToForm,
  initialNewJobState,
} from "@/components/jobs";
import dynamic from "next/dynamic";
import type { NewJobForm } from "@/components/jobs";

const DeleteJobDialog = dynamic(
  () =>
    import("@/components/jobs/DeleteJobDialog").then(
      (mod) => mod.DeleteJobDialog,
    ),
  { ssr: false },
);
import { useJob, useUpdateJob } from "@/services/jobs";
import { useApplications } from "@/services/applications";
import type { UpdateJobRequest } from "@/lib/api/types";
import type { CandidateViewModel } from "@/types";
import { toast } from "sonner";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const {
    data: job,
    isLoading: isJobLoading,
    error: jobError,
    mutate,
  } = useJob(jobId);
  const { data: applications = [], isLoading: isAppsLoading } = useApplications(
    { jobId },
  );
  const { trigger: updateJob, isMutating: isUpdating } = useUpdateJob(jobId);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<NewJobForm>(initialNewJobState);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Map applications to CandidateViewModel for existing UI components
  const applicants = useMemo(() => {
    return applications
      .map((app) => {
        if (!app.candidate) return null;
        return {
          ...app.candidate,
          _applicationId: app.id,
          stage: app.stage,
          appliedDate: app.appliedAt,
          appliedPosition: job?.title || "",
        } as CandidateViewModel;
      })
      .filter(Boolean) as CandidateViewModel[];
  }, [applications, job]);

  const handleEditOpen = useCallback(() => {
    if (job) {
      setEditForm(jobToForm(job));
      setEditOpen(true);
    }
  }, [job]);

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
      mutate();
    } catch {
      toast.error("Failed to update job", {
        description: "Please check your input and try again.",
      });
    }
  }, [editForm, updateJob, mutate]);

  const isLoading = isJobLoading || isAppsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (jobError || !job) {
    return <JobNotFound onBack={() => router.back()} />;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>

      {/* Header */}
      <JobHeader
        job={job}
        onEdit={handleEditOpen}
        onDelete={() => setDeleteOpen(true)}
      />

      {/* Edit Dialog */}
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

      {/* Delete Dialog */}
      <DeleteJobDialog
        jobId={jobId}
        jobTitle={job.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push("/dashboard/jobs")}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <JobDescriptionCard description={job.description} />
          <JobRequirementsCard requirements={job.requirements} />
          <JobSkillsCard
            skills={
              Array.isArray(job.requirements)
                ? [] // requirements are already shown as list items above
                : (((job.requirements as Record<string, unknown>)
                    ?.skills as string[]) ?? [])
            }
          />
          <ApplicantsList applicants={applicants} />
        </div>

        {/* Sidebar */}
        <JobSidebar job={job} applicants={applicants} />
      </div>
    </div>
  );
}
