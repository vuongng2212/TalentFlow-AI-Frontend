import React from 'react';
import Accordion from '../ui/accordion';

export const FaqSection: React.FC = () => {
  const faqItems = [
    {
      question: "How does AI scoring work?",
      answer:
        "Scores compare resume evidence to the job requirements and show matched skills, gaps, and confidence notes.",
    },
    {
      question: "Can hiring managers use a lighter workspace?",
      answer:
        "Yes. Interviewers see interviews, candidate dossiers, feedback tasks, and relevant jobs without admin surfaces.",
    },
    {
      question: "Do admins get audit history?",
      answer:
        "Workspace admins can review role changes, exports, billing events, automations, and AI override history.",
    },
    {
      question: "Can we customize pipeline stages?",
      answer:
        "Each job can reorder stages, add review steps, and map automations to stage movement.",
    },
    {
      question: "Does it support bulk CV upload?",
      answer:
        "Bulk upload, email ingestion, and job-board ingestion are supported in Plus and Business plans.",
    },
    {
      question: "Can recruiters override the AI?",
      answer:
        "Yes. Overrides are first-class and kept in the audit trail with notes and timestamps.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50/30 dark:bg-zinc-950/10 border-t border-slate-100 dark:border-zinc-900" id="faq" data-faq>
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
              Support
            </span>
            <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed text-pretty max-w-[40ch]">
              Designed for recruiting teams that need speed, explainability, and governance. Cannot find the answer you need? Feel free to contact our support team.
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40">
            <Accordion items={faqItems} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default FaqSection;
