import React from 'react';
import Link from 'next/link';

export const PricingSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28" id="pricing">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
            Pricing Plans
          </span>
          <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
            Flexible plans for recruiting teams of all sizes
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-base leading-relaxed">
            Choose the plan that fits your current hiring throughput. Upgrade or downgrade as your workload shifts.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

          {/* Plan 1: Personal */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                  Personal
                </span>
                <div className="mt-4 flex items-baseline text-slate-900 dark:text-zinc-50">
                  <span className="text-4xl font-extrabold tracking-tight font-jakarta">Free</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-zinc-400 min-h-10">
                  One recruiter, two active jobs, AI parsing previews, and basic candidate notes.
                </p>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 border-t border-slate-100 dark:border-zinc-800/60 pt-6 text-xs text-slate-600 dark:text-zinc-400">
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  1 Recruiter seat
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  2 Active job pipelines
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  AI CV parsing preview
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Candidate timeline notes
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex w-full h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-98"
              >
                Start Free
              </Link>
            </div>
          </div>

          {/* Plan 2: Plus (Highlighted) */}
          <div className="relative group rounded-2xl border-2 border-indigo-600 bg-white p-6 sm:p-8 dark:bg-zinc-900/60 shadow-xl shadow-indigo-600/5 flex flex-col justify-between h-full">
            {/* Popular Badge */}
            <div className="absolute top-0 right-6 -mt-3.5">
              <span className="inline-flex items-center rounded-full bg-emerald-500 px-3.5 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase shadow-sm shadow-emerald-500/15">
                Popular
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-700 uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                  Plus
                </span>
                <div className="mt-4 flex items-baseline text-slate-900 dark:text-zinc-50">
                  <span className="text-4xl font-extrabold tracking-tight font-jakarta">$49</span>
                  <span className="ml-1 text-sm font-semibold text-slate-400">/ seat / mo</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-zinc-400 min-h-10">
                  For individual recruiters and freelancers. Expanded limits, automations, and semantic AI scoring.
                </p>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 border-t border-slate-100 dark:border-zinc-800/60 pt-6 text-xs text-slate-600 dark:text-zinc-400">
                <li className="flex items-center gap-2.5 font-semibold text-slate-700 dark:text-zinc-300">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Everything in Personal, plus:
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Unlimited active jobs
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Expanded CV upload quota
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  AI scoring & explainability
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Kanban status email triggers
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex w-full h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
              >
                Choose Plus
              </Link>
            </div>
          </div>

          {/* Plan 3: Business */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                  Business
                </span>
                <div className="mt-4 flex items-baseline text-slate-900 dark:text-zinc-50">
                  <span className="text-4xl font-extrabold tracking-tight font-jakarta">Custom</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-zinc-400 min-h-10">
                  Enterprise capabilities including workspace management, role governance, and audit history.
                </p>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 border-t border-slate-100 dark:border-zinc-800/60 pt-6 text-xs text-slate-600 dark:text-zinc-400">
                <li className="flex items-center gap-2.5 font-semibold text-slate-700 dark:text-zinc-300">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Everything in Plus, plus:
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Admin workspace controls
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Invite unlimited team members
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  SSO authentication & SAML
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Audit history log exports
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/billing"
                className="inline-flex w-full h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-98"
              >
                Contact Sales
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
