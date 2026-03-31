import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Users, Calendar, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

export const JobCard = React.memo(function JobCard({
  job,
  onEdit,
  onDelete,
}: JobCardProps) {
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
          {job.salaryMin || job.salaryMax ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>
                {job.salaryMin && job.salaryMax
                  ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
                  : job.salaryMin
                    ? `From $${job.salaryMin.toLocaleString()}`
                    : `Up to $${job.salaryMax!.toLocaleString()}`}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{job._count?.applications ?? 0} applications</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {(
            ((job.requirements as Record<string, unknown>)
              ?.skills as string[]) ?? []
          )
            .slice(0, 3)
            .map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          {(
            ((job.requirements as Record<string, unknown>)
              ?.skills as string[]) ?? []
          ).length > 3 ? (
            <Badge variant="outline" className="text-xs">
              +
              {(
                ((job.requirements as Record<string, unknown>)
                  ?.skills as string[]) ?? []
              ).length - 3}
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
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(job)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete?.(job)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
