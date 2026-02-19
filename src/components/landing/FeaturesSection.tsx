import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  Users,
  BarChart3,
  Shield,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Screening",
    description:
      "Our ML models analyze resumes against job requirements with 89% accuracy, saving 40+ hours per hire.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Instant Candidate Ranking",
    description:
      "Get AI scores and detailed breakdowns for every applicant within seconds of upload.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Users,
    title: "Collaborative Pipeline",
    description:
      "Kanban-style workflow with drag-and-drop, team comments, and real-time updates.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track time-to-hire, source effectiveness, and pipeline health with beautiful visualizations.",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with end-to-end encryption, SSO, and role-based access control.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Target,
    title: "Skills Matching",
    description:
      "Semantic understanding of skills, not just keyword matching. Find hidden gems in your pipeline.",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to hire better
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed for modern recruiting teams who want to move
            fast without sacrificing quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group hover-lift border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div
                  className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${feature.bgColor} mb-4 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
