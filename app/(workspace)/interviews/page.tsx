'use client';

import React, { useState, useEffect } from 'react';
import { interviewService } from '../../../services/api/interview.service';
import { Interview } from '../../../types';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/badge';
import ScheduleInterviewModal from '../../../components/features/interviews/ScheduleInterviewModal';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form states for the "Feedback" mock block
  const [techDepth, setTechDepth] = useState('Strong hire');
  const [confidence, setConfidence] = useState('High');
  const [evidence, setEvidence] = useState(
    'Candidate explained component migration tradeoffs and named rollout risks clearly.'
  );
  const [successMsg, setSuccessMsg] = useState('');

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const res = await interviewService.getInterviews({ limit: 20 });
      setInterviews(res.data);
    } catch (e) {
      console.error('Failed to load interviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Feedback submitted successfully!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const formatDuration = (mins: number) => {
     const h = Math.floor(mins / 60);
     const m = mins % 60;
     if (h > 0 && m > 0) return `${h}h ${m}m`;
     if (h > 0) return `${h}h`;
     return `${m}m`;
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Interviews</strong>
        </div>
        <button className="btn primary" onClick={() => setIsScheduleModalOpen(true)} style={{ cursor: 'pointer' }}>
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

        {loading ? (
           <LoadingSkeleton type="card" count={3} />
        ) : interviews.length > 0 ? (
          <div className="grid-3">
             {interviews.map(interview => (
                <div key={interview.id} className="card pad">
                  <div className="flex justify-between items-start mb-2">
                     <span className={`badge ${interview.status === 'COMPLETED' ? 'hired' : 'interview'}`}>
                       {new Date(interview.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                     </span>
                     <Badge variant={interview.status.toLowerCase() as any}>{interview.status}</Badge>
                  </div>
                  <h3 style={{ marginTop: '12px' }}>
                    {interview.application?.candidate?.fullName || 'Unknown Candidate'} · {interview.type.replace('_', ' ')}
                  </h3>
                  <p className="text-sm mt-1 text-gray-600">
                    {interview.application?.job?.title || 'Unknown Role'} · Interviewer: {interview.interviewer?.fullName || 'System'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Duration: {formatDuration(interview.duration)} {interview.location && `· ${interview.location}`}
                  </p>

                  <button className="btn primary mt-4 w-full" style={{ cursor: 'pointer' }}>
                    {interview.status === 'COMPLETED' ? 'Review feedback' : 'Open interview pack'}
                  </button>
                </div>
             ))}
          </div>
        ) : (
          <EmptyState
             title="No interviews scheduled"
             description="There are currently no upcoming interviews. Schedule one from the candidate pipeline."
             action={{ label: 'Schedule Interview', onClick: () => setIsScheduleModalOpen(true) }}
          />
        )}

        <form className="card pad" style={{ marginTop: '18px' }} onSubmit={handleSubmitFeedback}>
          <h2>Structured Feedback (Example)</h2>
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

      <ScheduleInterviewModal
         isOpen={isScheduleModalOpen}
         onClose={() => setIsScheduleModalOpen(false)}
         onInterviewScheduled={() => loadInterviews()}
      />
    </>
  );
}
