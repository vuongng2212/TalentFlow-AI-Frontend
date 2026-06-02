'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobService } from '../../../../services/api/job.service';
import { applicationService } from '../../../../services/api/application.service';
import { Job, Application } from '../../../../types';
import Badge from '../../../../components/ui/badge';
import LoadingSkeleton from '../../../../components/ui/LoadingSkeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

import EditJobModal from '../../../../components/features/jobs/EditJobModal';

export default function JobDetailPage({ params }: PageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'applicants' | 'pipeline'>('overview');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    params.then((p) => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const fetchedJob = await jobService.getJobById(unwrappedParams!.id);
        setJob(fetchedJob);

        // Fetch applications for this specific job
        const appsRes = await applicationService.getApplications({
            jobId: unwrappedParams!.id,
            limit: 100 // Load max for now since we don't have pagination UI in the applicants tab yet
        });
        setApplications(appsRes.data);

      } catch (e) {
          console.error("Failed to load job data", e);
      } finally {
          setIsLoading(false);
      }
    }
    loadData();
  }, [unwrappedParams]);

  if (isLoading || !job) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-gray-500">
        <LoadingSkeleton type="card" count={1} />
      </div>
    );
  }

  // Filter applicants
  const filteredApplications = applications.filter((app) => {
    if (stageFilter !== 'all' && app.stage !== stageFilter.toUpperCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return app.candidate?.fullName?.toLowerCase().includes(q) || app.candidate?.email?.toLowerCase().includes(q);
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
    return type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          Jobs / <strong>{job.title}</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn secondary" style={{ cursor: 'pointer' }} onClick={() => setIsEditModalOpen(true)}>
            Edit
          </button>
          <button className="btn danger" style={{ cursor: 'pointer' }} onClick={async () => {
             if (window.confirm('Are you sure you want to close this job?')) {
               await jobService.updateJob(job.id, { status: 'CLOSED' });
               const fetchedJob = await jobService.getJobById(job.id);
               setJob(fetchedJob);
             }
          }}>
            Close Job
          </button>
        </div>
      </header>

      <section className="content detail-layout">
        <div>
          <div className="page-head">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {job.title} <Badge variant={job.status.toLowerCase()}>{job.status}</Badge>
              </h1>
              <p className="text-gray-500 mt-1">
                {job.location} · {job.department} · {job._count?.applications || 0} applicants
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
                Applicants ({filteredApplications.length})
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
                      {job.description || 'No description provided.'}
                    </p>
                  </div>
                  <div>
                    <h3>Requirements</h3>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyleType: 'disc' }}>
                       {job.requirements && job.requirements.length > 0 ? (
                           job.requirements.map((req, i) => <li key={i} className="mb-1">{req}</li>)
                       ) : (
                           <li>No specific requirements listed.</li>
                       )}
                    </ul>
                  </div>
                  <div className="card pad col-span-2" style={{ background: 'var(--primary-soft)' }}>
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
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Status</th>
                          <th>Stage</th>
                          <th>Applied</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((app) => (
                          <tr key={app.id}>
                            <td className="font-semibold">{app.candidate?.fullName || 'Unknown'}</td>
                            <td>
                              <span className="text-xs">{app.status}</span>
                            </td>
                            <td>
                              <Badge variant={app.stage.toLowerCase()}>{app.stage}</Badge>
                            </td>
                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                            <td>
                              <Link
                                href={`/candidates/${app.id}`}
                                className="text-purple-600 hover:underline font-semibold"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                        {filteredApplications.length === 0 && (
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
                    Applied → Screening → Interview → Offer → Hired
                  </div>
                  <button className="btn secondary mt-4" style={{ cursor: 'pointer' }}>
                    Configure Stages
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
              <strong>Type:</strong> {formatEmploymentType(job.employmentType)}
            </p>
            <p>
              <strong>Salary:</strong>{' '}
              {formatSalary(job.salaryMin, job.salaryMax)}
            </p>
            <p>
              <strong>Department:</strong> {job.department}
            </p>
            <p>
              <strong>Created by:</strong> {job.createdBy?.fullName || 'System'}
            </p>
            <p>
              <strong>Created:</strong> {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '18px 0' }} />
          <h3>Stage Mix</h3>
          <p style={{ marginTop: '8px', fontSize: '13px' }} className="text-gray-500">
            {/* Real distribution would require an aggregation API, using raw counts from our fetch for now */}
            Applied {applications.filter(a => a.stage === 'APPLIED').length} ·
            Screening {applications.filter(a => a.stage === 'SCREENING').length} ·
            Interview {applications.filter(a => a.stage === 'INTERVIEW').length} ·
            Offer {applications.filter(a => a.stage === 'OFFER').length} ·
            Rejected {applications.filter(a => a.stage === 'REJECTED').length}
          </p>
        </aside>
      </section>

      {job && (
        <EditJobModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          job={job}
          onJobUpdated={async () => {
             setIsLoading(true);
             const fetchedJob = await jobService.getJobById(job.id);
             setJob(fetchedJob);
             setIsLoading(false);
          }}
        />
      )}
    </>
  );
}
