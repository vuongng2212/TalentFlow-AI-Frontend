import React from 'react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <section className="landing-section animate-fade-in-up">
      <div className="landing-container hero-grid">
        <div>
          <span className="chip ai-chip">AI ✦ Candidate intelligence</span>
          <h1 className="hero-title mt-4">
            Hire Smarter with{" "}
            <span className="gradient-text bg-gradient-to-r from-primary to-ai bg-clip-text text-transparent">
              AI-Powered Recruiting
            </span>
          </h1>
          <p className="hero-copy mt-4">
            Automate CV triage, score candidates with AI, and move top talent
            through your pipeline faster without hiding the evidence recruiters
            need to trust each decision.
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
              <div className="absolute top-[42px] left-0 right-0 px-[10px] animate-kanban-card z-20 pointer-events-none">
                <div className="mini-card m-0 w-full shadow-xl bg-white border border-slate-200 pointer-events-auto">
                  <span className="chip ai-chip text-[10px] py-1 px-2 mb-1 w-[72px] justify-center">
                    AI ✦ 98
                  </span>
                  <b className="text-slate-900">Sarah Connor</b>
                  <p className="text-xs text-slate-500">
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
            <div className="mini-col bg-indigo-50 border border-indigo-200 shadow-sm">
              <strong className="text-indigo-800">Interview</strong>
            </div>
            <div className="mini-col bg-emerald-100 border border-emerald-300 shadow-sm">
              <strong className="text-emerald-800">Offer</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
