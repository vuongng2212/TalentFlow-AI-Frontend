"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { getMockJob, mockCandidates } from "@/lib/mock-data";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  Clock,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const job = getMockJob(jobId);

  if (!job) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Job not found</p>
            <p className="text-sm text-muted-foreground mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/dashboard/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get applicants for this job
  const applicants = mockCandidates.filter(
    (c) => c.appliedPosition === job.title,
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant={
                job.status === "OPEN"
                  ? "success"
                  : job.status === "DRAFT"
                    ? "secondary"
                    : "outline"
              }
            >
              {job.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Posted {formatDate(job.createdAt)}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            {job.salaryRange && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{job.salaryRange}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{job.applicationCount} applications</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Experience</h4>
                <p className="text-sm text-muted-foreground">
                  {job.requirements.experience}
                </p>
              </div>
              {job.requirements.education && (
                <div>
                  <h4 className="font-semibold mb-2">Education</h4>
                  <p className="text-sm text-muted-foreground">
                    {job.requirements.education}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applicants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Applicants ({applicants.length})</CardTitle>
                <Link href="/dashboard/candidates">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {applicants.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No applicants yet
                </div>
              ) : (
                <div className="space-y-3">
                  {applicants.slice(0, 5).map((candidate) => (
                    <Link
                      key={candidate.id}
                      href={`/dashboard/candidates/${candidate.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
                    >
                      <Avatar
                        src={candidate.avatar}
                        alt={candidate.fullName}
                        fallback={candidate.fullName.charAt(0)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {candidate.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {candidate.email}
                        </p>
                      </div>
                      <div className="text-right">
                        {candidate.aiScore && (
                          <div className="text-sm font-medium mb-1">
                            {candidate.aiScore}% match
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {candidate.stage}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Applications</span>
                </div>
                <span className="font-semibold">{job.applicationCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Posted</span>
                </div>
                <span className="text-sm">{formatDate(job.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Last Updated</span>
                </div>
                <span className="text-sm">{formatDate(job.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Posted By */}
          <Card>
            <CardHeader>
              <CardTitle>Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar
                  src={job.createdBy.avatar}
                  alt={job.createdBy.fullName}
                  fallback={job.createdBy.fullName.charAt(0)}
                  size="lg"
                />
                <div>
                  <p className="font-medium">{job.createdBy.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.createdBy.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default">
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Job
              </Button>
              {job.status === "OPEN" && (
                <Button className="w-full" variant="outline">
                  Close Applications
                </Button>
              )}
              {job.status === "DRAFT" && (
                <Button className="w-full" variant="default">
                  Publish Job
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
