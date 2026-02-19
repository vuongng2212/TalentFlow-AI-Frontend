"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/use-scroll-animation";
import { ArrowRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How accurate is the AI screening?",
    answer:
      "Our AI models achieve 89% accuracy in matching candidates to job requirements. We continuously train on millions of successful placements to improve precision.",
  },
  {
    question: "Can I customize the AI matching criteria?",
    answer:
      "Yes! You can adjust skill weights, define must-have vs nice-to-have requirements, and create custom scoring rubrics tailored to your hiring needs.",
  },
  {
    question: "How long does it take to process a resume?",
    answer:
      "Most resumes are processed within 10 seconds. For bulk uploads of 100+ CVs, processing typically completes within 5 minutes.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We're SOC 2 Type II certified with end-to-end encryption. Your data is stored in secure, GDPR-compliant data centers.",
  },
  {
    question: "Can I integrate with my existing ATS?",
    answer:
      "Yes, we offer native integrations with major ATS platforms including Workday, Greenhouse, Lever, and more. We also provide a REST API for custom integrations.",
  },
  {
    question: "What happens after my free trial ends?",
    answer:
      "Your data remains accessible. You can choose to upgrade to a paid plan or export your data. We never delete candidate data without your consent.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: faqsRef, isVisible: faqsVisible, getStaggerStyle } =
    useStaggeredAnimation(faqs.length, { staggerDelay: 80 });

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "text-center mb-16 scroll-animate",
            headerVisible && "is-visible"
          )}
        >
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about TalentFlow AI.
          </p>
        </div>

        {/* FAQ Items */}
        <div ref={faqsRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "border border-border/50 rounded-xl overflow-hidden bg-card scroll-stagger-item",
                faqsVisible && "is-visible"
              )}
              style={getStaggerStyle(index)}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center p-6 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground mb-3">
            Still have questions?
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            Contact Support
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
