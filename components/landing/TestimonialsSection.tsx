import React from "react";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "We cut the first review loop from two days to one morning, and the score explanation made hiring managers trust the shortlist.",
      author: "Ari Lane",
      role: "VP People",
      company: "Novaware",
      initials: "AL"
    },
    {
      quote: "The candidate dossier changed our interview prep. Interviewers arrive with evidence instead of resume guesses.",
      author: "Priya Raman",
      role: "Eng Director",
      company: "Cloudkit",
      initials: "PR"
    },
    {
      quote: "Admin can finally see automation, roles, exports, and billing without asking recruiting ops for a spreadsheet.",
      author: "Marcus Ito",
      role: "COO",
      company: "Axiom Data",
      initials: "MI"
    }
  ];

  return (
    <section className="landing-section animate-fade-in-up">
      <div className="landing-container grid-3">
        {testimonials.map((t, i) => (
          <div key={i} className="card pad" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{
              position: "absolute",
              top: "10px",
              left: "20px",
              fontSize: "60px",
              color: "var(--primary-soft)",
              lineHeight: 1,
              fontFamily: "serif",
              pointerEvents: "none",
              zIndex: 0
            }}>
              &ldquo;
            </div>

            <p style={{ position: "relative", zIndex: 1, marginTop: "20px", fontSize: "15px", fontStyle: "italic", color: "var(--text-2)" }}>
              {t.quote}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px", position: "relative", zIndex: 1 }}>
              <div className="avatar" style={{ width: "40px", height: "40px", fontSize: "14px", flexShrink: 0 }}>
                {t.initials}
              </div>
              <div>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--text-1)" }}>
                  {t.author}
                </strong>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-4)" }}>{t.role}</span>
                  <span className="badge" style={{ padding: "1px 6px", fontSize: "10px", background: "var(--surface-2)", color: "var(--text-3)", border: "1px solid var(--border)" }}>
                    {t.company}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
