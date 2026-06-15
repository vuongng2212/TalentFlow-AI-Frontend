'use client';

import React, { useState, useEffect } from 'react';
import { applicationService } from '../../../../services/api/application.service';
import { Application, ApplicationStage } from '../../../../types';
import Badge from '../../../../components/ui/badge';
import { useUIStore } from '../../../../lib/store/useUIStore';
import { useMinDuration } from '../../../../hooks/useMinDuration';

interface PageProps {
  params: Promise<{ id: string }>;
}

import ScheduleInterviewModal from '../../../../components/features/interviews/ScheduleInterviewModal';

export default function ApplicationDetailPage({ params }: PageProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [rejectingApp, setRejectingApp] = useState(false);
  const { showLoading, hideLoading } = useUIStore();
  const minDur = useMinDuration();
  const [notes, setNotes] = useState<string[]>([]);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Unwrap params using React.use() equivalent in useEffect for client safety
  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;
    minDur.start();
      async function load() {
      try {
        const app = await applicationService.getApplicationById(unwrappedParams!.id);
        if (app) {
          setApplication(app);
          if (app.notes) {
            setNotes([app.notes]); // Backend returns a string for notes, ui needs array. This is a naive adaptation
          }
        }
              minDur.end(() => {});
      } catch (e) {
        console.error("Failed to load application", e);
      }
    }
    load();
  }, [unwrappedParams]);

  if (!application || !application.candidate) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-gray-500">
        <svg className="animate-spin h-8 w-8 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Loading application dossier...
      </div>
    );
  }

  const handleStageChange = async (newStage: string) => {
    setRejectingApp(true);
    try {
      const updated = await applicationService.updateApplicationStage(application.id, newStage as ApplicationStage);
      setApplication(prev => prev ? { ...prev, stage: updated.stage } : null);
    } catch (err) {
      console.error(err);
    } finally {
      setRejectingApp(false);
    }
  };

  const handleSaveNote = () => {
    if (newNote.trim()) {
      setSavingNote(true);
      setNotes([...notes, newNote.trim()]);
      // Should ideally hit an update application api here to persist the note
      setNewNote('');
      setSavingNote(false);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          Applications <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong>{application.candidate.fullName}</strong>
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
            className="select max-w-37.5 animate-none"
            value={application.stage}
            onChange={(e) => handleStageChange(e.target.value)}
          >
            <option value="APPLIED">Applied</option>
            <option value="SCREENING">Screening</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </header>

      <section className="content">
        <div className="decision-layout">
          <section className="card pad" aria-label="Candidate overview">
            <div className="candidate-hero">
              <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '22px' }}>
                {application.candidate.fullName.charAt(0)}
              </div>
              <div>
                <h1>{application.candidate.fullName}</h1>
                <p>
                  {application.candidate.email} · {application.candidate.phone || 'N/A'}
                </p>
                <div className="job-meta mt-2.5 flex gap-2 flex-wrap">
                  <Badge variant={application.stage.toLowerCase() as any}>{application.stage}</Badge>
                  <span className="chip">{application.job?.title || 'Unknown Job'}</span>
                  <span className="chip">Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
              {/* Fake AI Score since it's not currently in the DB model */}
              <span className={`score high`} style={{ width: '64px', height: '64px', fontSize: '18px' }}>
                92
              </span>
            </div>

            <div className="signal-grid">
              <div className="signal-card">
                <strong>Primary fit</strong>
                <p>Strong match based on requirements for {application.job?.title || 'the role'}.</p>
              </div>
              <div className="signal-card">
                <strong>Decision need</strong>
                <p>Validate technical depth.</p>
              </div>
              <div className="signal-card">
                <strong>Status</strong>
                <p>{application.status}</p>
              </div>
              <div className="signal-card">
                <strong>Next step</strong>
                <p>Schedule screen.</p>
              </div>
            </div>

            <div className="card pad decision-summary" style={{ marginTop: '16px' }}>
              <span className="chip ai-chip">AI ✦ Decision summary</span>
              <h2 style={{ marginTop: '12px' }}>Recommend advancing to next stage.</h2>
              <p style={{ marginTop: '8px', color: 'var(--text-2)' }}>
                {application.candidate.resumeText ? application.candidate.resumeText.substring(0, 150) + '...' : 'Candidate shows promising background based on application metadata.'}
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
                    {/* Fake scorecard for UI */}
                    <div className="score-row">
                      <span>Experience</span>
                      <div className="score-bar">
                        <span style={{ width: '90%' }}></span>
                      </div>
                      <strong>90</strong>
                    </div>
                    <div className="score-row">
                      <span>Skills match</span>
                      <div className="score-bar">
                        <span style={{ width: '85%' }}></span>
                      </div>
                      <strong>85</strong>
                    </div>
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="list">
                     <p>
                      <strong>Resume Text:</strong><br/>
                      {application.candidate.resumeText || 'No resume text available.'}
                    </p>
                    {application.candidate.linkedinUrl && (
                      <p>
                        <strong>LinkedIn:</strong> <a href={application.candidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{application.candidate.linkedinUrl}</a>
                      </p>
                    )}
                    {application.cvFileUrl && (
                       <p>
                       <strong>CV Document:</strong> <a href={application.cvFileUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View File</a>
                     </p>
                    )}
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
                      {notes.length === 0 && <div className="text-gray-400 text-sm">No notes yet.</div>}
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
                      disabled={savingNote}
                      onClick={handleSaveNote}
                    >
                      {savingNote ? 'Saving...' : 'Save note'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="card pad" aria-label="AI evidence">
            <div className="page-head" style={{ marginBottom: '12px' }}>
              <div>
                <h2>Application Info</h2>
                <p>Status: {application.status}</p>
              </div>
            </div>
             <div className="list">
                <p><strong>Job Applied For:</strong> {application.job?.title || 'Unknown'}</p>
                <p><strong>Applied Date:</strong> {new Date(application.appliedAt).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(application.updatedAt).toLocaleString()}</p>
             </div>
          </section>

          <aside className="card pad" aria-label="Actions">
            <h2>Actions</h2>

            <div className="list mt-4">
              <button className="btn primary" style={{ width: '100%', cursor: 'pointer' }} onClick={() => setIsScheduleModalOpen(true)}>
                Schedule Interview
              </button>
              {application.cvFileUrl && (
                <button className="btn secondary" style={{ width: '100%', cursor: 'pointer' }} onClick={() => window.open(application.cvFileUrl)}>
                  View CV
                </button>
              )}
              <button
                className="btn danger"
                style={{ width: '100%', cursor: 'pointer' }}
                disabled={rejectingApp}
                onClick={() => handleStageChange('REJECTED')}
              >
                {rejectingApp ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </aside>
        </div>
      </section>

      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onInterviewScheduled={() => {
           // Optionally refetch application details or show success toast
        }}
      />
    </>
  );
}
