"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import {
  UploadSuccessState,
  FileDropZone,
  JobSelector,
  UploadInfoSidebar,
} from "@/components/upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useJobs } from "@/services/jobs";
import { useUploadCV } from "@/services/applications";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function UploadCVPage() {
  const router = useRouter();
  const { data: jobs = [], isLoading: isJobsLoading } = useJobs({ status: "OPEN" });
  const { trigger: uploadCV, isMutating: isUploading } = useUploadCV();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      ACCEPTED_FILE_TYPES.includes(file.type)
    );

    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleJobChange = useCallback((jobId: string) => {
    setSelectedJob(jobId);
  }, []);

  const handleUpload = useCallback(async () => {
    if (files.length === 0 || !selectedJob) {
      toast.error("Missing required information", {
        description:
          "Please select at least one CV and choose a job position.",
      });
      return;
    }

    try {
      for (const file of files) {
        await uploadCV({ file, jobId: selectedJob, coverLetter: coverLetter || undefined });
      }

      setUploadSuccess(true);
      toast.success("Upload successful!", {
        description: `${files.length} CV${files.length > 1 ? "s" : ""} uploaded and processing...`,
      });

      setTimeout(() => {
        router.push("/dashboard/candidates");
      }, 2000);
    } catch {
      toast.error("Upload failed", {
        description: "Please check your file and try again.",
      });
    }
  }, [files, selectedJob, coverLetter, uploadCV, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  if (uploadSuccess) {
    return <UploadSuccessState fileCount={files.length} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Upload CV</h1>
        <p className="text-muted-foreground mt-1">
          Upload candidate resumes for AI-powered screening and matching
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag & Drop Zone */}
          <FileDropZone
            isDragging={isDragging}
            files={files}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
          />

          {/* Job Selection */}
          <JobSelector
            selectedJob={selectedJob}
            onJobChange={handleJobChange}
            jobs={jobs}
            isLoading={isJobsLoading}
          />

          {/* Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cover Letter (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="cover-letter" className="text-sm text-muted-foreground">
                  Add a cover letter to strengthen the application
                </Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Write a brief cover letter explaining why this candidate is a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {coverLetter.length}/2000
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || !selectedJob || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload {files.length > 0 ? `(${files.length})` : ""}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info Sidebar */}
        <UploadInfoSidebar />
      </div>
    </div>
  );
}
