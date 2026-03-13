"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Save, Camera, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateUser } from "@/services/users";

interface ProfileUser {
  id?: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface ProfileTabProps {
  user: ProfileUser | null;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const { trigger: updateUser, isMutating: isSaving } = useUpdateUser(user?.id ?? "");

  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      await updateUser({ fullName: fullName.trim() });
      toast.success("Profile updated!", {
        description: "Your profile changes have been saved.",
      });
    } catch {
      toast.error("Failed to update profile", {
        description: "Please try again later.",
      });
    }
  }, [user?.id, fullName, updateUser]);

  const handleUpdatePassword = () => {
    toast.info("Password change", {
      description: "Password change via API will be available soon.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                src={user?.avatar}
                alt={user?.fullName || "User"}
                fallback={user?.fullName?.charAt(0) || "U"}
                size="lg"
                className="h-24 w-24 text-2xl"
              />
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-smooth">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {user?.fullName || "User"}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge className="mt-2">{user?.role}</Badge>
            </div>
          </div>

          {/* Form */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                placeholder="Enter your email"
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>

          <Button
            className="gap-2"
            onClick={handleSaveProfile}
            disabled={isSaving || !fullName.trim() || fullName.trim() === user?.fullName}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleUpdatePassword}
          >
            <Shield className="h-4 w-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
