import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types";

interface JobDescriptionCardProps {
  description: string;
}

export function JobDescriptionCard({ description }: JobDescriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none dark:prose-invert">
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}

interface JobRequirementsCardProps {
  requirements: Job["requirements"];
}

export function JobRequirementsCard({ requirements }: JobRequirementsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span className="text-sm">
              <strong>Experience:</strong> {requirements.experience}
            </span>
          </li>
          {requirements.education ? (
            <li className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-sm">
                <strong>Education:</strong> {requirements.education}
              </span>
            </li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}

interface JobSkillsCardProps {
  skills: string[];
}

export function JobSkillsCard({ skills }: JobSkillsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
