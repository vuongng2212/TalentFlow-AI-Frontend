"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { mockJobs, mockCandidates } from "@/lib/mock-data";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  Upload,
  Edit,
  Share2,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { AIScoreBadge } from "@/components/candidates";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const job = mockJobs.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The job you&apos;re looking for doesn&apos;t exist
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
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
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{job.title}</h1>
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
          </div>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{job.salaryRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{job.applicationCount} applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/upload">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload CV
            </Button>
          </Link>
          <Button variant="outline" className="gap-2" onClick={() => toast.info("Edit mode coming soon!")}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="icon" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!", { description: "Job link copied to clipboard." });
          }}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive" onClick={() => toast.error("Delete action", { description: "This would delete the job posting." })}>
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
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Experience:</strong> {job.requirements.experience}
                  </span>
                </li>
                {job.requirements.education && (
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">
                      <strong>Education:</strong> {job.requirements.education}
                    </span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.requirements.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
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
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No applicants yet</p>
                  <Link href="/dashboard/upload">
                    <Button variant="outline" size="sm" className="mt-4 gap-2">
                      <Upload className="h-4 w-4" />
                      Upload First CV
                    </Button>
                  </Link>
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
                        <p className="text-sm text-muted-foreground">
                          Applied {formatDate(candidate.appliedDate)}
                        </p>
                      </div>
                      {candidate.aiScore && (
                        <AIScoreBadge score={candidate.aiScore} size="sm" />
                      )}
                      <Badge variant="outline">{candidate.stage}</Badge>
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
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Applications
                </p>
                <p className="text-2xl font-bold">{job.applicationCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Active Candidates
                </p>
                <p className="text-2xl font-bold">{applicants.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Avg. AI Score
                </p>
                <p className="text-2xl font-bold">
                  {applicants.length > 0
                    ? Math.round(
                        applicants.reduce(
                          (sum, c) => sum + (c.aiScore || 0),
                          0,
                        ) / applicants.length,
                      )
                    : 0}
                  %
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hiring Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=recruiter"
                  alt="Jane Recruiter"
                  fallback="J"
                />
                <div>
                  <p className="font-medium text-sm">Jane Recruiter</p>
                  <p className="text-xs text-muted-foreground">
                    Lead Recruiter
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
                  alt="John Tech Lead"
                  fallback="J"
                />
                <div>
                  <p className="font-medium text-sm">John Tech Lead</p>
                  <p className="text-xs text-muted-foreground">
                    Hiring Manager
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/upload">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CV
                </Button>
              </Link>
              <Link href="/dashboard/candidates">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  View Candidates
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Share Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
