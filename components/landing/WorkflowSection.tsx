import React from 'react';

export default function WorkflowSection() {
  return (
    <section className="landing-section" id="how">
      <div className="landing-container">
        <h2 className="text-center">
          From resume intake to decision-ready shortlist
        </h2>
        <div className="grid-3" style={{ marginTop: "20px" }}>
          <div className="card pad">
            <span className="step-dot">1</span>
            <h3 style={{ marginTop: "12px" }}>Upload CVs</h3>
            <p>
              Bulk upload resumes, paste LinkedIn profiles, or ingest
              applications from job boards.
            </p>
          </div>
          <div className="card pad">
            <span className="step-dot">2</span>
            <h3 style={{ marginTop: "12px" }}>AI triage</h3>
            <p>
              TalentFlow extracts evidence, computes a score, and explains
              fit against the hiring plan.
            </p>
          </div>
          <div className="card pad">
            <span className="step-dot">3</span>
            <h3 style={{ marginTop: "12px" }}>Move candidates</h3>
            <p>
              Recruiters advance, reject, schedule, or request
              hiring-manager review from one board.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
