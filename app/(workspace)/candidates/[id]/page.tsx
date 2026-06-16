'use client';

import React, { useState, useEffect } from 'react';
import { applicationService } from '../../../../services/api/application.service';
import { Application, ApplicationStage } from '../../../../types';
import Badge, { BadgeProps } from '../../../../components/ui/badge';
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
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
  const { showLoading, hideLoading } = useUIStore();
  const minDur = useMinDuration();
  const [notes, setNotes] = useState<string[]>([]);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Unwrap params client-side
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
            setNotes([app.notes]);
          }
        }
        minDur.end(() => {});
      } catch (e) {
        console.error("Failed to load application", e);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unwrappedParams]);

  if (!application || !application.candidate) {
    return (
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="h-32 rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 animate-pulse" />
          <div className="h-96 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 animate-pulse" />
        </div>
      </div>
    );
  }

  const handleStageChange = async (newStage: string) => {
    setRejectingApp(true);
    showLoading('Updating stage...');
    try {
      const updated = await applicationService.updateApplicationStage(application.id, newStage as ApplicationStage);
      setApplication(prev => prev ? { ...prev, stage: updated.stage } : null);
      setConfirmRejectOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      hideLoading();
      setRejectingApp(false);
    }
  };

  const handleSaveNote = () => {
    if (newNote.trim()) {
      setSavingNote(true);
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
      setSavingNote(false);
    }
  };

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400 font-medium">
          Applications <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">{application.candidate.fullName}</strong>
        </div>
        <div className="flex gap-2">
          <button
            className="btn secondary text-xs h-8 px-3 cursor-pointer"
            onClick={() => setActiveTab('notes')}
          >
            Add Note
          </button>
          <select
            className="px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 font-bold"
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

      <section className="content bg-noise">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Content Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-black flex items-center justify-center text-xl shrink-0">
                    {application.candidate.fullName.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50">{application.candidate.fullName}</h1>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 tabular-data">
                      {application.candidate.email} · {application.candidate.phone || 'N/A'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant={application.stage.toLowerCase() as BadgeProps['variant']}>{application.stage}</Badge>
                      <span className="chip text-[10px] py-0.5 px-2 bg-slate-50 dark:bg-zinc-800">{application.job?.title || 'Unknown Job'}</span>
                      <span className="chip text-[10px] py-0.5 px-2 bg-slate-50 dark:bg-zinc-800 tabular-data">
                        Applied {new Date(application.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 px-4 py-2.5 rounded-2xl shrink-0 self-start sm:self-center">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">AI Diagnostics</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-data">92%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 dark:border-zinc-800 pt-6 mb-6">
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800/50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Primary Fit</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Excellent Match</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800/50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Decision Need</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Verify System Work</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800/50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Current Status</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate block">{application.status}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800/50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Next Step</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Schedule Technical Screen</span>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/20 dark:bg-indigo-950/10 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                    AI Decision Summary
                  </span>
                </div>
                <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed mt-1">
                  Recommend advancing to next stage. {application.candidate.resumeText ? application.candidate.resumeText.substring(0, 250) + '...' : 'Candidate shows promising background based on application metadata.'}
                </p>
              </div>
            </div>

            <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none">
              <div className="tabs border-b border-slate-100 dark:border-zinc-800 pb-px mb-6 flex gap-4">
                <button
                  className={`tab pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`tab pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${activeTab === 'resume' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'}`}
                  onClick={() => setActiveTab('resume')}
                >
                  Resume Text
                </button>
                <button
                  className={`tab pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${activeTab === 'notes' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'}`}
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                </button>
              </div>

              <div className="tab-panel active">
                {activeTab === 'overview' && (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                        <span className="font-semibold text-slate-500 dark:text-zinc-400 w-32 shrink-0">Experience Score</span>
                        <div className="flex-1 bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mx-4">
                          <div className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full" style={{ width: '90%' }} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-zinc-100 tabular-data w-8 text-right">90%</span>
                      </div>

                      <div className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-zinc-800/50 pb-2">
                        <span className="font-semibold text-slate-500 dark:text-zinc-400 w-32 shrink-0">Skills Diagnostic</span>
                        <div className="flex-1 bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mx-4">
                          <div className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full" style={{ width: '85%' }} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-zinc-100 tabular-data w-8 text-right">85%</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-slate-50 dark:bg-zinc-800/30 p-4 border border-slate-100 dark:border-zinc-800/50 rounded-xl max-h-96 overflow-y-auto font-mono text-xs text-slate-700 dark:text-zinc-300 leading-relaxed text-pretty whitespace-pre-wrap">
                      {application.candidate.resumeText || 'No resume text extracted.'}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      {application.candidate.linkedinUrl && (
                        <a
                          href={application.candidate.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn secondary text-xs flex-1 cursor-pointer"
                        >
                          LinkedIn Profile
                        </a>
                      )}
                      {application.cvFileUrl && (
                        <a
                          href={application.cvFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn secondary text-xs flex-1 cursor-pointer"
                        >
                          Download CV Document
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                      {notes.map((note, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-zinc-800/40 p-3.5 border border-slate-100 dark:border-zinc-800/60 rounded-xl text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                          {note}
                        </div>
                      ))}
                      {notes.length === 0 && <div className="text-slate-400 dark:text-zinc-500 text-xs italic">No private recruiter comments added.</div>}
                    </div>
                    <textarea
                      className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-xs h-24 resize-none"
                      placeholder="Add private note regarding candidate screen panel"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button
                      className="btn primary text-xs h-9 self-end cursor-pointer"
                      disabled={savingNote}
                      onClick={handleSaveNote}
                    >
                      {savingNote ? 'Saving...' : 'Add Note'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="flex flex-col gap-6">
            <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80">
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
                Application Info
              </h2>
              <div className="flex flex-col gap-3.5 text-xs text-slate-600 dark:text-zinc-400">
                <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                  <span className="font-semibold text-slate-500 dark:text-zinc-500">Job Position</span>
                  <span className="text-slate-900 dark:text-zinc-200">{application.job?.title || 'Unknown'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                  <span className="font-semibold text-slate-500 dark:text-zinc-500">Workflow State</span>
                  <span className="text-slate-900 dark:text-zinc-200">{application.status}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                  <span className="font-semibold text-slate-500 dark:text-zinc-500">Applied Date</span>
                  <span className="text-slate-900 dark:text-zinc-200 tabular-data">
                    {new Date(application.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500 dark:text-zinc-500">Last Updated</span>
                  <span className="text-slate-900 dark:text-zinc-200 tabular-data">
                    {new Date(application.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 flex flex-col gap-3">
              <button className="btn primary text-xs h-9 cursor-pointer w-full" onClick={() => setIsScheduleModalOpen(true)}>
                Schedule Interview
              </button>
              {application.cvFileUrl && (
                <button className="btn secondary text-xs h-9 cursor-pointer w-full" onClick={() => window.open(application.cvFileUrl)}>
                  View Original CV
                </button>
              )}
              <button
                className="btn danger text-xs h-9 cursor-pointer w-full"
                disabled={rejectingApp || application.stage === 'REJECTED'}
                onClick={() => setConfirmRejectOpen(true)}
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
        onInterviewScheduled={() => {}}
      />

      {/* Reject Confirmation Dialog */}
      {confirmRejectOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 animate-fade-in-up">
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              Reject Application
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to reject <strong className="text-slate-900 dark:text-zinc-100 font-bold">{application.candidate.fullName}</strong>? This will transition their stage to Rejected and trigger the rejection notification template.
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                className="btn secondary text-xs h-9 cursor-pointer"
                onClick={() => setConfirmRejectOpen(false)}
                disabled={rejectingApp}
              >
                Keep Active
              </button>
              <button
                className="btn danger text-xs h-9 cursor-pointer"
                onClick={() => handleStageChange('REJECTED')}
                disabled={rejectingApp}
              >
                {rejectingApp ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
