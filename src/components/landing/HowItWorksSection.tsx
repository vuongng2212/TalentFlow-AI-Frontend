import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Upload Resumes",
    description:
      "Drag and drop CVs in bulk. We support PDF, DOCX, and can even parse LinkedIn profiles.",
    icon: "📄",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our AI extracts skills, experience, and education, then matches against your job requirements.",
    icon: "🤖",
  },
  {
    number: "03",
    title: "Review & Rank",
    description:
      "See AI scores with detailed breakdowns. Filter, sort, and shortlist top candidates instantly.",
    icon: "⭐",
  },
  {
    number: "04",
    title: "Hire Faster",
    description:
      "Move candidates through your pipeline with drag-and-drop. Close positions 3x faster.",
    icon: "🚀",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            From resume to hire in 4 simple steps
          </h2>
          <p className="text-lg text-muted-foreground">
            No complex setup. No training required. Start screening candidates
            in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 ? (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              ) : null}

              <div className="text-center">
                {/* Step Number */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border/50 shadow-soft-md mb-6">
                  <span className="text-4xl">{step.icon}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
