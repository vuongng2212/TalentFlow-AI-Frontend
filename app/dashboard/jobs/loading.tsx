import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function JobsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded skeleton mb-2" />
          <div className="h-4 w-96 bg-muted rounded skeleton" />
        </div>
        <div className="h-10 w-32 bg-muted rounded skeleton" />
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-80 bg-muted rounded skeleton" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-muted rounded skeleton" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-5 w-20 bg-muted rounded skeleton mb-2" />
              <div className="h-6 w-full bg-muted rounded skeleton" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-full bg-muted rounded skeleton"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-6 w-16 bg-muted rounded skeleton" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
