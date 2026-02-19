import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Upload,
  Edit,
  Share2,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Job } from "@/types";

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!", { description: "Job link copied to clipboard." });
  };

  const handleEdit = () => {
    toast.info("Edit mode coming soon!");
  };

  const handleDelete = () => {
    toast.error("Delete action", {
      description: "This would delete the job posting.",
    });
  };

  return (
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
        <Button variant="outline" className="gap-2" onClick={handleEdit}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
