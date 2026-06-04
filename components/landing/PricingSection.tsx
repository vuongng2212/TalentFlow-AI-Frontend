import React from 'react';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { pricingPlans } from './data';

export const PricingSection: React.FC = () => {
  return (
    <section className="landing-section" id="pricing">
      <div className="landing-container">
        <SectionHeader
          title="Plans for recruiting teams at every stage"
          centered
        />
        <div className="grid-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`card pad flex flex-col justify-between${
                plan.isPopular ? ' ring-2 ring-primary shadow-[var(--shadow-ai)]' : ''
              }`}
            >
              <div>
                <span className={`badge ${plan.badge}`}>{plan.name}</span>
                <h3 style={{ marginTop: '12px' }}>
                  {plan.price}
                  {plan.period !== 'free' && plan.period !== 'Custom' && ` ${plan.period}`}
                </h3>
                <p>{plan.description}</p>
              </div>
              <Link
                className={`btn ${plan.isPopular ? 'primary' : 'secondary'} mt-[18px] w-full`}
                href={plan.ctaHref}
              >
                {plan.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
