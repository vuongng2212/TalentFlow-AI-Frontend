import React from 'react';
import { SectionHeader } from './SectionHeader';
import { challenges } from './data';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'time':
      return (
        <svg
          className="w-10 h-10 text-red-500 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'chat':
      return (
        <svg
          className="w-10 h-10 text-red-500 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'shield':
      return (
        <svg
          className="w-10 h-10 text-red-500 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return null;
  }
};

export const ChallengesSection: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up bg-slate-50 dark:bg-zinc-950/20" id="challenges">
      <div className="landing-container">
        <SectionHeader
          chip="The Problem"
          title="Why recruiting breaks down at scale"
          subtitle="Legacy ATS systems and manual operations hold your team back. TalentFlow removes the friction."
          centered
        />
        <div className="grid-3 mt-8">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="card pad border-red-100 dark:border-red-950/30 bg-white dark:bg-zinc-900/50 shadow-sm flex flex-col items-center text-center">
              {getIcon(challenge.icon)}
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mt-2 mb-2">
                {challenge.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
