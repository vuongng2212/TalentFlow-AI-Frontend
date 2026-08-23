import React from 'react';

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28" id="features">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            Platform Capabilities
          </span>
          <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-4xl">
            Everything you need to automate triage
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-base leading-relaxed text-pretty">
            TalentFlow pairs state-of-the-art parsing intelligence with event-driven automation, giving recruiters superpowers without sacrificing human control.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: AI CV Parsing (Col span 2) */}
          <div className="md:col-span-2 group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative min-h-90">
            <div className="max-w-md space-y-3 relative z-10">
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                AI CV Parsing
              </span>
              <h3 className="font-jakarta text-xl font-bold text-slate-900 dark:text-zinc-50">
                Structured profiles in seconds
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Extract experience, seniority, skills, education, compensation signals, and missing evidence automatically from PDF/DOCX resumes.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="absolute right-0 bottom-0 w-[45%] h-[55%] bg-slate-50 dark:bg-zinc-800/30 border-l border-t border-slate-200/60 dark:border-zinc-800/50 rounded-tl-xl p-3 shadow-inner hidden sm:block translate-y-2 translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300">
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between border-b border-slate-100 dark:border-zinc-800/50 pb-1.5">
                  <span className="font-bold text-slate-700 dark:text-zinc-300">Parsed Entity</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Accuracy</span>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-1.5 rounded border border-slate-100 dark:border-zinc-800/60">
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">skills: React, Next.js</span>
                  <span className="bg-emerald-50 text-emerald-700 px-1 rounded font-bold dark:bg-emerald-950/30 dark:text-emerald-400">97%</span>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-1.5 rounded border border-slate-100 dark:border-zinc-800/60">
                  <span className="text-slate-800 dark:text-zinc-200 font-medium">exp: Senior (5 years)</span>
                  <span className="bg-emerald-50 text-emerald-700 px-1 rounded font-bold dark:bg-emerald-950/30 dark:text-emerald-400">92%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Semantic Scoring (Col span 1) */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between min-h-90">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                Semantic Scoring
              </span>
              <h3 className="font-jakarta text-xl font-bold text-slate-900 dark:text-zinc-50">
                Scores with visible reasoning
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Each AI score features explainable match criteria, highlighted strengths, and potential gaps, so you can audit decisions.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 font-black text-white text-xs shadow-md shadow-emerald-500/20">
                  94
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Excellent Fit</h4>
                  <p className="text-[10px] text-slate-400">Match confidence: High</p>
                </div>
              </div>
              <div className="text-[10px] text-right space-y-0.5">
                <span className="inline-block bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm font-bold dark:bg-emerald-950/30 dark:text-emerald-400">✦ React</span>
                <span className="block text-slate-400">⚠️ No Rust</span>
              </div>
            </div>
          </div>

          {/* Card 3: Kanban Pipeline (Col span 1) */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between min-h-90">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                Kanban Pipeline
              </span>
              <h3 className="font-jakarta text-xl font-bold text-slate-900 dark:text-zinc-50">
                Drag to advance
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Move candidates through custom stages. Resume notes, interview packs, and automated communication triggers follow card movement.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="mt-4 bg-slate-50 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-800/50 rounded-xl p-3 flex gap-2 justify-between items-center shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">Screening</span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                <svg className="h-3 w-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">Interview</span>
            </div>
          </div>

          {/* Card 4: Automated Comms (Col span 2) */}
          <div className="md:col-span-2 group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative min-h-90">
            <div className="max-w-md space-y-3 relative z-10">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                Automated Comms
              </span>
              <h3 className="font-jakarta text-xl font-bold text-slate-900 dark:text-zinc-50">
                Keep candidates warm
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Configure event-driven status emails, interview reminders, and rejection notes directly matching stage movement, ensuring a seamless experience.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="absolute right-0 bottom-0 w-[45%] h-[55%] bg-slate-50 dark:bg-zinc-800/30 border-l border-t border-slate-200/60 dark:border-zinc-800/50 rounded-tl-xl p-3 shadow-inner hidden sm:block translate-y-2 translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300">
              <div className="space-y-1.5 text-[9px]">
                <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 px-2 py-1.5 rounded border border-slate-100 dark:border-zinc-800/60 text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-zinc-300">To:</span> {"{candidate_email}"}
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 px-2 py-1.5 rounded border border-slate-100 dark:border-zinc-800/60 text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-zinc-300">Subject:</span> Interview Scheduling for {"{job_title}"}
                </div>
                <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-slate-100 dark:border-zinc-800/60 text-slate-500 leading-normal">
                  Hi {"{first_name}"}, We reviewed your application and would love to schedule a technical round...
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Real-time Updates (Col span 1) */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between min-h-90">
            <div className="space-y-3">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                Real-time Updates
              </span>
              <h3 className="font-jakarta text-xl font-bold text-slate-900 dark:text-zinc-50">
                Instant collaboration
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Stay updated. Recruiter notes, interviewer scorecards, and workspace alerts refresh in real-time, syncing multiple stakeholders.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Jon Bell moved to <b>Interview</b></span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>AI Parser finished <b>Sarah Connor CV</b></span>
              </div>
            </div>
          </div>

          {/* Card 6: Audit Trail (Col span 2) */}
          <div className="md:col-span-2 group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative min-h-90">
            <div className="max-w-md space-y-3 relative z-10">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                Audit Trail
              </span>
              <h3 className="font-jakarta text-xl font-bold text-slate-900 dark:text-zinc-50">
                Govern the hiring process
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                Track scoring revisions, workspace permission changes, billing milestones, and recruiter overrides for clean operational governance.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="absolute right-0 bottom-0 w-[45%] h-[55%] bg-slate-50 dark:bg-zinc-800/30 border-l border-t border-slate-200/60 dark:border-zinc-800/50 rounded-tl-xl p-3 shadow-inner hidden sm:block translate-y-2 translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300">
              <div className="space-y-1.5 text-[8.5px] font-mono">
                <div className="flex justify-between text-slate-400 border-b border-slate-100 dark:border-zinc-800/50 pb-1">
                  <span>Timestamp</span>
                  <span>Action</span>
                </div>
                <div className="text-slate-600 dark:text-zinc-300">
                  12:04:15 - AI Score Override (82 ➔ 90)
                </div>
                <div className="text-slate-600 dark:text-zinc-300">
                  10:31:02 - Workspace Member Invited
                </div>
                <div className="text-slate-600 dark:text-zinc-300">
                  09:15:44 - Exported Candidate List (Excel)
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
