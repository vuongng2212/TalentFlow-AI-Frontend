import React from 'react';
import SectionHeader from './SectionHeader';
import { integrations } from './data';

export const IntegrationsSection: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up" id="integrations">
      <div className="landing-container">
        <SectionHeader
          chip="Integrations"
          title="Connect with your existing tools"
          subtitle="TalentFlow integrates directly with the platforms your team already uses to streamline the hiring workflow."
          centered={true}
        />

        <div className="grid-4" style={{ marginTop: '32px' }}>
          {integrations.map((integration, index) => (
            <div key={index} className="card pad flex flex-col h-full hover:border-primary-soft transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-700 font-bold text-lg shadow-sm border border-slate-200">
                  {integration.logoMark}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 leading-tight m-0" style={{ marginTop: 0 }}>{integration.name}</h3>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{integration.category}</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm flex-grow">
                {integration.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
