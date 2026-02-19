"use client";

import { cn } from "@/lib/utils";
import { useStaggeredAnimation } from "@/hooks/use-scroll-animation";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
];

export function LogosSection() {
  const { ref, isVisible, getStaggerStyle } = useStaggeredAnimation(
    companies.length,
    { staggerDelay: 60 }
  );

  return (
    <section className="py-12 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by recruiting teams at leading companies
        </p>
        <div
          ref={ref}
          className="flex flex-wrap items-center justify-center gap-8 lg:gap-16"
        >
          {companies.map((company, index) => (
            <div
              key={company}
              className={cn(
                "text-xl font-bold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors scroll-fade",
                isVisible && "is-visible"
              )}
              style={getStaggerStyle(index)}
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
