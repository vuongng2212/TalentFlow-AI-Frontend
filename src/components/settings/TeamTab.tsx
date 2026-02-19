import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { TeamMember, mockTeamMembers } from "./types";

interface TeamTabProps {
  members?: TeamMember[];
}

export function TeamTab({ members = mockTeamMembers }: TeamTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-smooth"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  fallback={member.name.charAt(0)}
                />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{member.role}</Badge>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
