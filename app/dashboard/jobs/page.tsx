"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Job
        </Button>
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
              <Button>
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
