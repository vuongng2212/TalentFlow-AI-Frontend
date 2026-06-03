import React from "react";
import Link from "next/link";
import Accordion from "@/components/ui/accordion";

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link className="logo" href="/">
            <span className="logo-mark">TF</span> TalentFlow AI
          </Link>
          <nav>
            <a
              href="#features"
              className="hover:text-purple-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-purple-600 transition-colors"
            >
              Pricing
            </a>
            <a href="#how" className="hover:text-purple-600 transition-colors">
              How it works
            </a>
          </nav>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link className="btn secondary" href="/login">
              Login
            </Link>
            <Link className="btn primary" href="/signup">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="landing-section animate-fade-in-up">
          <div className="landing-container hero-grid">
            <div>
              <span className="chip ai-chip">AI ✦ Candidate intelligence</span>
              <h1 className="hero-title mt-4">
                Hire Smarter with{" "}
                <span className="gradient-text bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  AI-Powered Recruiting
                </span>
              </h1>
              <p className="hero-copy mt-4">
                Automate CV triage, score candidates with AI, and move top
                talent through your pipeline faster without hiding the evidence
                recruiters need to trust each decision.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "28px",
                  flexWrap: "wrap",
                }}
              >
                <Link className="btn primary" href="/signup">
                  Get Started Free
                </Link>
                <a className="btn secondary" href="#demo-tour">
                  Watch Guided Demo
                </a>
              </div>
            </div>
            <div
              className="mockup relative"
              aria-label="TalentFlow AI kanban mockup"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <strong>Senior Frontend Engineer</strong>
                <span className="badge open">OPEN</span>
              </div>

              {/* Success Overlay for US1 */}
              <div className="absolute inset-0 z-30 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center animate-success-overlay">
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold shadow-lg border border-emerald-200 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Offer Sent
                </div>
              </div>

              <div className="mini-board">
                <div className="mini-col bg-slate-50 border border-slate-200 shadow-sm relative">
                  <strong className="text-slate-700">Screening</strong>
                  {/* Spacer for animated card to push Jon Bell down */}
                  <div className="h-[110px] invisible"></div>
                  {/* Animated Card */}
                  <div className="absolute top-[42px] left-0 right-0 px-[10px] animate-kanban-card z-20">
                    <div className="mini-card m-0 w-full shadow-md">
                      <span className="chip ai-chip text-[10px] py-1 px-2 mb-1 w-[72px] justify-center">
                        AI ✦ 98
                      </span>
                      <b>Sarah Connor</b>
                      <p className="text-xs text-gray-500">
                        React, UX, Leadership
                      </p>
                    </div>
                  </div>

                  <div className="mini-card mt-2">
                    <span className="chip ai-chip text-[10px] py-1 px-2 mb-1 w-[72px] justify-center">
                      AI ✦ 82
                    </span>
                    <b>Jon Bell</b>
                    <p className="text-xs text-gray-500">
                      Accessibility, Next.js
                    </p>
                  </div>
                </div>
                <div className="mini-col bg-violet-100 border border-violet-300 shadow-sm">
                  <strong className="text-violet-800">Interview</strong>
                  {/* <div className="mini-card mt-2">
                    <span className="chip ai-chip text-[10px] py-1 px-2 mb-1 w-[72px] justify-center">AI ✦ 89</span>
                    <b>Nora Patel</b>
                    <p className="text-xs text-gray-500">Frontend platform</p>
                  </div> */}
                </div>
                <div className="mini-col bg-emerald-100 border border-emerald-300 shadow-sm">
                  <strong className="text-emerald-800">Offer</strong>
                  {/* <div className="mini-card mt-2">
                    <span className="chip ai-chip text-[10px] py-1 px-2 mb-1 w-[72px] justify-center">AI ✦ 91</span>
                    <b>Sofia Rivera</b>
                    <p className="text-xs text-gray-500">Staff UI systems</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="landing-section animate-fade-in-up overflow-hidden"
          style={{ paddingTop: "24px" }}
        >
          <div className="landing-container overflow-hidden">
            <div className="logos animate-infinite-scroll">
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">N</span>Novaware
                </div>
                <span className="meta">B2B SaaS · People team</span>
                <p>
                  Uses AI evidence summaries to align recruiters and hiring
                  managers before screen calls.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">C</span>Cloudkit
                </div>
                <span className="meta">Cloud infra · Global</span>
                <p>
                  Runs high-volume engineering pipelines with structured
                  scorecards and audit history.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">A</span>Axiom Data
                </div>
                <span className="meta">Data platform · Enterprise</span>
                <p>
                  Gives admins one place to review roles, exports, billing, and
                  override events.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">R</span>Runway Ops
                </div>
                <span className="meta">Operations · Hybrid</span>
                <p>
                  Coordinates interviewer feedback from the same candidate
                  dossier recruiters use.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">H</span>Helios AI
                </div>
                <span className="meta">AI lab · Scale-up</span>
                <p>
                  Shortlists senior technical talent without hiding the evidence
                  behind each score.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">N</span>Novaware
                </div>
                <span className="meta">B2B SaaS · People team</span>
                <p>
                  Uses AI evidence summaries to align recruiters and hiring
                  managers before screen calls.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">C</span>Cloudkit
                </div>
                <span className="meta">Cloud infra · Global</span>
                <p>
                  Runs high-volume engineering pipelines with structured
                  scorecards and audit history.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">A</span>Axiom Data
                </div>
                <span className="meta">Data platform · Enterprise</span>
                <p>
                  Gives admins one place to review roles, exports, billing, and
                  override events.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">R</span>Runway Ops
                </div>
                <span className="meta">Operations · Hybrid</span>
                <p>
                  Coordinates interviewer feedback from the same candidate
                  dossier recruiters use.
                </p>
              </div>
              <div className="logo-tile">
                <div className="brand-lockup">
                  <span className="brand-mark">H</span>Helios AI
                </div>
                <span className="meta">AI lab · Scale-up</span>
                <p>
                  Shortlists senior technical talent without hiding the evidence
                  behind each score.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section animate-fade-in-up" id="features">
          <div className="landing-container">
            <div className="grid-3">
              <div className="card pad">
                <span className="badge screening">AI CV Parsing</span>
                <h3 style={{ marginTop: "12px" }}>
                  Structured profiles in seconds
                </h3>
                <p>
                  Extract experience, seniority, skills, education, compensation
                  signals, and missing evidence from every uploaded resume.
                </p>
              </div>
              <div className="card pad">
                <span className="badge offer">Semantic Scoring</span>
                <h3 style={{ marginTop: "12px" }}>
                  Scores with visible reasoning
                </h3>
                <p>
                  Each AI score includes matched skills, gaps, risk flags, and
                  recruiter override history so teams can audit decisions.
                </p>
              </div>
              <div className="card pad">
                <span className="badge applied">Kanban Pipeline</span>
                <h3 style={{ marginTop: "12px" }}>
                  Move fast without losing context
                </h3>
                <p>
                  Drag candidates through role-specific stages while notes,
                  interview packs, and automation triggers follow the card.
                </p>
              </div>
              <div className="card pad">
                <span className="badge interview">Automated Comms</span>
                <h3 style={{ marginTop: "12px" }}>Keep candidates warm</h3>
                <p>
                  Send templated updates, interview reminders, rejection
                  messages, and hiring-manager nudges from the same workspace.
                </p>
              </div>
              <div className="card pad">
                <span className="badge open">Real-time Updates</span>
                <h3 style={{ marginTop: "12px" }}>
                  Every stakeholder sees the latest state
                </h3>
                <p>
                  Recruiters, interviewers, and admins get role-aware navigation
                  and alerts for the work they own.
                </p>
              </div>
              <div className="card pad">
                <span className="badge closed">Audit Trail</span>
                <h3 style={{ marginTop: "12px" }}>Govern the hiring process</h3>
                <p>
                  Track scoring changes, stage moves, plan usage, data exports,
                  and workspace permission changes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section animate-fade-in-up">
          <div className="landing-container grid-4">
            <div className="card pad border-violet-200 bg-violet-50/40 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
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
              <div className="stat-number gradient-text bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent text-5xl">
                50%
              </div>
              <p className="mt-2 font-medium text-violet-900/80">
                Faster first-pass triage for high-volume roles.
              </p>
            </div>
            <div className="card pad border-emerald-200 bg-emerald-50/40 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
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
              <div className="stat-number bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent text-5xl">
                85%
              </div>
              <p className="mt-2 font-medium text-emerald-900/80">
                Extraction accuracy target for structured candidate facts.
              </p>
            </div>
            <div className="card pad border-blue-200 bg-blue-50/40 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
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
              <div className="stat-number bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent text-5xl">
                4.7h
              </div>
              <p className="mt-2 font-medium text-blue-900/80">
                Average weekly recruiter admin time saved per open role.
              </p>
            </div>
            <div className="card pad border-amber-200 bg-amber-50/40 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
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
              <div className="stat-number bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent text-5xl">
                3
              </div>
              <p className="mt-2 font-medium text-amber-900/80">
                Role-specific workspaces for recruiters, interviewers, and
                admins.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-section" id="demo-tour">
          <div className="landing-container grid-2">
            <div>
              <span className="chip ai-chip">AI ✦ Guided demo</span>
              <h2 style={{ marginTop: "14px" }}>
                Preview the recruiting flow before entering the app.
              </h2>
              <p style={{ marginTop: "10px" }}>
                The demo follows one role from CV intake to a scored shortlist,
                then hands off to the interactive dashboard only after the
                viewer understands they are opening a product preview.
              </p>
              <Link
                className="btn secondary mt-5 inline-flex"
                href="/dashboard"
              >
                Open dashboard preview
              </Link>
            </div>
            <div className="card pad">
              <div className="list">
                <p>
                  <strong>1. Intake:</strong> Upload resumes and normalize
                  candidate facts.
                </p>
                <p>
                  <strong>2. Evidence:</strong> Review AI fit, skill matches,
                  gaps, and confidence notes.
                </p>
                <p>
                  <strong>3. Pipeline:</strong> Move candidates through
                  screening, interviews, offer, or rejection with audit context
                  intact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="how">
          <div className="landing-container">
            <h2 className="text-center">
              From resume intake to decision-ready shortlist
            </h2>
            <div className="grid-3" style={{ marginTop: "20px" }}>
              <div className="card pad">
                <span className="step-dot">1</span>
                <h3 style={{ marginTop: "12px" }}>Upload CVs</h3>
                <p>
                  Bulk upload resumes, paste LinkedIn profiles, or ingest
                  applications from job boards.
                </p>
              </div>
              <div className="card pad">
                <span className="step-dot">2</span>
                <h3 style={{ marginTop: "12px" }}>AI triage</h3>
                <p>
                  TalentFlow extracts evidence, computes a score, and explains
                  fit against the hiring plan.
                </p>
              </div>
              <div className="card pad">
                <span className="step-dot">3</span>
                <h3 style={{ marginTop: "12px" }}>Move candidates</h3>
                <p>
                  Recruiters advance, reject, schedule, or request
                  hiring-manager review from one board.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section animate-fade-in-up">
          <div className="landing-container grid-3">
            <div className="card pad">
              <p>
                &quot;We cut the first review loop from two days to one morning,
                and the score explanation made hiring managers trust the
                shortlist.&quot;
              </p>
              <strong style={{ display: "block", marginTop: "16px" }}>
                Ari Lane, VP People at Novaware
              </strong>
            </div>
            <div className="card pad">
              <p>
                &quot;The candidate dossier changed our interview prep.
                Interviewers arrive with evidence instead of resume
                guesses.&quot;
              </p>
              <strong style={{ display: "block", marginTop: "16px" }}>
                Priya Raman, Eng Director at Cloudkit
              </strong>
            </div>
            <div className="card pad">
              <p>
                &quot;Admin can finally see automation, roles, exports, and
                billing without asking recruiting ops for a spreadsheet.&quot;
              </p>
              <strong style={{ display: "block", marginTop: "16px" }}>
                Marcus Ito, COO at Axiom Data
              </strong>
            </div>
          </div>
        </section>

        <section className="landing-section" id="pricing">
          <div className="landing-container">
            <h2 className="text-center" style={{ marginBottom: "20px" }}>
              Plans for recruiting teams at every stage
            </h2>
            <div className="grid-3">
              <div className="card pad flex flex-col justify-between">
                <div>
                  <span className="badge closed">Personal</span>
                  <h3 style={{ marginTop: "12px" }}>Free</h3>
                  <p>
                    One recruiter, two active jobs, AI parsing preview, and
                    candidate notes.
                  </p>
                </div>
                <Link className="btn secondary mt-[18px] w-full" href="/signup">
                  Start Free
                </Link>
              </div>
              <div className="card pad flex flex-col justify-between ring-2 ring-primary shadow-[var(--shadow-ai)]">
                <div>
                  <span className="badge screening">Plus</span>
                  <h3 style={{ marginTop: "12px" }}>$49 / seat</h3>
                  <p>
                    For individual/freelancers. Expanded CV parsing limits,
                    candidate synthesis, kanban automations, and AI scoring.
                  </p>
                </div>
                <Link className="btn primary mt-[18px] w-full" href="/signup">
                  Choose Plus
                </Link>
              </div>
              <div className="card pad flex flex-col justify-between">
                <div>
                  <span className="badge open">Business</span>
                  <h3 style={{ marginTop: "12px" }}>Custom</h3>
                  <p>
                    Enterprise features including ADMIN workspace creation,
                    inviting recruiters/interviewers, SSO, and audit exports.
                  </p>
                </div>
                <Link
                  className="btn secondary mt-[18px] w-full"
                  href="/billing"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" data-faq>
          <div className="landing-container grid-2">
            <div>
              <h2>FAQ</h2>
              <p style={{ marginTop: "8px" }}>
                Designed for recruiting teams that need speed, explainability,
                and governance.
              </p>
            </div>
            <div className="card pad">
              <Accordion items={faqItems} />
            </div>
          </div>
        </section>

        <section className="landing-section animate-fade-in-up">
          <div className="landing-container cta-band">
            <h2>Build a cleaner hiring pipeline this week.</h2>
            <p style={{ margin: "10px 0 22px" }}>
              Start with a free workspace, upload your first batch of CVs, and
              see a scored shortlist before your next hiring sync.
            </p>
            <Link className="btn secondary" href="/signup">
              Create workspace
            </Link>
          </div>
        </section>
      </main>

      <footer
        className="landing-section"
        style={{ paddingTop: "24px", borderTop: "1px solid var(--border)" }}
      >
        <div
          className="landing-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <span className="logo">
            <span className="logo-mark">TF</span> TalentFlow AI
          </span>
          <p>Product · Security · Pricing · Support © 2026 TalentFlow AI</p>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 z-10">
        <Link
          href="/screens"
          className="btn secondary shadow-lg flex items-center gap-2"
          style={{ cursor: "pointer" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          All Screens
        </Link>
      </div>
    </div>
  );
}
