import React from 'react';
import Link from 'next/link';

export const FinalCta: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 overflow-hidden relative">
      {/* Decorative gradient behind CTA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl -z-10" />

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="relative rounded-3xl bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900 px-8 py-12 sm:px-12 sm:py-16 text-center shadow-2xl overflow-hidden border border-white/5">

          {/* Glowing ambient light dots */}
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
              Build a cleaner hiring pipeline this week
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-indigo-200/80 max-w-[58ch] mx-auto text-pretty">
              Start with a free workspace, upload your first batch of CVs, and
              see a scored shortlist before your next hiring sync.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-indigo-950 shadow-md shadow-white/5 hover:bg-indigo-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
              >
                Create Workspace
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCta;
