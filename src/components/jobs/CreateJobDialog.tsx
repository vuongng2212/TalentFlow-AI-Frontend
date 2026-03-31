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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { NewJobForm } from "./types";
import type { EmploymentType, JobStatus } from "@/types";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NewJobForm;
  onFormChange: (data: NewJobForm) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  hideTrigger?: boolean;
}

export function CreateJobDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting = false,
  mode = "create",
  hideTrigger = false,
}: CreateJobDialogProps) {
  const isFormValid = formData.title.trim().length > 0;
  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Job
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Job" : "Create New Job"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the job posting details. Click save when you\u0027re done."
              : "Fill in the details for your new job posting. Click save when you\u0027re done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Job Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Frontend Developer"
              value={formData.title}
              onChange={(e) =>
                onFormChange({ ...formData, title: e.target.value })
              }
              autoComplete="off"
              maxLength={200}
            />
          </div>

          {/* Department & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Engineering"
                value={formData.department}
                onChange={(e) =>
                  onFormChange({ ...formData, department: e.target.value })
                }
                autoComplete="off"
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Remote, Ho Chi Minh City"
                value={formData.location}
                onChange={(e) =>
                  onFormChange({ ...formData, location: e.target.value })
                }
                autoComplete="off"
                maxLength={100}
              />
            </div>
          </div>

          {/* Employment Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Employment Type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) =>
                  onFormChange({
                    ...formData,
                    employmentType: value as EmploymentType,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  onFormChange({ ...formData, status: value as JobStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="salaryMin">Salary Min ($)</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="e.g., 2000"
                value={formData.salaryMin}
                onChange={(e) =>
                  onFormChange({ ...formData, salaryMin: e.target.value })
                }
                min={0}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salaryMax">Salary Max ($)</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="e.g., 4000"
                value={formData.salaryMax}
                onChange={(e) =>
                  onFormChange({ ...formData, salaryMax: e.target.value })
                }
                min={0}
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={4}
              value={formData.description}
              onChange={(e) =>
                onFormChange({ ...formData, description: e.target.value })
              }
              autoComplete="off"
            />
          </div>

          {/* Skills */}
          <div className="grid gap-2">
            <Label htmlFor="skills">Required Skills</Label>
            <Input
              id="skills"
              placeholder="e.g., React, TypeScript, Node.js"
              value={formData.skills}
              onChange={(e) =>
                onFormChange({ ...formData, skills: e.target.value })
              }
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple skills with commas
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Job"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
