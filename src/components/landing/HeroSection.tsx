"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Recruitment Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
            Hire{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Smarter
            </span>
            , Not Harder
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up stagger-1">
            TalentFlow AI uses advanced machine learning to screen candidates,
            match skills to job requirements, and accelerate your hiring
            pipeline by 10x.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
            <Link href={ROUTES.SIGNUP}>
              <Button size="lg" className="gap-2 shadow-primary hover:shadow-lg transition-shadow h-12 px-8">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 h-12 px-8">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in stagger-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <HeroDashboardPreview />
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="mt-16 lg:mt-24 relative animate-scale-in stagger-3">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
      <div className="relative rounded-2xl border border-border/50 shadow-soft-xl overflow-hidden bg-card">
        {/* Mock Dashboard Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center text-xs text-muted-foreground">
            dashboard.talentflow.ai
          </div>
        </div>
        {/* Mock Dashboard Content */}
        <div className="p-6 grid grid-cols-4 gap-4">
          {/* Stats Cards */}
          <div className="col-span-1 space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-2xl font-bold text-primary">247</p>
              <p className="text-xs text-muted-foreground">Active Candidates</p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <p className="text-2xl font-bold text-success">89%</p>
              <p className="text-xs text-muted-foreground">AI Accuracy</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
              <p className="text-2xl font-bold text-warning">12</p>
              <p className="text-xs text-muted-foreground">Open Positions</p>
            </div>
          </div>
          {/* Kanban Preview */}
          <div className="col-span-3 grid grid-cols-4 gap-3">
            {["Applied", "Screening", "Interview", "Offer"].map((stage, i) => (
              <div key={stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{stage}</span>
                  <Badge variant="secondary" className="text-[10px] h-4">
                    {[24, 18, 8, 4][i]}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].slice(0, 3 - i).map((j) => (
                    <div
                      key={j}
                      className="p-3 rounded-lg border border-border/60 bg-card shadow-soft-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <div className="flex-1">
                          <div className="h-2 w-20 bg-muted rounded" />
                          <div className="h-1.5 w-14 bg-muted/60 rounded mt-1" />
                        </div>
                        <Badge className="h-4 text-[9px] ai-score-excellent">
                          {90 + i + j}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
