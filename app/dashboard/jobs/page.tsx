"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { mockJobs } from "@/lib/mock-data";
import {
  Search,
  Plus,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Briefcase,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    experience: "",
    education: "",
    skills: "",
  });

  // Filter jobs
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    ALL: mockJobs.length,
    OPEN: mockJobs.filter((j) => j.status === "OPEN").length,
    DRAFT: mockJobs.filter((j) => j.status === "DRAFT").length,
    CLOSED: mockJobs.filter((j) => j.status === "CLOSED").length,
  };

  const handleCreateJob = () => {
    // TODO: Connect to backend API
    toast.success("Job created successfully!", {
      description: `"${newJob.title}" has been added to your job postings.`,
    });
    setCreateJobOpen(false);
    setNewJob({
      title: "",
      description: "",
      location: "",
      salaryRange: "",
      experience: "",
      education: "",
      skills: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your open positions and recruitment campaigns
          </p>
        </div>
        <Dialog open={createJobOpen} onOpenChange={setCreateJobOpen}>
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
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
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
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({ ...newJob, location: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. $100k - $150k"
                    value={newJob.salaryRange}
                    onChange={(e) =>
                      setNewJob({ ...newJob, salaryRange: e.target.value })
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
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
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
                    value={newJob.experience}
                    onChange={(e) =>
                      setNewJob({ ...newJob, experience: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="e.g. Bachelor's degree"
                    value={newJob.education}
                    onChange={(e) =>
                      setNewJob({ ...newJob, education: e.target.value })
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
                  value={newJob.skills}
                  onChange={(e) =>
                    setNewJob({ ...newJob, skills: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple skills with commas
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateJobOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateJob}
                disabled={
                  !newJob.title ||
                  !newJob.description ||
                  !newJob.location ||
                  !newJob.experience ||
                  !newJob.skills
                }
              >
                Create Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(["ALL", "OPEN", "DRAFT", "CLOSED"] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status} ({statusCounts[status]})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover-lift group cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge
                    variant={
                      job.status === "OPEN"
                        ? "success"
                        : job.status === "DRAFT"
                          ? "secondary"
                          : "outline"
                    }
                    className="mb-2"
                  >
                    {job.status}
                  </Badge>
                  <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                    {job.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Job Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salaryRange && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{job.applicationCount} applications</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.requirements.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.requirements.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.requirements.skills.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/dashboard/jobs/${job.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No jobs found</p>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Create your first job posting to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setCreateJobOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Job
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
