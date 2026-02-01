import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-muted rounded skeleton mb-2" />
        <div className="h-4 w-96 bg-muted rounded skeleton" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted rounded skeleton" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded skeleton mb-2" />
              <div className="h-3 w-32 bg-muted rounded skeleton" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Jobs Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-muted rounded skeleton" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg border border-border"
            >
              <div className="flex-1 space-y-2">
                <div className="h-5 w-64 bg-muted rounded skeleton" />
                <div className="h-4 w-48 bg-muted rounded skeleton" />
              </div>
              <div className="h-6 w-20 bg-muted rounded skeleton" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
