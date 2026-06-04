import React from "react";
import { testimonials } from "./data";
import { SectionHeader } from "./SectionHeader";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up">
      <div className="landing-container grid-3">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="card pad">
            <p>&quot;{testimonial.quote}&quot;</p>
            <strong style={{ display: "block", marginTop: "16px" }}>
              {testimonial.author}, {testimonial.role} at {testimonial.company}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
