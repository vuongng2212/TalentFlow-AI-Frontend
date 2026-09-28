'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobService } from '../../../../services/api/job.service';
import { applicationService } from '../../../../services/api/application.service';
import { Job, Application, ApplicationStage } from '../../../../types';
import Badge, { BadgeProps } from '../../../../components/ui/badge';
import { useUIStore } from '../../../../lib/store/useUIStore';
import EditJobModal from '../../../../components/features/jobs/EditJobModal';
import { useModalStore } from '../../../../lib/store/useModalStore';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

const STAGES: { stage: ApplicationStage; label: string; variant: BadgeProps['variant'] }[] = [
  { stage: 'APPLIED', label: 'Applied', variant: 'applied' },
  { stage: 'SCREENING', label: 'Screening', variant: 'screening' },
  { stage: 'INTERVIEW', label: 'Interview', variant: 'interview' },
  { stage: 'OFFER', label: 'Offer', variant: 'offer' },
  { stage: 'HIRED', label: 'Hired', variant: 'hired' },
  { stage: 'REJECTED', label: 'Rejected', variant: 'rejected' },
];

export default function JobDetailPage({ params }: PageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'applicants' | 'pipeline'>('overview');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmStatusModalOpen, setConfirmStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { showLoading, hideLoading } = useUIStore();
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;

    async function loadData() {
      if (!unwrappedParams) return;
      setIsLoading(true);
      try {
        const fetchedJob = await jobService.getJobById(unwrappedParams.id);
        setJob(fetchedJob);

        const appsRes = await applicationService.getApplications({
          jobId: unwrappedParams.id,
          limit: 100,
        });
        setApplications(appsRes.data);
      } catch (e: unknown) {
        console.error('Failed to load job data', e);
        toast.error('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [unwrappedParams]);

  if (isLoading || !job) {
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

  const filteredApplications = applications.filter((app) => {
    if (stageFilter !== 'all' && app.stage !== stageFilter.toUpperCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.candidate?.fullName?.toLowerCase().includes(q) ||
        app.candidate?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && !max) return `$${min.toLocaleString()}+`;
    if (!min && max) return `Up to $${max.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  const formatEmploymentType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleToggleJobStatus = async () => {
    if (!job) return;
    const targetStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    showLoading(`${targetStatus === 'CLOSED' ? 'Closing' : 'Reopening'} job...`);
    setIsUpdatingStatus(true);
    try {
      await jobService.updateJob(job.id, { status: targetStatus });
      const fetchedJob = await jobService.getJobById(job.id);
      setJob(fetchedJob);
      setConfirmStatusModalOpen(false);
      toast.success(`Job position ${targetStatus === 'OPEN' ? 'reopened' : 'closed'} successfully`);
    } catch (e: unknown) {
      console.error(e);
      toast.error('Failed to update job status');
    } finally {
      hideLoading();
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateApplicantStage = async (appId: string, newStage: ApplicationStage) => {
    try {
      await applicationService.updateApplicationStage(appId, newStage);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
      );
      toast.success(`Applicant moved to ${newStage}`);
    } catch (e) {
      console.error('Failed to move stage', e);
      toast.error('Failed to update applicant stage');
    }
  };

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          <Link href="/jobs" className="hover:text-slate-800 dark:hover:text-zinc-200">
            Jobs
          </Link>{' '}
          <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span>{' '}
          <strong className="text-slate-900 dark:text-zinc-50 font-bold">{job.title}</strong>
        </div>
        <div className="flex gap-2">
          <button
            className="btn secondary text-xs h-8 px-3 cursor-pointer"
            onClick={() => openModal('edit-job', job)}
          >
            Edit Job
          </button>
          <button
            className={`btn text-xs h-8 px-3 cursor-pointer ${
              job.status === 'OPEN' ? 'danger' : 'primary'
            }`}
            disabled={isUpdatingStatus}
            onClick={() => setConfirmStatusModalOpen(true)}
          >
            {job.status === 'OPEN' ? 'Close Position' : 'Reopen Position'}
          </button>
        </div>
      </header>

      <section className="content grid grid-cols-1 lg:grid-cols-3 gap-8 bg-noise relative z-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="page-head mb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-3">
                {job.title}{' '}
                <Badge variant={job.status.toLowerCase() as BadgeProps['variant']}>
                  {job.status}
                </Badge>
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5">
                {job.location} · {job.department} ·{' '}
                <span className="tabular-data font-bold">
                  {job._count?.applications || applications.length}
                </span>{' '}
                applicants
              </p>
            </div>
          </div>

          <div className="card bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none p-6">
            <div className="tabs border-b border-slate-100 dark:border-zinc-800 pb-px mb-6 flex gap-4">
              <button
                className={`tab pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === 'applicants'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
                onClick={() => setActiveTab('applicants')}
              >
                Applicants ({filteredApplications.length})
              </button>
              <button
                className={`tab pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === 'pipeline'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
                onClick={() => setActiveTab('pipeline')}
              >
                Pipeline Kanban ({applications.length})
              </button>
            </div>

            <div className="tab-panel active">
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed text-pretty">
                      {job.description || 'No description provided.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                      Requirements
                    </h3>
                    <ul className="text-sm text-slate-600 dark:text-zinc-300 list-disc pl-5 flex flex-col gap-1.5">
                      {job.requirements && job.requirements.length > 0 ? (
                        job.requirements.map((req, i) => (
                          <li key={i} className="leading-relaxed">
                            {req}
                          </li>
                        ))
                      ) : (
                        <li className="list-none text-slate-400">No specific requirements listed.</li>
                      )}
                    </ul>
                  </div>

                  {/* AI Rubric section */}
                  <div className="mt-4 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/20 dark:bg-indigo-950/10 p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                        AI Rubric & Scoring Profile
                      </span>
                    </div>
                    <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed mt-1">
                      Automated parser validates uploaded CVs against job requirements, extracting key skills, years of experience, and generating a 0-100 compatibility score.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'applicants' && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-xs"
                      type="text"
                      placeholder="Search applicants by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                      className="px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-xs w-full sm:w-44"
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                    >
                      <option value="all">All stages</option>
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-zinc-800/50">
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                            Candidate
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                            AI Score
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                            Stage
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                            Applied Date
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {filteredApplications.map((app) => (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150"
                          >
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-900 dark:text-zinc-100">
                                {app.candidate?.fullName || 'Unknown Candidate'}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-zinc-400">
                                {app.candidate?.email}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {app.aiScore !== null && app.aiScore !== undefined ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                                  {app.aiScore}%
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Pending</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={app.stage.toLowerCase() as BadgeProps['variant']}>
                                {app.stage}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500 dark:text-zinc-400 tabular-data">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                href={`/candidates/${app.id}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs"
                              >
                                View Dossier →
                              </Link>
                            </td>
                          </tr>
                        ))}
                        {filteredApplications.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-8 text-sm text-slate-400 dark:text-zinc-500"
                            >
                              No applicants match these filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'pipeline' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {STAGES.map(({ stage, label, variant }) => {
                      const stageApps = applications.filter((a) => a.stage === stage);
                      return (
                        <div
                          key={stage}
                          className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-3 flex flex-col gap-2 min-h-[140px]"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <Badge variant={variant}>{label}</Badge>
                            </span>
                            <span className="text-slate-400 font-mono text-xs">
                              {stageApps.length}
                            </span>
                          </div>

                          <div className="space-y-2 overflow-y-auto max-h-[300px]">
                            {stageApps.map((a) => (
                              <div
                                key={a.id}
                                className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 p-2.5 rounded-lg shadow-xs space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <Link
                                    href={`/candidates/${a.id}`}
                                    className="font-semibold text-xs text-slate-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
                                  >
                                    {a.candidate?.fullName || 'Candidate'}
                                  </Link>
                                  {a.aiScore !== null && a.aiScore !== undefined && (
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                                      {a.aiScore}%
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-700/50 text-[10px]">
                                  <select
                                    className="select text-[10px] py-0.5 px-1.5 animate-none"
                                    value={a.stage}
                                    onChange={(e) =>
                                      handleUpdateApplicantStage(
                                        a.id,
                                        e.target.value as ApplicationStage
                                      )
                                    }
                                  >
                                    {STAGES.map((s) => (
                                      <option key={s.stage} value={s.stage}>
                                        → {s.label}
                                      </option>
                                    ))}
                                  </select>
                                  <Link
                                    href={`/candidates/${a.id}`}
                                    className="text-slate-400 hover:text-indigo-600 text-[10px]"
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            ))}

                            {stageApps.length === 0 && (
                              <div className="text-center py-4 text-[11px] text-slate-400 italic">
                                Empty
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="flex flex-col gap-6">
          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
              Job Details
            </h2>
            <div className="flex flex-col gap-3.5 text-xs text-slate-600 dark:text-zinc-400">
              <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                <span className="font-semibold text-slate-500 dark:text-zinc-500">Location</span>
                <span className="text-slate-900 dark:text-zinc-200">{job.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                <span className="font-semibold text-slate-500 dark:text-zinc-500">Type</span>
                <span className="text-slate-900 dark:text-zinc-200">
                  {formatEmploymentType(job.employmentType)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                <span className="font-semibold text-slate-500 dark:text-zinc-500">
                  Compensation
                </span>
                <span className="text-slate-900 dark:text-zinc-200 tabular-data font-bold">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                <span className="font-semibold text-slate-500 dark:text-zinc-500">Department</span>
                <span className="text-slate-900 dark:text-zinc-200">{job.department}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 dark:border-zinc-800/30 pb-2">
                <span className="font-semibold text-slate-500 dark:text-zinc-500">Hiring Owner</span>
                <span className="text-slate-900 dark:text-zinc-200">
                  {job.createdBy?.fullName || 'System'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500 dark:text-zinc-500">Opened Date</span>
                <span className="text-slate-900 dark:text-zinc-200 tabular-data">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4">
              Stage Distribution
            </h2>
            <div className="flex flex-col gap-3">
              {STAGES.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <Badge variant={item.variant}>{item.label}</Badge>
                  <span className="font-bold text-slate-900 dark:text-zinc-100 tabular-data">
                    {applications.filter((a) => a.stage === item.stage).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {job && (
        <EditJobModal
          onJobUpdated={async () => {
            setIsLoading(true);
            const fetchedJob = await jobService.getJobById(job.id);
            setJob(fetchedJob);
            setIsLoading(false);
          }}
        />
      )}

      {/* Confirmation modal for updating job status */}
      {confirmStatusModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 animate-fade-in-up">
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              {job.status === 'OPEN' ? 'Close Position' : 'Reopen Position'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              {job.status === 'OPEN'
                ? 'Are you sure you want to close this job position? New candidate applications will be paused.'
                : 'Are you sure you want to reopen this job position? It will be visible in the active pipeline.'}
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                className="btn secondary text-xs h-9 cursor-pointer"
                onClick={() => setConfirmStatusModalOpen(false)}
                disabled={isUpdatingStatus}
              >
                Cancel
              </button>
              <button
                className={`btn text-xs h-9 cursor-pointer ${
                  job.status === 'OPEN' ? 'danger' : 'primary'
                }`}
                onClick={handleToggleJobStatus}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus
                  ? 'Updating...'
                  : job.status === 'OPEN'
                    ? 'Confirm Close'
                    : 'Confirm Reopen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
