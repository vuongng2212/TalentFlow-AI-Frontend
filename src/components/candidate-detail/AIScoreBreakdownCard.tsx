import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface AIScoreBreakdownCardProps {
  aiScore: number;
}

interface ScoreItem {
  label: string;
  score: number;
  max: number;
}

export function AIScoreBreakdownCard({ aiScore }: AIScoreBreakdownCardProps) {
  const breakdown = useMemo<ScoreItem[]>(() => [
    { label: "Skills Match", score: aiScore - 5, max: 100 },
    { label: "Experience Level", score: aiScore - 3, max: 100 },
    { label: "Education", score: Math.min(aiScore + 2, 100), max: 100 },
    { label: "Culture Fit", score: aiScore - 8, max: 100 },
  ], [aiScore]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Match Score</CardTitle>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{aiScore}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-sm text-muted-foreground">
                {item.score}/{item.max}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all"
                style={{ width: `${(item.score / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
