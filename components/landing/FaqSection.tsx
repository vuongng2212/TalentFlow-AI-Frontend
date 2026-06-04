import React from 'react';
import { faqItems } from './data';
import { Accordion } from '../ui/accordion';
import SectionHeader from './SectionHeader';

export const FaqSection: React.FC = () => {
  return (
    <section className="landing-section" data-faq>
      <div className="landing-container grid-2">
        <div>
          <SectionHeader
            title="FAQ"
            subtitle="Designed for recruiting teams that need speed, explainability, and governance."
          />
        </div>
        <div className="card pad">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
