import React from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import TrustedLogos from "@/components/landing/TrustedLogos";
import ChallengesSection from "@/components/landing/ChallengesSection";
import SolutionsSection from "@/components/landing/SolutionsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import SecuritySection from "@/components/landing/SecuritySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ImpactMetrics from "@/components/landing/ImpactMetrics";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <TrustedLogos />
        <ChallengesSection />
        <SolutionsSection />
        <FeaturesSection />
        <WorkflowSection />
        <IntegrationsSection />
        <SecuritySection />
        <TestimonialsSection />
        <ImpactMetrics />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>

      <Footer />

      <div className="fixed bottom-4 right-4 z-10">
        <Link
          href="/screens"
          className="btn secondary shadow-lg flex items-center gap-2"
          style={{ cursor: "pointer" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          All Screens
        </Link>
      </div>
    </div>
  );
}
