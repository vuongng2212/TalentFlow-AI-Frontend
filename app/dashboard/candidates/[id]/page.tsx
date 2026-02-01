"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { getMockCandidate, getMockJob } from "@/lib/mock-data";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Linkedin,
  Github,
  Globe,
  Star,
  TrendingUp,
  CheckCircle2,
  Download,
  MessageSquare,
  Video,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const candidate = getMockCandidate(candidateId);

  if (!candidate) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Candidate not found</p>
            <p className="text-sm text-muted-foreground mb-6">
              The candidate profile you're looking for doesn't exist.
            </p>
            <Link href="/dashboard/candidates">
              <Button>Back to Candidates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // AI Score breakdown (mock data)
  const aiScoreBreakdown = [
    {
      label: "Skills Match",
      score: candidate.aiScore ? candidate.aiScore - 5 : 85,
      max: 100,
    },
    {
      label: "Experience Level",
      score: candidate.aiScore ? candidate.aiScore - 3 : 89,
      max: 100,
    },
    {
      label: "Education",
      score: candidate.aiScore ? candidate.aiScore + 2 : 94,
      max: 100,
    },
    {
      label: "Culture Fit",
      score: candidate.aiScore ? candidate.aiScore - 8 : 84,
      max: 100,
    },
  ];

  // Application timeline (mock)
  const timeline = [
    {
      date: candidate.appliedDate,
      title: "Application Submitted",
      description: `Applied for ${candidate.appliedPosition}`,
      icon: CheckCircle2,
    },
    {
      date: new Date(candidate.appliedDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      title: "Resume Reviewed",
      description: "AI screening completed - High match score",
      icon: Star,
    },
  ];

  if (candidate.stage !== "APPLIED") {
    timeline.push({
      date: new Date(candidate.appliedDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      title: "Moved to Screening",
      description: "Recruiter initiated screening process",
      icon: TrendingUp,
    });
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Candidates
      </Button>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar
              src={candidate.avatar}
              alt={candidate.fullName}
              fallback={candidate.fullName.charAt(0)}
              size="lg"
              className="h-24 w-24 text-2xl"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    {candidate.fullName}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {candidate.appliedPosition}
                  </p>
                </div>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {candidate.stage}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {candidate.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${candidate.email}`}
                      className="hover:text-primary"
                    >
                      {candidate.email}
                    </a>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${candidate.phone}`}
                      className="hover:text-primary"
                    >
                      {candidate.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Applied {formatRelativeTime(candidate.appliedDate)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="default">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Score Breakdown */}
          {candidate.aiScore && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>AI Match Score</CardTitle>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">
                      {candidate.aiScore}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiScoreBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.score}/{item.max}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-purple transition-all"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-semibold mb-1">{item.title}</p>
                        <p className="text-sm text-muted-foreground mb-1">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(item.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                No notes yet. Add notes after interviewing this candidate.
              </div>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Move Candidate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value={candidate.stage}>{candidate.stage}</option>
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <Button className="w-full">Update Stage</Button>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-smooth"
              >
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Resume.pdf</p>
                  <p className="text-xs text-muted-foreground">2.4 MB</p>
                </div>
                <Download className="h-4 w-4 text-muted-foreground" />
              </a>
            </CardContent>
          </Card>

          {/* Social Links (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-smooth"
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
                <span className="text-sm">LinkedIn Profile</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-smooth"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm">GitHub Profile</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-smooth"
              >
                <Globe className="h-5 w-5 text-green-600" />
                <span className="text-sm">Portfolio Website</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
