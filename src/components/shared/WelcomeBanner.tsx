"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card className="bg-gradient-mesh border-primary/20 overflow-hidden relative">
      <CardContent className="pt-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">
              Welcome back{userName ? `, ${userName}` : ""}! 👋
            </h3>
            <p className="text-muted-foreground mb-4">
              You have{" "}
              <span className="font-semibold text-foreground">
                8 active candidates
              </span>{" "}
              in your pipeline and{" "}
              <span className="font-semibold text-foreground">
                3 interviews
              </span>{" "}
              scheduled this week.
            </p>
            <div className="flex gap-2">
              <Button size="sm">View Candidates</Button>
              <Button size="sm" variant="outline">
                Schedule Interview
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
