import React from 'react';
import { testimonials } from './data';

export const TrustedLogos: React.FC = () => {
  // We duplicate the testimonials list to make the infinite scroll smooth
  const doubleTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      className="landing-section animate-fade-in-up overflow-hidden"
      style={{ paddingTop: '24px' }}
    >
      <div className="landing-container overflow-hidden">
        <div className="logos animate-infinite-scroll">
          {doubleTestimonials.map((item, index) => {
            const firstChar = item.company.charAt(0);
            return (
              <div className="logo-tile" key={index}>
                <div className="brand-lockup">
                  <span className="brand-mark">{firstChar}</span>
                  {item.company}
                </div>
                <span className="meta">{item.company} · {item.role}</span>
                <p>{item.quote}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustedLogos;
