"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { mockJobs, mockCandidates } from "@/lib/mock-data";
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

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const job = mockJobs.find((j) => j.id === jobId);

  // Get applicants for this job with memoization
  const applicants = useMemo(() => {
    if (!job) return [];
    return mockCandidates.filter((c) => c.appliedPosition === job.title);
  }, [job]);

  if (!job) {
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
          <JobSkillsCard skills={job.requirements.skills} />
          <ApplicantsList applicants={applicants} />
        </div>

        {/* Sidebar */}
        <JobSidebar job={job} applicants={applicants} />
      </div>
    </div>
  );
}
