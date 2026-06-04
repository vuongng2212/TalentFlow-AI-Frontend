import React from "react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up">
      <div className="landing-container grid-3">
        <div className="card pad">
          <p>
            &quot;We cut the first review loop from two days to one morning,
            and the score explanation made hiring managers trust the
            shortlist.&quot;
          </p>
          <strong style={{ display: "block", marginTop: "16px" }}>
            Ari Lane, VP People at Novaware
          </strong>
        </div>
        <div className="card pad">
          <p>
            &quot;The candidate dossier changed our interview prep.
            Interviewers arrive with evidence instead of resume
            guesses.&quot;
          </p>
          <strong style={{ display: "block", marginTop: "16px" }}>
            Priya Raman, Eng Director at Cloudkit
          </strong>
        </div>
        <div className="card pad">
          <p>
            &quot;Admin can finally see automation, roles, exports, and
            billing without asking recruiting ops for a spreadsheet.&quot;
          </p>
          <strong style={{ display: "block", marginTop: "16px" }}>
            Marcus Ito, COO at Axiom Data
          </strong>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
