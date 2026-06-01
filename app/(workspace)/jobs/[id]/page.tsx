'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCandidates, getJobs } from '../../../../services/mockData';
import { Candidate, Job } from '../../../../types';
import Badge from '../../../../components/ui/badge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'applicants' | 'pipeline'>('overview');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;
    async function loadData() {
      const allJobs = await getJobs();
      const currentJob = allJobs.find((j) => j.id === unwrappedParams!.id) || allJobs[0];
      setJob(currentJob);

      // Fetch candidates for this job (since all candidates in our mock are for engineering/design, we can display them accordingly)
      const allCandidates = await getCandidates();
      let jobCandidates = allCandidates;
      if (currentJob.id === 'job-1') {
        // Frontend
        jobCandidates = allCandidates.filter((c) => c.title.toLowerCase().includes('frontend'));
      } else if (currentJob.id === 'job-2') {
        // ML Platform
        jobCandidates = allCandidates.filter((c) => c.title.toLowerCase().includes('ml') || c.title.toLowerCase().includes('platform'));
      } else if (currentJob.id === 'job-3') {
        // Design Lead
        jobCandidates = allCandidates.filter((c) => c.title.toLowerCase().includes('design') || c.title.toLowerCase().includes('visual'));
      }

      setCandidates(jobCandidates);
    }
    loadData();
  }, [unwrappedParams]);

  if (!job) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-gray-500">
        Loading requisition details...
      </div>
    );
  }

  // Filter applicants
  const filteredCandidates = candidates.filter((cand) => {
    if (stageFilter !== 'all' && cand.stage !== stageFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return cand.name.toLowerCase().includes(q) || cand.skills.some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          Jobs / <strong>{job.title}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn secondary" style={{ cursor: 'pointer' }}>
            Edit
          </button>
          <button className="btn danger" style={{ cursor: 'pointer' }}>
            Close Job
          </button>
        </div>
      </header>

      <section className="content detail-layout">
        <div>
          <div className="page-head">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {job.title} <Badge variant={job.status}>{job.status.toUpperCase()}</Badge>
              </h1>
              <p className="text-gray-500 mt-1">
                {job.location} · {job.department} · {job.applicantsCount || 186} applicants
              </p>
            </div>
          </div>

          <div className="card pad">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                style={{ cursor: 'pointer' }}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === 'applicants' ? 'active' : ''}`}
                onClick={() => setActiveTab('applicants')}
                style={{ cursor: 'pointer' }}
              >
                Applicants ({filteredCandidates.length})
              </button>
              <button
                className={`tab ${activeTab === 'pipeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('pipeline')}
                style={{ cursor: 'pointer' }}
              >
                Pipeline Config
              </button>
            </div>

            <div className="tab-panel active">
              {activeTab === 'overview' && (
                <div className="grid-2">
                  <div>
                    <h3>Description</h3>
                    <p style={{ marginTop: '8px' }}>
                      Own shared infrastructure for a design-system-heavy platform. The role needs solid software
                      judgment, accessibility fluency, and a habit of shipping reusable primitives.
                    </p>
                  </div>
                  <div>
                    <h3>Requirements</h3>
                    <p style={{ marginTop: '8px' }}>
                      React, TypeScript, Next.js, component APIs, performance profiling, and evidence of mentoring
                      engineering colleagues.
                    </p>
                  </div>
                  <div>
                    <h3>Responsibilities</h3>
                    <p style={{ marginTop: '8px' }}>
                      Lead component architecture, partner with designers, improve accessibility baselines, and unblock
                      teams building complex workspace flows.
                    </p>
                  </div>
                  <div className="card pad" style={{ background: 'var(--primary-soft)' }}>
                    <span className="chip ai-chip">AI ✦ rubric</span>
                    <p style={{ marginTop: '10px', color: 'var(--text-2)' }}>
                      High-fit candidates should show reusable systems work, not only feature delivery. Penalize
                      portfolios without accessibility evidence.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'applicants' && (
                <div>
                  <div className="toolbar">
                    <input
                      className="input"
                      type="text"
                      placeholder="Search applicants"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                      className="select animate-none"
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                    >
                      <option value="all">All stages</option>
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                    </select>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>AI Score</th>
                          <th>Stage</th>
                          <th>Applied</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCandidates.map((cand) => (
                          <tr key={cand.id}>
                            <td className="font-semibold">{cand.name}</td>
                            <td>
                              <span className={`score sm ${cand.scoreCategory}`}>{cand.score}</span>
                            </td>
                            <td>
                              <Badge variant={cand.stage}>{cand.stage.toUpperCase()}</Badge>
                            </td>
                            <td>{cand.appliedDate}</td>
                            <td>
                              <Link
                                href={`/candidates/${cand.id}`}
                                className="text-purple-600 hover:underline font-semibold"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                        {filteredCandidates.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">
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
                <div className="list">
                  <div className="card pad p-4 border rounded-xl text-center bg-gray-50 text-sm font-semibold">
                    Applied → Screening → Technical Interview → Hiring Manager → Offer → Hired
                  </div>
                  <button className="btn secondary mt-4" style={{ cursor: 'pointer' }}>
                    Add Stage
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="card pad shadow-sm">
          <h2>Job Metadata</h2>
          <div className="list" style={{ marginTop: '16px' }}>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Type:</strong> {job.type}
            </p>
            <p>
              <strong>Salary:</strong>{' '}
              {job.id === 'job-1' ? '$165k–$210k' : job.id === 'job-2' ? '$150k–$190k' : job.id === 'job-3' ? '$155k–$205k' : '$75/hr'}
            </p>
            <p>
              <strong>Department:</strong> {job.department}
            </p>
            <p>
              <strong>Created by:</strong> Avery Sloan
            </p>
            <p>
              <strong>Created:</strong> May 24, 2026
            </p>
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '18px 0' }} />
          <h3>Stage Mix</h3>
          <p style={{ marginTop: '8px', fontSize: '13px' }} className="text-gray-500">
            Applied {job.applicantsCount > 0 ? 82 : 0} · Screening {job.applicantsCount > 0 ? 29 : 0} · Interview{' '}
            {job.applicantsCount > 0 ? 11 : 0} · Offer {job.applicantsCount > 0 ? 3 : 0} · Rejected{' '}
            {job.applicantsCount > 0 ? 61 : 0}
          </p>
        </aside>
      </section>
    </>
  );
}
