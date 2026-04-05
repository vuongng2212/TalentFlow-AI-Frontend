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
import { useCreateInterview, useUpdateInterview } from "@/services/interviews";
import { useApplications } from "@/services/applications";
import type {
  Interview,
  InterviewType,
  InterviewStatus,
  Application,
} from "@/types";

interface InterviewCrudDialogProps {
  interview?: Interview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InterviewCrudDialog({
  interview,
  open,
  onOpenChange,
  onSuccess,
}: InterviewCrudDialogProps) {
  const isEditing = !!interview;
  const [formData, setFormData] = useState({
    applicationId: "",
    scheduledAt: "",
    duration: 60,
    type: "VIDEO" as InterviewType,
    location: "",
    notes: "",
    status: "SCHEDULED" as InterviewStatus,
  });

  const createInterview = useCreateInterview();
  const updateInterview = useUpdateInterview(interview?.id || "");
  const { data: applicationsRes, isLoading: isLoadingApps } = useApplications();
  const applicationsList =
    (applicationsRes as { data?: Application[] })?.data ||
    (Array.isArray(applicationsRes) ? (applicationsRes as Application[]) : []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && interview) {
      const date = new Date(interview.scheduledAt);
      // Format to YYYY-MM-DDThh:mm
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16);

      setFormData({
        applicationId: interview.applicationId,
        scheduledAt: formattedDate,
        duration: interview.duration || 60,
        type: interview.type,
        location: interview.location || "",
        notes: interview.notes || "",
        status: interview.status,
      });
    } else if (open) {
      setFormData({
        applicationId: "",
        scheduledAt: "",
        duration: 60,
        type: "VIDEO",
        location: "",
        notes: "",
        status: "SCHEDULED",
      });
    }
  }, [open, interview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
      };

      if (isEditing) {
        // Exclude applicationId which is not allowed in UpdateInterviewDto
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { applicationId, ...updatePayload } = payload;
        await updateInterview.trigger(updatePayload);
      } else {
        // For creation, we don't need the status field (backend sets it to SCHEDULED by default)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, ...createPayload } = payload;
        await createInterview.trigger(createPayload);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save interview");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CrudDialog
      title={isEditing ? "Edit Interview" : "Schedule Interview"}
      description={
        isEditing
          ? "Update the interview details below."
          : "Fill in the details to schedule a new interview."
      }
      open={open}
      onOpenChange={onOpenChange}
    >
      <form
        id="interview-form"
        onSubmit={handleSubmit}
        className="flex flex-col h-full"
      >
        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="applicationId">Application / Candidate</Label>
              <Select
                value={formData.applicationId}
                onValueChange={(value) =>
                  setFormData({ ...formData, applicationId: value })
                }
              >
                <SelectTrigger id="applicationId" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingApps
                        ? "Loading applications..."
                        : "Select an application to interview"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {applicationsList?.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.candidateId} — {app.job?.title || app.jobId}
                    </SelectItem>
                  ))}
                  {(!applicationsList || applicationsList.length === 0) &&
                    !isLoadingApps && (
                      <SelectItem value="" disabled>
                        No applications available
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Date & Time</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                required
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                required
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as InterviewType })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="PHONE">Phone</SelectItem>
                  <SelectItem value="IN_PERSON">In Person</SelectItem>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="PANEL">Panel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as InterviewStatus,
                    })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location / Link</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Zoom link or physical address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Interview instructions or notes"
              rows={3}
            />
          </div>
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
            {isSubmitting ? "Saving..." : "Save Interview"}
          </Button>
        </div>
      </form>
    </CrudDialog>
  );
}
