"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/use-scroll-animation";
import { Star, Quote } from "lucide-react";

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

export function TestimonialsSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible, getStaggerStyle } =
    useStaggeredAnimation(testimonials.length, { staggerDelay: 120 });

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            "text-center max-w-2xl mx-auto mb-16 scroll-animate",
            headerVisible && "is-visible"
          )}
        >
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
        <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.author}
              className={cn(
                "hover-lift scroll-stagger-item",
                gridVisible && "is-visible"
              )}
              style={getStaggerStyle(index)}
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
