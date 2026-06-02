import React, { useState } from 'react';
import Link from 'next/link';
import { Application } from '../../../types';
import Badge from '../../ui/badge';

interface ApplicationDossierProps {
  application: Application;
  onClose: () => void;
  onStageChange?: (id: string, stage: string) => void;
}

export const CandidateDossier: React.FC<ApplicationDossierProps> = ({
  application,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'timeline'>('overview');
  const [newNote, setNewNote] = useState('');
  // In a real scenario, notes would be array fetched from backend timeline
  const [notes, setNotes] = useState<string[]>(application.notes ? [application.notes] : []);

  const handleSaveNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  const candidate = application.candidate;

  if (!candidate) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex justify-end bg-text-1/20 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl h-full bg-surface border-l border-border overflow-y-auto p-8 shadow-modal transition-transform duration-300 transform translate-x-0 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
          <div className="crumb">
            Applications / <strong>{candidate.fullName}</strong>
          </div>
          <button
            className="btn ghost h-10 w-10 p-0 rounded-full"
            onClick={onClose}
            aria-label="Close dossier"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1">
          <section className="card pad shadow-sm bg-white" aria-label="Candidate overview">
            <div className="candidate-hero flex items-center gap-5">
              <div className="avatar w-16 h-16 text-xl shadow-ai bg-primary-soft text-primary font-extrabold rounded-full flex items-center justify-center">
                {candidate.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black tracking-tight text-text-1">{candidate.fullName}</h1>
                  <span className={`score high w-14 h-14 text-lg font-black`}>
                    92
                  </span>
                </div>
                <p className="text-sm font-medium text-text-3 mt-1">
                  {candidate.email} · {candidate.phone || 'N/A'}
                </p>
                <div className="job-meta mt-3 flex flex-wrap gap-2">
                  <Badge variant={application.stage.toLowerCase()}>{application.stage}</Badge>
                  <span className="chip text-[11px] font-bold">{application.job?.title}</span>
                  <span className="chip text-[11px] font-bold">Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="signal-card p-4 border border-border rounded-xl bg-surface-2/30">
                <strong className="text-[10px] uppercase tracking-widest text-text-4 block mb-2">Primary fit</strong>
                <p className="text-sm font-bold text-text-2 leading-tight">Strong match for the requirements of {application.job?.title}.</p>
              </div>
              <div className="signal-card p-4 border border-border rounded-xl bg-surface-2/30">
                <strong className="text-[10px] uppercase tracking-widest text-text-4 block mb-2">Decision need</strong>
                <p className="text-sm font-bold text-text-2 leading-tight">Technical depth validation.</p>
              </div>
              <div className="signal-card p-4 border border-border rounded-xl bg-surface-2/30">
                <strong className="text-[10px] uppercase tracking-widest text-text-4 block mb-2">Status</strong>
                <p className="text-sm font-bold text-text-2 leading-tight">{application.status}</p>
              </div>
              <div className="signal-card p-4 border border-border rounded-xl bg-surface-2/30">
                <strong className="text-[10px] uppercase tracking-widest text-text-4 block mb-2">Next step</strong>
                <p className="text-sm font-bold text-text-2 leading-tight">Schedule screening interview.</p>
              </div>
            </div>

            <div className="card pad decision-summary mt-8 p-5 rounded-2xl border-none">
              <span className="chip ai-chip">AI ✦ Decision summary</span>
              <h2 className="text-lg font-black mt-3 text-text-1 leading-tight">Recommend advancing to next stage.</h2>
              <p className="text-sm mt-3 text-text-2 leading-relaxed font-medium">
                Candidate shows promising background based on application metadata and parsed resume information.
              </p>
            </div>

            <div className="mt-10">
              <div className="tabs flex gap-8 border-b border-border">
                <button
                  className={`tab px-0 pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'overview' ? 'active text-primary border-primary' : 'text-text-4 border-transparent hover:text-text-2'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Assessment Overview
                </button>
                <button
                  className={`tab px-0 pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'resume' ? 'active text-primary border-primary' : 'text-text-4 border-transparent hover:text-text-2'}`}
                  onClick={() => setActiveTab('resume')}
                >
                  Resume Details
                </button>
                <button
                  className={`tab px-0 pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'timeline' ? 'active text-primary border-primary' : 'text-text-4 border-transparent hover:text-text-2'}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  Activity & Notes
                </button>
              </div>

              <div className="mt-6">
                {activeTab === 'overview' && (
                  <div className="scorecard space-y-5">
                      <div className="grid grid-cols-[140px_1fr_40px] items-center gap-6">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-3">Experience</span>
                        <div className="score-bar h-2.5 bg-surface-2 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="bg-linear-to-r from-ai to-primary h-full rounded-full shadow-ai"
                            style={{ width: `90%` }}
                          />
                        </div>
                        <strong className="text-sm font-black text-right text-text-1">90</strong>
                      </div>
                      <div className="grid grid-cols-[140px_1fr_40px] items-center gap-6">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-3">Skills Match</span>
                        <div className="score-bar h-2.5 bg-surface-2 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="bg-linear-to-r from-ai to-primary h-full rounded-full shadow-ai"
                            style={{ width: `85%` }}
                          />
                        </div>
                        <strong className="text-sm font-black text-right text-text-1">85</strong>
                      </div>
                  </div>
                )}

                {activeTab === 'resume' && (
                  <div className="space-y-4 text-sm font-medium text-text-2">
                     <p>
                        <strong>Resume Text:</strong><br/>
                        {candidate.resumeText || 'No resume text available.'}
                      </p>
                      {candidate.linkedinUrl && (
                        <p>
                          <strong>LinkedIn:</strong> <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{candidate.linkedinUrl}</a>
                        </p>
                      )}
                      {application.cvFileUrl && (
                        <p>
                        <strong>CV Document:</strong> <a href={application.cvFileUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View File</a>
                      </p>
                      )}
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-8">
                    <div className="timeline pl-2 border-l-2 border-surface-2 ml-1">
                        <div className="relative pl-6 pb-6 last:pb-0">
                          <span className="absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-white border-2 border-primary shadow-ai" />
                          <div className="text-sm">
                            <strong className="text-text-1 block font-extrabold">Application Submitted</strong>
                            <p className="text-text-4 text-[11px] font-bold mt-1">
                              System · {new Date(application.appliedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-text-4 mb-4">Collaborative Notes</h3>
                      <div className="space-y-3 mb-4">
                        {notes.map((note, idx) => (
                          <div key={idx} className="bg-primary-soft/30 p-4 rounded-xl text-sm text-text-2 font-bold border border-primary/10 animate-in fade-in slide-in-from-left-2 duration-300">
                            {note}
                          </div>
                        ))}
                        {notes.length === 0 && <div className="text-gray-400 text-sm">No notes yet.</div>}
                      </div>
                      <div className="field">
                        <textarea
                          className="textarea w-full p-4 border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 bg-white"
                          placeholder="Type an internal note for the hiring team..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <button
                          className="btn primary px-6 py-2 h-10 text-xs font-black shadow-ai mt-3 self-start"
                          onClick={handleSaveNote}
                        >
                          Post Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-surface pt-6 pb-2 border-t border-border mt-auto flex gap-4">
          <Link
            href={`/candidates/${application.id}`}
            className="btn primary flex-1 text-center h-12 text-sm font-black justify-center shadow-ai"
          >
            Open Full Evaluation Profile
          </Link>
          <button
            className="btn secondary h-12 px-6 font-bold"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDossier;