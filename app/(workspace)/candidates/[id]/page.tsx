'use client';

import React, { useState, useEffect } from 'react';
import { getCandidateById, updateCandidateStage } from '../../../../services/mockData';
import { Candidate } from '../../../../types';
import Badge from '../../../../components/ui/badge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CandidateDetailPage({ params }: PageProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  // Unwrap params using React.use() equivalent in useEffect for client safety
  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;
    async function load() {
      const c = await getCandidateById(unwrappedParams!.id);
      if (c) {
        setCandidate(c);
      }
    }
    load();
  }, [unwrappedParams]);

  if (!candidate) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-gray-500">
        Loading candidate dossier...
      </div>
    );
  }

  const handleStageChange = async (newStage: string) => {
    try {
      const updated = await updateCandidateStage(candidate.id, newStage);
      setCandidate(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          Candidates / <strong>{candidate.name}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn secondary"
            onClick={() => setActiveTab('notes')}
            style={{ cursor: 'pointer' }}
          >
            Add Note
          </button>
          <select
            className="select max-w-[150px] animate-none"
            value={candidate.stage}
            onChange={(e) => handleStageChange(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </header>

      <section className="content">
        <div className="decision-layout">
          <section className="card pad" aria-label="Candidate overview">
            <div className="candidate-hero">
              <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '22px' }}>
                {candidate.avatar}
              </div>
              <div>
                <h1>{candidate.name}</h1>
                <p>
                  {candidate.email} · {candidate.phone || '+1 415 555 0184'} · San Francisco, CA
                </p>
                <div className="job-meta mt-[10px] flex gap-2 flex-wrap">
                  <Badge variant={candidate.stage}>{candidate.stage.toUpperCase()}</Badge>
                  <span className="chip">{candidate.title}</span>
                  <span className="chip">Applied {candidate.appliedDate}</span>
                </div>
              </div>
              <span className={`score ${candidate.scoreCategory}`} style={{ width: '64px', height: '64px', fontSize: '18px' }}>
                {candidate.score}
              </span>
            </div>

            <div className="signal-grid">
              <div className="signal-card">
                <strong>Primary fit</strong>
                <p>Frontend platform and design-system ownership.</p>
              </div>
              <div className="signal-card">
                <strong>Decision need</strong>
                <p>Validate enterprise security workflow depth.</p>
              </div>
              <div className="signal-card">
                <strong>Comp target</strong>
                <p>$185k base · within approved range.</p>
              </div>
              <div className="signal-card">
                <strong>Next step</strong>
                <p>Schedule system-design screen with Nora Walsh.</p>
              </div>
            </div>

            <div className="card pad decision-summary" style={{ marginTop: '16px' }}>
              <span className="chip ai-chip">AI ✦ Decision summary</span>
              <h2 style={{ marginTop: '12px' }}>Advance to technical screen with one focused risk probe.</h2>
              <p style={{ marginTop: '8px', color: 'var(--text-2)' }}>
                {candidate.summary}
              </p>
            </div>

            <div className="card pad" style={{ marginTop: '16px' }}>
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                  style={{ cursor: 'pointer' }}
                >
                  Overview
                </button>
                <button
                  className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resume')}
                  style={{ cursor: 'pointer' }}
                >
                  Resume facts
                </button>
                <button
                  className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notes')}
                  style={{ cursor: 'pointer' }}
                >
                  Notes
                </button>
              </div>

              <div className="tab-panel active">
                {activeTab === 'overview' && (
                  <div className="scorecard">
                    {candidate.scorecard.map((score, index) => (
                      <div key={index} className="score-row">
                        <span>{score.criteria}</span>
                        <div className="score-bar">
                          <span style={{ width: `${score.score}%` }}></span>
                        </div>
                        <strong>{score.score}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="list">
                    <p>
                      <strong>Current:</strong> Staff UI Engineer, Runway Ops
                    </p>
                    <p>
                      <strong>Previous:</strong> Frontend Platform Lead, Cloudkit
                    </p>
                    <p>
                      <strong>Education:</strong> BS Computer Science, UC Davis
                    </p>
                    <p>
                      <strong>Portfolio:</strong> Component API migrations, WCAG remediation, build performance.
                    </p>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <div className="space-y-2 mb-4">
                      {notes.map((note, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                          {note}
                        </div>
                      ))}
                    </div>
                    <textarea
                      className="textarea"
                      placeholder="Add private note"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button
                      className="btn primary"
                      style={{ marginTop: '10px', cursor: 'pointer' }}
                      onClick={handleSaveNote}
                    >
                      Save note
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="card pad" aria-label="AI evidence">
            <div className="page-head" style={{ marginBottom: '12px' }}>
              <div>
                <h2>AI evidence</h2>
                <p>Ranked proof behind the {candidate.score} score.</p>
              </div>
              <span className="chip ai-chip">AI ✦ audited</span>
            </div>
            <div className="evidence-list">
              <div className="evidence-item">
                <span className="evidence-rank">1</span>
                <div>
                  <strong>Reusable component systems</strong>
                  <p>Owned shared React primitives and component API migration across multiple product teams.</p>
                </div>
              </div>
              <div className="evidence-item">
                <span className="evidence-rank">2</span>
                <div>
                  <strong>Accessibility remediation</strong>
                  <p>Led WCAG-focused fixes and described rollout strategy, QA gates, and adoption metrics.</p>
                </div>
              </div>
              <div className="evidence-item">
                <span className="evidence-rank">3</span>
                <div>
                  <strong>Performance ownership</strong>
                  <p>Shows concrete build and interaction-performance work rather than only feature delivery.</p>
                </div>
              </div>
              <div className="evidence-item">
                <span className="evidence-rank">4</span>
                <div>
                  <strong>Risk flag</strong>
                  <p>Resume does not name SSO, audit, permissions, or regulated enterprise workflows directly.</p>
                </div>
              </div>
            </div>
            <div className="card pad" style={{ marginTop: '16px', background: 'var(--surface-2)', boxShadow: 'none' }}>
              <h3>Interview prompt</h3>
              <p style={{ marginTop: '8px' }}>
                Ask {candidate.name.split(' ')[0]} to walk through a component migration where permissions, auditability, or security review shaped the implementation plan.
              </p>
            </div>
          </section>

          <aside className="card pad" aria-label="Timeline and actions">
            <h2>Activity timeline</h2>
            <div className="timeline" style={{ marginTop: '16px' }}>
              {candidate.timeline.map((event) => (
                <div key={event.id} className="timeline-item">
                  <span className="dot"></span>
                  <div>
                    <strong>{event.action}</strong>
                    <p>
                      {event.user} · {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '18px 0' }} />
            <div className="list">
              <button className="btn primary" style={{ width: '100%', cursor: 'pointer' }}>
                Schedule screen
              </button>
              <button className="btn secondary" style={{ width: '100%', cursor: 'pointer' }}>
                Download CV
              </button>
              <button
                className="btn danger"
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => handleStageChange('rejected')}
              >
                Withdraw
              </button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
