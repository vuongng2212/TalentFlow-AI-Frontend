'use client';

import React, { useState } from 'react';

export default function InterviewsPage() {
  const [techDepth, setTechDepth] = useState('Strong hire');
  const [confidence, setConfidence] = useState('High');
  const [evidence, setEvidence] = useState(
    'Candidate explained component migration tradeoffs and named rollout risks clearly.'
  );
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Feedback submitted successfully!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Interviews</strong>
        </div>
        <button className="btn primary" style={{ cursor: 'pointer' }}>
          Schedule Interview
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Interview Queue</h1>
            <p>Hiring-manager view with structured feedback and candidate evidence.</p>
          </div>
        </div>

        <div className="grid-3">
          <div className="card pad">
            <span className="badge interview">Today 2:00 PM</span>
            <h3 style={{ marginTop: '12px' }}>Maya Chen · System Design</h3>
            <p>Senior Frontend Engineer · Panel: Nora Walsh, Sam Lee</p>
            <button className="btn primary" style={{ marginTop: '14px', cursor: 'pointer' }}>
              Open interview pack
            </button>
          </div>
          <div className="card pad">
            <span className="badge interview">Tomorrow 10:30 AM</span>
            <h3 style={{ marginTop: '12px' }}>Nora Patel · ML Platform</h3>
            <p>ML Platform Engineer · Focus: data infra, reliability, model ops.</p>
            <button className="btn secondary" style={{ marginTop: '14px', cursor: 'pointer' }}>
              Review dossier
            </button>
          </div>
          <div className="card pad">
            <span className="badge draft">Feedback due</span>
            <h3 style={{ marginTop: '12px' }}>Jon Bell · Frontend Screen</h3>
            <p>Scorecard missing accessibility and architecture notes.</p>
            <button className="btn primary" style={{ marginTop: '14px', cursor: 'pointer' }}>
              Submit feedback
            </button>
          </div>
        </div>

        <form className="card pad" style={{ marginTop: '18px' }} onSubmit={handleSubmitFeedback}>
          <h2>Structured Feedback</h2>
          <div className="grid-2" style={{ marginTop: '14px' }}>
            <div className="field">
              <label>Technical depth</label>
              <select
                className="select animate-none"
                value={techDepth}
                onChange={(e) => setTechDepth(e.target.value)}
              >
                <option value="Strong hire">Strong hire</option>
                <option value="Hire">Hire</option>
                <option value="No hire">No hire</option>
              </select>
            </div>
            <div className="field">
              <label>Signal confidence</label>
              <select
                className="select animate-none"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Evidence notes</label>
              <textarea
                className="textarea"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button className="btn primary" style={{ cursor: 'pointer' }}>
              Save Feedback
            </button>
            {successMsg && <span className="text-green-600 font-bold text-sm">{successMsg}</span>}
          </div>
        </form>
      </section>
    </>
  );
}
