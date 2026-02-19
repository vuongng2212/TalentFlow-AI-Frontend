import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}

const notificationItems: NotificationItem[] = [
  {
    id: "new-applications",
    title: "New Applications",
    description: "Get notified when candidates apply for your jobs",
    defaultChecked: true,
  },
  {
    id: "interview-reminders",
    title: "Interview Reminders",
    description: "Receive reminders before scheduled interviews",
    defaultChecked: true,
  },
  {
    id: "weekly-reports",
    title: "Weekly Reports",
    description: "Get weekly analytics and performance reports",
    defaultChecked: true,
  },
  {
    id: "team-activity",
    title: "Team Activity",
    description: "Notifications about team member actions",
    defaultChecked: false,
  },
  {
    id: "email-notifications",
    title: "Email Notifications",
    description: "Receive email updates for important events",
    defaultChecked: true,
  },
];

export function NotificationsTab() {
  const handleSavePreferences = () => {
    toast.success("Preferences saved!", {
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={item.defaultChecked}
                className="h-5 w-5 rounded border-input"
              />
            </div>
          ))}
        </div>

        <Button className="gap-2" onClick={handleSavePreferences}>
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
