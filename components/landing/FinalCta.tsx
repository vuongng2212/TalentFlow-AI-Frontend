import React from 'react';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';

export const FinalCta: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up">
      <div className="landing-container cta-band flex flex-col items-center text-center">
        <SectionHeader
          title="Build a cleaner hiring pipeline this week."
          subtitle="Start with a free workspace, upload your first batch of CVs, and see a scored shortlist before your next hiring sync."
          centered
        />
        <Link className="btn secondary" href="/signup">
          Create workspace
        </Link>
      </div>
    </section>
  );
};

export default FinalCta;
