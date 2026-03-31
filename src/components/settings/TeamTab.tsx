import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Users, Loader2 } from "lucide-react";
import { useUsers } from "@/services/users";
import { useAuthStore } from "@/store/auth-store";

export function TeamTab() {
  const { user: currentUser } = useAuthStore();
  const { data: users = [], isLoading, error } = useUsers({ limit: 50 });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex justify-center p-10 text-destructive">
          Failed to load team members.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          {currentUser?.role === "ADMIN" && (
            <Button size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-smooth"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={member.avatar}
                  alt={member.fullName}
                  fallback={member.fullName.charAt(0).toUpperCase()}
                />
                <div>
                  <p className="font-medium">
                    {member.fullName}
                    {member.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{member.role}</Badge>
                {currentUser?.role === "ADMIN" && (
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
