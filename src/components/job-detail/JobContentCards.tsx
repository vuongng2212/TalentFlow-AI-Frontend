import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types";

interface JobDescriptionCardProps {
  description: string | null;
}

export function JobDescriptionCard({ description }: JobDescriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none dark:prose-invert">
        <p>{description || "No description available."}</p>
      </CardContent>
    </Card>
  );
}

interface JobRequirementsCardProps {
  requirements: Job["requirements"];
}

export function JobRequirementsCard({
  requirements,
}: JobRequirementsCardProps) {
  if (!requirements) {
    return null;
  }

  // Backend returns requirements as string[] (from JSONB column).
  // Legacy format may be Record<string, unknown> with experience/education keys.
  const items: string[] = Array.isArray(requirements)
    ? requirements
    : typeof requirements === "object"
      ? [
          requirements.experience
            ? `Experience: ${String(requirements.experience)}`
            : "",
          requirements.education
            ? `Education: ${String(requirements.education)}`
            : "",
          ...((requirements.skills as string[]) ?? []),
        ].filter(Boolean)
      : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-sm">{item}</span>
            </li>
          ))}
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
