import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <SettingsIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Application Settings</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Settings page under construction. Manage your profile, team members,
            notifications, and integrations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
