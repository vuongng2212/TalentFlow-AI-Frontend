'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { interviewService } from '../../../services/api/interview.service';
import { Interview, InterviewStatus } from '../../../types';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import Badge, { BadgeProps } from '../../../components/ui/badge';
import Modal from '../../../components/ui/dialog/Modal';
import ScheduleInterviewModal from '../../../components/features/interviews/ScheduleInterviewModal';
import { useMinDuration } from '../../../hooks/useMinDuration';
import { useUIStore } from '../../../lib/store/useUIStore';
import { toast } from 'sonner';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Selected Interview for Detail / Feedback Modal
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackRating, setFeedbackRating] = useState('STRONG_HIRE');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  // Delete / Cancel Confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const minDur = useMinDuration();
  const { showLoading, hideLoading } = useUIStore();

  const loadInterviews = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        minDur.start();
        setLoading(true);
      }
      try {
        const res = await interviewService.getInterviews({ limit: 50 });
        setInterviews(res.data);
      } catch (e) {
        console.error('Failed to load interviews', e);
        toast.error('Failed to load interviews');
      } finally {
        if (!isBackground) {
          minDur.end(() => setLoading(false));
        }
      }
    },
    [minDur]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInterviews(false);
  }, [loadInterviews]);

  const handleOpenDetailModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setFeedbackNotes(interview.notes || '');
  };

  const handleUpdateStatus = async (status: InterviewStatus) => {
    if (!selectedInterview) return;
    showLoading(`Updating interview status to ${status}...`);
    try {
      const updated = await interviewService.updateInterview(selectedInterview.id, { status });
      setSelectedInterview(updated);
      toast.success(`Interview marked as ${status}`);
      await loadInterviews(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e.response?.data?.message || e.message || 'Failed to update interview status');
    } finally {
      hideLoading();
    }
  };

  const handleSaveFeedback = async () => {
    if (!selectedInterview) return;
    setIsSavingFeedback(true);
    showLoading('Saving feedback notes...');
    try {
      const updated = await interviewService.updateInterview(selectedInterview.id, {
        notes: feedbackNotes,
      });
      setSelectedInterview(updated);
      toast.success('Interview feedback saved successfully');
      await loadInterviews(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e.response?.data?.message || e.message || 'Failed to save feedback');
    } finally {
      hideLoading();
      setIsSavingFeedback(false);
    }
  };

  const handleDeleteInterview = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    showLoading('Cancelling interview...');
    try {
      await interviewService.deleteInterview(confirmDeleteId);
      toast.success('Interview cancelled and removed');
      setConfirmDeleteId(null);
      if (selectedInterview?.id === confirmDeleteId) {
        setSelectedInterview(null);
      }
      await loadInterviews(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e.response?.data?.message || e.message || 'Failed to cancel interview');
    } finally {
      hideLoading();
      setIsDeleting(false);
    }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'COMPLETED':
        return 'hired';
      case 'CONFIRMED':
      case 'IN_PROGRESS':
        return 'interview';
      case 'SCHEDULED':
        return 'applied';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'rejected';
      default:
        return 'applied';
    }
  };

  const filteredInterviews = interviews.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (typeFilter !== 'all' && i.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const candName = i.application?.candidate?.fullName?.toLowerCase() || '';
      const jobTitle = i.application?.job?.title?.toLowerCase() || '';
      const interviewerName = i.interviewer?.fullName?.toLowerCase() || '';
      return candName.includes(q) || jobTitle.includes(q) || interviewerName.includes(q);
    }
    return true;
  });

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          TalentFlow <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Interviews</strong>
        </div>
        <button
          className="btn primary text-xs px-3 py-1.5 cursor-pointer"
          onClick={() => setIsScheduleModalOpen(true)}
        >
          Schedule Interview
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Interview Queue</h1>
            <p>Track scheduled rounds, join meetings, and record structured evaluation feedback.</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="toolbar flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            type="text"
            placeholder="Search candidate, job, or interviewer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select animate-none sm:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            className="select animate-none sm:w-44"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="TECHNICAL">Technical</option>
            <option value="VIDEO">Video</option>
            <option value="PHONE">Phone</option>
            <option value="IN_PERSON">In Person</option>
            <option value="PANEL">Panel</option>
          </select>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : filteredInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                className="card pad border border-slate-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => handleOpenDetailModal(interview)}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {new Date(interview.scheduledAt).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    <Badge variant={getStatusBadgeVariant(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100 mt-2">
                    {interview.application?.candidate?.fullName || 'Candidate'} · {interview.type.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
                    {interview.application?.job?.title || 'General Pipeline'} · {interview.interviewer?.fullName || 'Lead Recruiter'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2 flex items-center gap-1.5">
                    <span>⏱ {formatDuration(interview.duration)}</span>
                    {interview.location && <span>· 📍 {interview.location}</span>}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {interview.status === 'COMPLETED' ? 'Review feedback →' : 'View session pack →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No interviews found"
            description="There are currently no interviews matching your active filters. Schedule a new interview to get started."
            action={{ label: 'Schedule Interview', onClick: () => setIsScheduleModalOpen(true) }}
          />
        )}
      </section>

      {/* Interview Detail & Feedback Modal */}
      <Modal
        isOpen={!!selectedInterview}
        onClose={() => setSelectedInterview(null)}
        title={
          selectedInterview
            ? `${selectedInterview.application?.candidate?.fullName || 'Candidate'} — ${selectedInterview.type.replace('_', ' ')} Round`
            : 'Interview Details'
        }
      >
        {selectedInterview && (
          <div className="p-6 space-y-6">
            {/* Summary Header */}
            <div className="bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Role: <span className="font-normal">{selectedInterview.application?.job?.title || 'Open Role'}</span>
                </div>
                <Badge variant={getStatusBadgeVariant(selectedInterview.status)}>
                  {selectedInterview.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                <div>🗓 <strong>Time:</strong> {new Date(selectedInterview.scheduledAt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</div>
                <div>⏱ <strong>Duration:</strong> {formatDuration(selectedInterview.duration)}</div>
                <div>👤 <strong>Interviewer:</strong> {selectedInterview.interviewer?.fullName || 'Assigned Lead'}</div>
                <div>📍 <strong>Location / Link:</strong> {selectedInterview.location || 'Remote Video Room'}</div>
              </div>
            </div>

            {/* Quick Status Transitions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                Update Interview Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as InterviewStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`btn text-xs px-3 py-1 cursor-pointer transition-colors ${
                      selectedInterview.status === st
                        ? 'primary'
                        : 'border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                    onClick={() => handleUpdateStatus(st)}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Structured Feedback & Notes Form */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Evaluation Feedback & Notes
                </label>
                <select
                  className="select text-xs py-1 px-2 animate-none"
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                >
                  <option value="STRONG_HIRE">Strong Hire</option>
                  <option value="HIRE">Hire</option>
                  <option value="NEUTRAL">Neutral / Hold</option>
                  <option value="NO_HIRE">No Hire</option>
                </select>
              </div>

              <textarea
                className="textarea w-full text-sm"
                rows={4}
                placeholder="Write evidence-based candidate assessment, architecture decisions discussed, strengths, and concerns..."
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="btn text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1 rounded cursor-pointer"
                  onClick={() => setConfirmDeleteId(selectedInterview.id)}
                >
                  Cancel Interview
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn cursor-pointer"
                    onClick={() => setSelectedInterview(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn primary cursor-pointer"
                    onClick={handleSaveFeedback}
                    disabled={isSavingFeedback}
                  >
                    {isSavingFeedback ? 'Saving...' : 'Save Feedback'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete / Cancel Modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Cancel Interview Schedule"
      >
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Are you sure you want to cancel and remove this scheduled interview round?
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              className="btn cursor-pointer"
              onClick={() => setConfirmDeleteId(null)}
              disabled={isDeleting}
            >
              Keep Schedule
            </button>
            <button
              type="button"
              className="btn danger cursor-pointer"
              onClick={handleDeleteInterview}
              disabled={isDeleting}
            >
              {isDeleting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>

      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onInterviewScheduled={() => loadInterviews(true)}
      />
    </>
  );
}
