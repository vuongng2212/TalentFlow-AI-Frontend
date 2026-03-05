"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  JobNotFound,
  JobHeader,
  JobDescriptionCard,
  JobRequirementsCard,
  JobSkillsCard,
  ApplicantsList,
  JobSidebar,
} from "@/components/job-detail";
import { useJob } from "@/services/jobs";
import { useApplications } from "@/services/applications";
import { Loader2 } from "lucide-react";
import { Candidate } from "@/types";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: job, isLoading: isJobLoading, error: jobError } = useJob(jobId);
  const { data: applications = [], isLoading: isAppsLoading } = useApplications({ jobId });

  // Map applications to Candidate-like objects for the existing UI components
  const applicants = useMemo(() => {
    return applications.map(app => {
      if (!app.candidate) return null;
      return {
        ...app.candidate,
        stage: app.stage,
        appliedDate: app.appliedAt,
        appliedPosition: job?.title || "",
      } as Candidate;
    }).filter(Boolean) as Candidate[];
  }, [applications, job]);

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
      <JobHeader job={job} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <JobDescriptionCard description={job.description} />
          <JobRequirementsCard requirements={job.requirements} />
          <JobSkillsCard skills={(job.requirements as Record<string, unknown>)?.skills as string[] ?? []} />
          <ApplicantsList applicants={applicants} />
        </div>

        {/* Sidebar */}
        <JobSidebar job={job} applicants={applicants} />
      </div>
    </div>
  );
}
