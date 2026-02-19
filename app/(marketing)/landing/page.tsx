import {
  HeroSection,
  LogosSection,
  FeaturesSection,
  HowItWorksSection,
  StatsSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  CTASection,
  LandingNavbar,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
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
        <section id="faq">
          <FAQSection />
        </section>
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
