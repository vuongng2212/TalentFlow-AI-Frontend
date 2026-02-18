import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME, ROUTES } from "@/lib/constants";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  Users,
  BarChart3,
  CheckCircle2,
  Star,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Play,
  ChevronRight,
  Quote,
} from "lucide-react";

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
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
      </div>
    </section>
  );
}

// ============================================
// LOGOS SECTION
// ============================================
function LogosSection() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
  ];

  return (
    <section className="py-12 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by recruiting teams at leading companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {companies.map((company) => (
            <div
              key={company}
              className="text-xl font-bold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection() {
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

// ============================================
// HOW IT WORKS SECTION
// ============================================
function HowItWorksSection() {
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
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

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

// ============================================
// STATS SECTION
// ============================================
function StatsSection() {
  const stats = [
    { value: "10x", label: "Faster Screening" },
    { value: "89%", label: "AI Accuracy" },
    { value: "50%", label: "Cost Reduction" },
    { value: "2.5k+", label: "Companies" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "TalentFlow AI cut our time-to-hire from 45 days to 15 days. The AI screening is incredibly accurate.",
      author: "Sarah Chen",
      role: "Head of Talent, TechCorp",
      avatar: "S",
      rating: 5,
    },
    {
      quote:
        "We used to spend 60% of our time screening resumes. Now our recruiters focus on what matters - talking to great candidates.",
      author: "Michael Brown",
      role: "VP People, StartupXYZ",
      avatar: "M",
      rating: 5,
    },
    {
      quote:
        "The kanban pipeline and AI scores have transformed how our team collaborates on hiring decisions.",
      author: "Emily Davis",
      role: "Recruiting Lead, Enterprise Inc",
      avatar: "E",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Loved by recruiting teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about TalentFlow AI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.author}
              className="hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  <Quote className="h-8 w-8 text-primary/20 mb-2" />
                  {testimonial.quote}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRICING SECTION
// ============================================
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 50 candidates/month",
        "3 team members",
        "AI screening & scoring",
        "Kanban pipeline",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "For growing teams with serious hiring needs",
      features: [
        "Up to 500 candidates/month",
        "10 team members",
        "Advanced AI matching",
        "Custom pipelines",
        "Analytics dashboard",
        "Priority support",
        "API access",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited candidates",
        "Unlimited team members",
        "SSO & SAML",
        "Custom integrations",
        "Dedicated success manager",
        "SLA guarantee",
        "On-premise option",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-soft-lg scale-105"
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary shadow-sm">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary to-indigo-600 p-12 lg:p-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to transform your hiring?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join 2,500+ companies who have already made hiring faster, fairer,
              and more efficient with TalentFlow AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={ROUTES.SIGNUP}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 h-12 px-8"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.LOGIN}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 h-12 px-8"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press", "Contact"],
    Resources: ["Documentation", "Help Center", "API Reference", "Status", "Community"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  };

  return (
    <footer className="py-16 border-t border-border/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered recruitment platform for modern hiring teams.
            </p>
            <div className="flex gap-3">
              {/* Social Icons */}
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <span className="text-xs font-medium">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// NAVBAR
// ============================================
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">{APP_NAME}</span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href={ROUTES.SIGNUP}>
              <Button size="sm" className="gap-1">
                Get Started
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <LogosSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <StatsSection />
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
