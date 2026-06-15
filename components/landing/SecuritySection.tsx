import React from "react";
import SectionHeader from "./SectionHeader";

export const SecuritySection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 dark:bg-zinc-950/20 border-y border-slate-100 dark:border-zinc-900" id="security">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeader
          chip="Enterprise Grade"
          title="Security & compliance you can trust"
          subtitle="Designed for recruiting teams that need speed, explainability, and governance without compromising on security."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {/* Item 1 */}
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-100 uppercase dark:bg-zinc-800 dark:text-zinc-200">
              SOC 2 Type II
            </div>
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              Enterprise Security
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              Our infrastructure is SOC 2 Type II certified. All candidate and
              workspace data is encrypted at rest and in transit using
              enterprise-grade protocols.
            </p>
          </div>

          {/* Item 2 */}
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-100 uppercase dark:bg-zinc-800 dark:text-zinc-200">
              GDPR Ready
            </div>
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              Data Privacy
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              Full compliance with GDPR and CCPA. Configure custom data
              retention policies and fully automate candidate data deletion
              workflows.
            </p>
          </div>

          {/* Item 3 */}
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-100 uppercase dark:bg-zinc-800 dark:text-zinc-200">
              Audit Trails
            </div>
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              Governance & Logs
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
              Maintain a comprehensive audit history for role changes, candidate
              exports, billing events, automations, and AI scoring overrides.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
