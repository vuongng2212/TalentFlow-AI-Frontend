import React from 'react';
import SectionHeader from './SectionHeader';
import { integrations } from './data';
import { LinkedInIcon, GoogleCalendarIcon, SlackIcon, BambooHRIcon } from './icons';

// Helper to render branded colored marks for key integrations
const getLogoMark = (name: string, fallbackText: string) => {
  switch (name) {
    case 'LinkedIn':
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-lg shadow-xs border border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
          <LinkedInIcon className="w-6 h-6" />
        </div>
      );
    case 'Google Calendar':
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-lg shadow-xs border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
          <GoogleCalendarIcon className="w-6 h-6" />
        </div>
      );
    case 'Slack':
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-lg shadow-xs border border-purple-200/50 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">
          <SlackIcon className="w-6 h-6" />
        </div>
      );
    case 'BambooHR':
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-lg shadow-xs border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
          <BambooHRIcon className="w-6 h-6" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-700 font-extrabold text-lg shadow-xs border border-slate-200/50 dark:bg-zinc-800/30 dark:text-zinc-300 dark:border-zinc-700/50">
          {fallbackText}
        </div>
      );
  }
};

export const IntegrationsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28" id="integrations">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          chip="Integrations"
          title="Connect with your existing tools"
          subtitle="TalentFlow integrates directly with the platforms your team already uses to streamline the hiring workflow."
          centered={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-3.5 mb-4">
                {getLogoMark(integration.name, integration.logoMark)}
                <div>
                  <h3 className="font-jakarta text-[15px] font-bold text-slate-900 dark:text-zinc-50 leading-tight m-0">
                    {integration.name}
                  </h3>
                  <span className="text-[9px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mt-0.5">
                    {integration.category}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed grow">
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
