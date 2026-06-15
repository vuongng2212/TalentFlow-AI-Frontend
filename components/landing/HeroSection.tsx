import React from 'react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -z-10 h-150 w-250 -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.08),transparent_55%)]" />
      <div className="absolute top-[20%] right-[-10%] -z-10 h-100 w-100 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 lg:items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1 text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI ✦ Candidate Intelligence
            </div>

            <h1 className="font-jakarta text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl text-balance leading-[1.05]">
              Hire Smarter with{' '}
              <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Recruiting
            </h1>

            <p className="max-w-[54ch] text-base leading-relaxed text-slate-600 dark:text-zinc-400 sm:text-lg text-pretty">
              Automate CV triage, score candidates with AI, and move top talent
              through your pipeline faster—without hiding the evidence recruiters
              need to trust each decision.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 hover:shadow-indigo-600/20 transition-all duration-200 active:scale-98 active:translate-y-0.5 hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <a
                href="#how"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all duration-200 active:scale-98 active:translate-y-0.5 hover:-translate-y-0.5"
              >
                Watch Guided Demo
              </a>
            </div>
          </div>

          {/* Layered Kanban Mockup */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            {/* Soft decorative glow behind mockup */}
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-indigo-500/10 to-emerald-500/10 opacity-30 blur-2xl -z-10" />

            {/* Mockup Window */}
            <div className="relative rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-2xl shadow-indigo-950/5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90">

              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-slate-200 dark:bg-zinc-700" />
                  <span className="h-3 w-3 rounded-full bg-slate-200 dark:bg-zinc-700" />
                  <span className="h-3 w-3 rounded-full bg-slate-200 dark:bg-zinc-700" />
                  <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Senior Frontend Engineer
                  </span>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  OPEN
                </span>
              </div>

              {/* Success Overlay simulation */}
              <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-zinc-950/70 backdrop-blur-[2px] animate-success-overlay">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 shadow-lg dark:border-emerald-500/20 dark:bg-emerald-950/90 dark:text-emerald-400">
                  <svg
                    className="h-4 w-4 stroke-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Offer Sent
                </div>
              </div>

              {/* Mini Board grid */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Column 1 */}
                <div className="relative rounded-xl bg-slate-50 dark:bg-zinc-800/40 p-2.5 border border-slate-100 dark:border-zinc-800/30">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    Screening
                  </h4>

                  {/* Spacer for animating card */}
                  <div className="h-24 invisible" />

                  {/* Animated card container */}
                  <div className="absolute top-8.5 left-0 right-0 px-2.5 animate-kanban-card z-20 pointer-events-none bg-transparent">
                    <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 pointer-events-auto">
                      <div className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black tracking-wide text-white mb-1 shadow-xs shadow-emerald-500/15">
                        AI ✦ 98
                      </div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                        Sarah Connor
                      </h5>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 truncate">
                        React, UX, Leadership
                      </p>
                    </div>
                  </div>

                  {/* Static card */}
                  <div className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-xs dark:border-zinc-800/60 dark:bg-zinc-900 mt-2">
                    <div className="inline-flex items-center justify-center rounded-md bg-emerald-500/90 px-1.5 py-0.5 text-[9px] font-black tracking-wide text-white mb-1">
                      AI ✦ 82
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                      Jon Bell
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 truncate">
                      Accessibility, Next.js
                    </p>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 p-2.5 border border-indigo-100/60 dark:border-indigo-900/10 flex flex-col">
                  <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider mb-2">
                    Interview
                  </h4>
                  <div className="grow rounded-lg border border-dashed border-indigo-200 dark:border-indigo-900/30 flex items-center justify-center min-h-30">
                    <span className="text-[10px] font-medium text-indigo-400/80 dark:text-indigo-600/50">Drop here</span>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 p-2.5 border border-emerald-100/60 dark:border-emerald-900/10 flex flex-col">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2">
                    Offer
                  </h4>
                  <div className="grow rounded-lg border border-dashed border-emerald-200 dark:border-emerald-900/30 flex items-center justify-center min-h-30">
                    <span className="text-[10px] font-medium text-emerald-400/80 dark:text-emerald-600/50">Ready</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
