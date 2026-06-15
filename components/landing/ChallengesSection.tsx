import React from 'react';
import { challenges } from './data';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'time':
      return (
        <svg
          className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
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
          className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
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
          className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
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
    <section className="py-20 sm:py-28 bg-slate-50/50 dark:bg-zinc-950/20 border-b border-slate-100 dark:border-zinc-900" id="challenges">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 lg:items-start">

          {/* Left Sticky Header Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
              The Problem
            </span>
            <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl text-balance">
              Why recruiting breaks down at scale
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 max-w-[40ch] text-base leading-relaxed text-pretty">
              Legacy ATS platforms and manual operations create friction at every step. TalentFlow automates triaging so your team can focus on relationships.
            </p>
          </div>

          {/* Right Connected Timeline Column */}
          <div className="lg:col-span-7 relative pl-4 sm:pl-6">
            {/* Timeline Vertical Bar */}
            <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-slate-200/60 dark:bg-zinc-800/60" />

            <div className="space-y-10">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="relative flex items-start gap-5 group">
                  {/* Timeline Circle with Icon */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 group-hover:border-indigo-500 group-hover:shadow-indigo-500/10 transition-all duration-300">
                    {getIcon(challenge.icon)}
                  </div>

                  {/* Challenge Text Content */}
                  <div className="pt-1.5 space-y-1.5">
                    <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
                      {challenge.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 max-w-[58ch] text-pretty">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
