import { useState, useEffect } from "react";
import { CrudDialog } from "@/components/shared/crud-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateApplication, useUpdateApplication } from "@/services/applications";
import type { Application, ApplicationStage, ApplicationStatus } from "@/types";

interface ApplicationCrudDialogProps {
  application?: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ApplicationCrudDialog({
  application,
  open,
  onOpenChange,
  onSuccess,
}: ApplicationCrudDialogProps) {
  const isEditing = !!application;
  const [formData, setFormData] = useState({
    jobId: "",
    coverLetter: "",
    stage: "APPLIED" as ApplicationStage,
    status: "ACTIVE" as ApplicationStatus,
    notes: "",
  });

  const createApplication = useCreateApplication();
  const updateApplication = useUpdateApplication(application?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && application) {
      setFormData({
        jobId: application.jobId,
        coverLetter: application.coverLetter || "",
        stage: application.stage,
        status: application.status,
        notes: application.notes || "",
      });
    } else if (open) {
      setFormData({
        jobId: "",
        coverLetter: "",
        stage: "APPLIED",
        status: "ACTIVE",
        notes: "",
      });
    }
  }, [open, application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing) {
        await updateApplication.trigger({
            stage: formData.stage,
            status: formData.status,
            notes: formData.notes,
            coverLetter: formData.coverLetter
        });
      } else {
        await createApplication.trigger({
            jobId: formData.jobId,
            coverLetter: formData.coverLetter
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CrudDialog
      title={isEditing ? "Edit Application" : "Add Application"}
      description={
        isEditing
          ? "Update the application details below."
          : "Fill in the details to add a new application."
      }
      open={open}
      onOpenChange={onOpenChange}
    >
      <form id="application-form" onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="jobId">Job ID</Label>
              <Input
                id="jobId"
                required
                value={formData.jobId}
                onChange={(e) =>
                  setFormData({ ...formData, jobId: e.target.value })
                }
                placeholder="e.g. job-123"
                autoFocus
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              placeholder="Cover letter content"
              rows={5}
            />
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) =>
                    setFormData({ ...formData, stage: value as ApplicationStage })
                  }
                >
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPLIED">Applied</SelectItem>
                    <SelectItem value="SCREENING">Screening</SelectItem>
                    <SelectItem value="INTERVIEW">Interview</SelectItem>
                    <SelectItem value="OFFER">Offer</SelectItem>
                    <SelectItem value="HIRED">Hired</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as ApplicationStatus })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {isEditing && (
              <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Application notes"
                      rows={3}
                  />
              </div>
          )}
        </div>

        {/* Form Actions Footer */}
        <div className="mt-4 -mx-6 -mb-4 px-6 py-4 bg-muted/30 border-t flex justify-end gap-2 sticky bottom-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Application"}
          </Button>
        </div>
      </form>
    </CrudDialog>
  );
}