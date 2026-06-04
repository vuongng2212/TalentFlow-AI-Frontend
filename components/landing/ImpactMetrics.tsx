import React from 'react';

export const ImpactMetrics: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up">
      <div className="landing-container grid-4">
        <div className="card pad border-slate-200 bg-white shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-number text-ai text-6xl">
            50%
          </div>
          <p className="mt-2 font-medium text-slate-700">
            Faster first-pass triage for high-volume roles.
          </p>
        </div>
        <div className="card pad border-slate-200 bg-white shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-number text-ai text-6xl">
            85%
          </div>
          <p className="mt-2 font-medium text-slate-700">
            Extraction accuracy target for structured candidate facts.
          </p>
        </div>
        <div className="card pad border-slate-200 bg-white shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-number text-ai text-6xl">
            4.7h
          </div>
          <p className="mt-2 font-medium text-slate-700">
            Average weekly recruiter admin time saved per open role.
          </p>
        </div>
        <div className="card pad border-slate-200 bg-white shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-number text-ai text-6xl">
            3
          </div>
          <p className="mt-2 font-medium text-slate-700">
            Role-specific workspaces for recruiters, interviewers, and
            admins.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
