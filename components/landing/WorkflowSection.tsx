import React from 'react';
import Link from 'next/link';

export default function WorkflowSection() {
  return (
    <section className="landing-section" id="how">
      <div className="landing-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2>From resume intake to decision-ready shortlist</h2>
          <p className="mt-4 text-lg text-slate-600">
            Preview the recruiting flow before entering the app. The demo follows one role from CV intake to a scored shortlist.
          </p>
          <div className="mt-6">
            <Link className="btn secondary" href="/dashboard">
              Open dashboard preview
            </Link>
          </div>
        </div>

        <div className="grid-3">
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