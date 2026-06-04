import React from 'react';
import Link from 'next/link';

export const FinalCta: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up">
      <div className="landing-container cta-band">
        <h2>Build a cleaner hiring pipeline this week.</h2>
        <p style={{ margin: "10px 0 22px" }}>
          Start with a free workspace, upload your first batch of CVs, and
          see a scored shortlist before your next hiring sync.
        </p>
        <Link className="btn secondary" href="/signup">
          Create workspace
        </Link>
      </div>
    </section>
  );
};

export default FinalCta;
