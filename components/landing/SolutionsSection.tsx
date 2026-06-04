import React from "react";
import Link from "next/link";

export const SolutionsSection = () => {
  return (
    <section className="landing-section" id="demo-tour">
      <div className="landing-container grid-2">
        <div>
          <span className="chip ai-chip">AI ✦ Guided demo</span>
          <h2 style={{ marginTop: "14px" }}>
            Preview the recruiting flow before entering the app.
          </h2>
          <p style={{ marginTop: "10px" }}>
            The demo follows one role from CV intake to a scored shortlist,
            then hands off to the interactive dashboard only after the
            viewer understands they are opening a product preview.
          </p>
          <Link
            className="btn secondary mt-5 inline-flex"
            href="/dashboard"
          >
            Open dashboard preview
          </Link>
        </div>
        <div className="card pad">
          <div className="list">
            <p>
              <strong>1. Intake:</strong> Upload resumes and normalize
              candidate facts.
            </p>
            <p>
              <strong>2. Evidence:</strong> Review AI fit, skill matches,
              gaps, and confidence notes.
            </p>
            <p>
              <strong>3. Pipeline:</strong> Move candidates through
              screening, interviews, offer, or rejection with audit context
              intact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
