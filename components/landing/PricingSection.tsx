import React from 'react';
import Link from 'next/link';

export const PricingSection: React.FC = () => {
  return (
    <section className="landing-section" id="pricing">
      <div className="landing-container">
        <h2 className="text-center" style={{ marginBottom: "20px" }}>
          Plans for recruiting teams at every stage
        </h2>
        <div className="grid-3">
          <div className="card pad flex flex-col justify-between">
            <div>
              <span className="badge closed">Personal</span>
              <h3 style={{ marginTop: "12px" }}>Free</h3>
              <p>
                One recruiter, two active jobs, AI parsing preview, and
                candidate notes.
              </p>
            </div>
            <Link className="btn secondary mt-4.5 w-full" href="/signup">
              Start Free
            </Link>
          </div>
          <div className="card pad flex flex-col justify-between ring-2 ring-primary relative">
            <div className="absolute top-0 right-0 -mt-3 mr-4">
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Popular</span>
            </div>
            <div>
              <span className="badge screening">Plus</span>
              <h3 style={{ marginTop: "12px" }}>$49 / seat</h3>
              <p>
                For individual/freelancers. Expanded CV parsing limits,
                candidate synthesis, kanban automations, and AI scoring.
              </p>
            </div>
            <Link className="btn primary mt-4.5 w-full" href="/signup">
              Choose Plus
            </Link>
          </div>
          <div className="card pad flex flex-col justify-between">
            <div>
              <span className="badge open">Business</span>
              <h3 style={{ marginTop: "12px" }}>Custom</h3>
              <p>
                Enterprise features including ADMIN workspace creation,
                inviting recruiters/interviewers, SSO, and audit exports.
              </p>
            </div>
            <Link
              className="btn secondary mt-4.5 w-full"
              href="/billing"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
