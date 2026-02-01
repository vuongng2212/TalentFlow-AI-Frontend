import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CandidatesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-muted rounded skeleton mb-2" />
        <div className="h-4 w-96 bg-muted rounded skeleton" />
      </div>

      {/* Kanban Board Skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 bg-muted rounded skeleton" />
                  <div className="h-6 w-8 bg-muted rounded skeleton" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <Card key={j} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-muted skeleton" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-muted rounded skeleton" />
                        <div className="h-3 w-48 bg-muted rounded skeleton" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded skeleton" />
                      <div className="h-3 w-3/4 bg-muted rounded skeleton" />
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
