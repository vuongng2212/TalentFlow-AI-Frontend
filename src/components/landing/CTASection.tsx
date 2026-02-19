"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ROUTES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={ref}
          className={cn(
            "relative rounded-3xl bg-gradient-to-r from-primary to-indigo-600 p-12 lg:p-16 overflow-hidden scroll-scale",
            isVisible && "is-visible"
          )}
        >
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
