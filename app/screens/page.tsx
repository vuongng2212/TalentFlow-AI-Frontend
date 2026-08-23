import React from 'react';
import Link from 'next/link';

export default function ScreensPage() {
  const screens = [
    { href: '/', category: 'Marketing', title: 'Landing Page', description: 'Hero, product proof, pricing, FAQ accordion, and CTA.', statusClass: 'open' },
    { href: '/login', category: 'Auth', title: 'Login', description: 'Split brand panel, validation, remember-me, forgot password.', statusClass: 'screening' },
    { href: '/signup', category: 'Auth', title: 'Signup', description: 'Account creation with role select, terms validation, and feedback.', statusClass: 'screening' },
    { href: '/dashboard', category: 'Recruiter', title: 'Dashboard Home', description: 'Stats, recent jobs, recent candidates, dismissible welcome prompt.', statusClass: 'open' },
    { href: '/jobs', category: 'Jobs', title: 'Jobs List', description: 'Search, status filtering, sorting affordance, job cards, empty state.', statusClass: 'open' },
    { href: '/jobs/job-1', category: 'Jobs', title: 'Job Detail', description: 'Overview, applicants table, pipeline config, metadata sidebar.', statusClass: 'open' },
    { href: '/candidates', category: 'Pipeline', title: 'Candidates', description: 'Working search/filter controls, kanban drag-and-drop, list tab.', statusClass: 'open' },
    { href: '/candidates/1', category: 'Dossier', title: 'Candidate Detail', description: 'AI summary, resume facts, timeline, notes, stage actions.', statusClass: 'open' },
    { href: '/interviews', category: 'Interviews', title: 'Interviews', description: 'Schedule queue, interviewer focus states, structured feedback.', statusClass: 'interview' },
    { href: '/billing', category: 'Billing', title: 'Plans & Billing', description: 'Subscription tiers, current usage, invoice table.', statusClass: 'offer' },
    { href: '/admin/users', category: 'Admin', title: 'User Management', description: 'Role governance, workspace seats, invite flow, admin-only nav.', statusClass: 'draft' },
    { href: '/settings', category: 'Settings', title: 'Workspace Settings', description: 'Automation ingestion, integrations, security, audit trail.', statusClass: 'closed' }
  ];

  return (
    <main className="launcher min-h-screen p-8 bg-zinc-50 dark:bg-zinc-900">
      <section className="card pad mb-6 max-w-6xl mx-auto shadow-md">
        <div className="page-head flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="logo text-2xl font-extrabold flex items-center gap-2">
              <span className="logo-mark">TF</span> TalentFlow AI
            </div>
            <h1 className="text-3xl font-bold mt-4 tracking-tight text-gray-900 dark:text-white">
              AI-first ATS product surface
            </h1>
            <p className="max-w-3xl mt-2 text-gray-600 dark:text-gray-400">
              High-fidelity responsive screens for a professional recruiting workspace: role-aware navigation, AI triage, kanban pipeline, candidate dossier, billing, and admin controls.
            </p>
          </div>
          <div className="chip ai-chip px-3 py-1 bg-linear-to-r from-violet-600 to-emerald-500 text-white rounded-full font-bold text-xs uppercase tracking-wider">
            AI ✦ Enterprise ATS
          </div>
        </div>
      </section>

      <section className="launcher-grid max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="TalentFlow AI screens">
        {screens.map((screen) => (
          <Link
            key={screen.href}
            href={screen.href}
            className="card screen-card interactive block p-6 border rounded-xl hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <span className={`badge ${screen.statusClass} inline-block mb-3 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider`}>
              {screen.category}
            </span>
            <strong className="block text-lg font-bold mb-1 text-gray-900 dark:text-white">
              {screen.title}
            </strong>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {screen.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
