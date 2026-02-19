import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export const JobCard = React.memo(function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover-lift group cursor-pointer">
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
          {job.salaryRange ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{job.salaryRange}</span>
            </div>
          ) : null}
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
          {job.requirements.skills.length > 3 ? (
            <Badge variant="outline" className="text-xs">
              +{job.requirements.skills.length - 3}
            </Badge>
          ) : null}
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
  );
});
