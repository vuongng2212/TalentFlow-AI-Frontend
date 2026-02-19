"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockCandidates, mockJobs } from "@/lib/mock-data";
import { Plus, Video, MapPin } from "lucide-react";
import { NewInterviewForm } from "./types";

interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NewInterviewForm;
  onFormChange: (data: NewInterviewForm) => void;
  onSubmit: () => void;
}

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: ScheduleInterviewDialogProps) {
  const isFormValid =
    formData.candidateId &&
    formData.jobId &&
    formData.date &&
    formData.time &&
    formData.interviewer &&
    (formData.type !== "ONSITE" || formData.location);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Set up a new interview with a candidate. Fill in all required
            details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Candidate Selection */}
          <div className="grid gap-2">
            <Label htmlFor="candidate">Candidate *</Label>
            <select
              id="candidate"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={formData.candidateId}
              onChange={(e) =>
                onFormChange({ ...formData, candidateId: e.target.value })
              }
            >
              <option value="">Select a candidate...</option>
              {mockCandidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.fullName} - {candidate.appliedPosition}
                </option>
              ))}
            </select>
          </div>

          {/* Job Position */}
          <div className="grid gap-2">
            <Label htmlFor="job">Job Position *</Label>
            <select
              id="job"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={formData.jobId}
              onChange={(e) =>
                onFormChange({ ...formData, jobId: e.target.value })
              }
            >
              <option value="">Select a job...</option>
              {mockJobs
                .filter((job) => job.status === "OPEN")
                .map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  onFormChange({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  onFormChange({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          {/* Duration & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <select
                id="duration"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={formData.duration}
                onChange={(e) =>
                  onFormChange({ ...formData, duration: e.target.value })
                }
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Interview Type *</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={formData.type}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    type: e.target.value as "VIDEO" | "ONSITE",
                  })
                }
              >
                <option value="VIDEO">Video Call</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>
          </div>

          {/* Interviewer */}
          <div className="grid gap-2">
            <Label htmlFor="interviewer">Interviewer *</Label>
            <Input
              id="interviewer"
              placeholder="e.g. Jane Recruiter"
              value={formData.interviewer}
              onChange={(e) =>
                onFormChange({ ...formData, interviewer: e.target.value })
              }
            />
          </div>

          {/* Conditional: Video Link or Location */}
          {formData.type === "VIDEO" ? (
            <div className="grid gap-2">
              <Label htmlFor="meetingLink">
                <Video className="h-4 w-4 inline mr-1" />
                Meeting Link
              </Label>
              <Input
                id="meetingLink"
                type="url"
                placeholder="https://meet.google.com/..."
                value={formData.meetingLink}
                onChange={(e) =>
                  onFormChange({ ...formData, meetingLink: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="location">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location *
              </Label>
              <Input
                id="location"
                placeholder="e.g. Office - Conference Room A"
                value={formData.location}
                onChange={(e) =>
                  onFormChange({ ...formData, location: e.target.value })
                }
              />
            </div>
          )}

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or instructions..."
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                onFormChange({ ...formData, notes: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!isFormValid}>
            Schedule Interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
