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
import { Plus } from "lucide-react";
import { NewJobForm } from "./types";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NewJobForm;
  onFormChange: (data: NewJobForm) => void;
  onSubmit: () => void;
}

export function CreateJobDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: CreateJobDialogProps) {
  const isFormValid =
    formData.title &&
    formData.description &&
    formData.location &&
    formData.experience &&
    formData.skills;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Fill in the details for your new job posting. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Job Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Senior Frontend Developer"
              value={formData.title}
              onChange={(e) =>
                onFormChange({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Remote, San Francisco"
                value={formData.location}
                onChange={(e) =>
                  onFormChange({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g. $100k - $150k"
                value={formData.salaryRange}
                onChange={(e) =>
                  onFormChange({ ...formData, salaryRange: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={4}
              value={formData.description}
              onChange={(e) =>
                onFormChange({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="experience">Experience Required *</Label>
              <Input
                id="experience"
                placeholder="e.g. 3+ years"
                value={formData.experience}
                onChange={(e) =>
                  onFormChange({ ...formData, experience: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                placeholder="e.g. Bachelor's degree"
                value={formData.education}
                onChange={(e) =>
                  onFormChange({ ...formData, education: e.target.value })
                }
              />
            </div>
          </div>

          {/* Skills */}
          <div className="grid gap-2">
            <Label htmlFor="skills">Required Skills *</Label>
            <Input
              id="skills"
              placeholder="e.g. React, TypeScript, Node.js (comma-separated)"
              value={formData.skills}
              onChange={(e) =>
                onFormChange({ ...formData, skills: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple skills with commas
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!isFormValid}>
            Create Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
