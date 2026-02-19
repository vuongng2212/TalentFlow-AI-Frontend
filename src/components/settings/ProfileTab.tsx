import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Save, Camera, Shield } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types";

interface ProfileTabProps {
  user: User | null;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const handleSaveProfile = () => {
    toast.success("Profile updated!", {
      description: "Your profile changes have been saved.",
    });
  };

  const handleUpdatePassword = () => {
    toast.success("Password updated!", {
      description: "Your password has been changed successfully.",
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
                defaultValue={user?.fullName}
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
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+7 (Vietnam)</option>
              </select>
            </div>
          </div>

          <Button className="gap-2" onClick={handleSaveProfile}>
            <Save className="h-4 w-4" />
            Save Changes
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
