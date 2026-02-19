"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/lib/mock-data";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import {
  UploadSuccessState,
  FileDropZone,
  JobSelector,
  UploadInfoSidebar,
} from "@/components/upload";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function UploadCVPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
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

    setUploading(true);

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUploading(false);
    setUploadSuccess(true);

    toast.success("Upload successful!", {
      description: `${files.length} CV${files.length > 1 ? "s" : ""} uploaded and processing...`,
    });

    // Reset and redirect after 2 seconds
    setTimeout(() => {
      router.push("/dashboard/candidates");
    }, 2000);
  }, [files.length, selectedJob, router]);

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
            jobs={mockJobs}
          />

          {/* Upload Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || !selectedJob || uploading}
              className="gap-2"
            >
              {uploading ? (
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
