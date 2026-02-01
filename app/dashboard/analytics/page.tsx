import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          View recruitment metrics and performance insights
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Advanced Analytics</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Detailed analytics dashboard coming soon. Track time-to-hire, source
            effectiveness, and candidate pipeline metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
