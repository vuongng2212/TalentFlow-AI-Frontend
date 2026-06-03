'use client';

import React, { useState, useEffect } from 'react';
import { applicationService } from '../../../services/api/application.service';
import { Application, ApplicationStage } from '../../../types';
import FilterCenter from '../../../components/features/candidates/FilterCenter';
import KanbanBoard from '../../../components/features/candidates/KanbanBoard';
import CandidateDossier from '../../../components/features/candidates/CandidateDossier';
import Badge from '../../../components/ui/badge';
import FilterChips from '../../../components/ui/FilterChips';
import BulkActionBar from '../../../components/ui/BulkActionBar';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import { useRouter } from 'next/navigation';
import UploadCvModal from '../../../components/features/candidates/UploadCvModal';
import { useModalStore } from '../../../lib/store/useModalStore';
import { useApplicationsStore } from '../../../lib/store/useApplicationsStore';
import { useAuth } from '../../../components/features/workspace/RoleContext';
import { useUIStore } from '../../../lib/store/useUIStore';
import { useMinDuration } from '../../../hooks/useMinDuration';

export default function ApplicationsPage() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  // Zustand applications store variables
  const filters = useApplicationsStore((state) => state.filters);
  const pagination = useApplicationsStore((state) => state.pagination);
  const viewMode = useApplicationsStore((state) => state.viewMode);
  const selectedIds = useApplicationsStore((state) => state.selectedIds);

  const setFilters = useApplicationsStore((state) => state.setFilters);
  const setPage = useApplicationsStore((state) => state.setPage);
  const setViewMode = useApplicationsStore((state) => state.setViewMode);
  const toggleSelectId = useApplicationsStore((state) => state.toggleSelectId);
  const setSelectedIds = useApplicationsStore((state) => state.setSelectedIds);
  const clearSelection = useApplicationsStore((state) => state.clearSelection);
  const minDur = useMinDuration();

  // Pagination (For list view)
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (isBackground = false) => {
    if (!isBackground) { minDur.start(); setLoading(true); }
    else setIsFetching(true);

    try {
       const queryStage = filters.stage === 'all' ? undefined : (filters.stage.toUpperCase() as ApplicationStage);
       const response = await applicationService.getApplications({
         page: pagination.page,
         limit: viewMode === 'kanban' ? 100 : 10,
         stage: queryStage
       });

       let filtered = response.data;
       if (filters.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(app =>
             app.candidate?.fullName.toLowerCase().includes(s) ||
             app.job?.title?.toLowerCase().includes(s)
          );
       }
       setApplications(filtered);
       setTotalPages(response.meta.totalPages);
    } catch (e) {
       console.error("Failed to fetch applications", e);
    } finally {
       if (!isBackground) minDur.end(() => setLoading(false));
       setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    let ignore = false;
    const timer = setTimeout(() => {
      if (!ignore) loadData(false);
    }, 0);

    const onFocus = () => {
      if (!ignore) loadData(true);
    };

    window.addEventListener('focus', onFocus);

    return () => {
      ignore = true;
      clearTimeout(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [filters.search, filters.stage, filters.minScore, pagination.page, viewMode, isAuthLoading, isAuthenticated]);

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length && applications.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map(a => a.id));
    }
  };

  const handleDropCandidate = async (appId: string, newStage: string) => {
    try {
      const updated = await applicationService.updateApplicationStage(appId, newStage as ApplicationStage);

      // Optimistic update
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, stage: updated.stage } : a));

      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication(prev => prev ? { ...prev, stage: updated.stage } : null);
      }
    } catch (err) {
      console.error(err);
      loadData(false); // reload to revert on error
    }
  };

  const handleBulkStageChange = async (newStage: string) => {
    setLoading(true);
    await Promise.all(selectedIds.map(id => applicationService.updateApplicationStage(id, newStage as ApplicationStage)));
    await loadData(false);
    clearSelection();
  };

  // UI Map Application to Legacy Candidate UI structure where needed
  const mapToKanbanItem = (app: Application) => ({
      id: app.id,
      name: app.candidate?.fullName || 'Unknown',
      title: app.job?.title || 'Unknown Job',
      avatar: app.candidate?.fullName?.charAt(0) || '?',
      stage: app.stage.toLowerCase() as 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected',
      score: 85,
      scoreCategory: 'high' as const,
      skills: [],
      appliedDate: new Date(app.appliedAt).toLocaleDateString(),
      email: app.candidate?.email || '',
      summary: app.notes || '',
      timeline: [],
      scorecard: []
  });

  return (
    <>
      <header className="topbar flex items-center justify-between">
        <div className="crumb flex items-center gap-2">
          <span>TalentFlow / <strong>Applications Pipeline</strong></span>
          {isFetching && (
            <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
        <button className="btn primary" onClick={() => openModal('upload-cv')} style={{ cursor: 'pointer' }}>
          Upload CV
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Applications</h1>
            <p>Filter and move active candidates across role pipelines.</p>
          </div>
          <div className="flex bg-surface-2 p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-surface shadow-sm text-primary' : 'text-text-3 hover:text-text-1'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-surface shadow-sm text-primary' : 'text-text-3 hover:text-text-1'}`}
            >
              List
            </button>
          </div>
        </div>

        <FilterCenter />

        <FilterChips />

        {loading ? (
          <LoadingSkeleton type={viewMode === 'list' ? 'table' : 'card'} count={6} />
        ) : applications.length > 0 ? (
          <>
            <div className="card pad" style={{ marginBottom: '16px' }}>
              <div className="flex justify-between items-center mb-2">
                <strong className="text-sm">Pipeline Distribution</strong>
                <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest">{applications.length} Total</span>
              </div>
              <div className="job-meta">
                <span className="badge applied">Applied {applications.filter((a) => a.stage === 'APPLIED').length}</span>
                <span className="badge screening">Screening {applications.filter((a) => a.stage === 'SCREENING').length}</span>
                <span className="badge interview">Interview {applications.filter((a) => a.stage === 'INTERVIEW').length}</span>
                <span className="badge offer">Offer {applications.filter((a) => a.stage === 'OFFER').length}</span>
                <span className="badge hired">Hired {applications.filter((a) => a.stage === 'HIRED').length}</span>
                <span className="badge rejected">Rejected {applications.filter((a) => a.stage === 'REJECTED').length}</span>
              </div>
            </div>

            <div className="card overflow-hidden">
              {viewMode === 'kanban' ? (
                <KanbanBoard
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  candidates={applications.map(mapToKanbanItem) as any}
                  onSelect={(c) => {
                     const realApp = applications.find(a => a.id === c.id);
                     if (realApp) router.push(`/candidates/${realApp.id}`);
                  }}
                  onDropCandidate={(id, stage) => handleDropCandidate(id, stage.toUpperCase())}
                />
              ) : (
                <div className="table-wrap">
                  <table className="density-tight">
                    <thead>
                      <tr className="bg-surface-2/50 border-b border-border">
                        <th className="pl-4 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-border text-primary focus:ring-primary"
                            checked={selectedIds.length === applications.length && applications.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>Candidate</th>
                        <th>Applied For</th>
                        <th>Status</th>
                        <th>Stage</th>
                        <th className="pr-4 text-right">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className={`group cursor-pointer ${selectedIds.includes(app.id) ? 'bg-primary-soft/30' : ''}`}
                          onClick={() => router.push(`/candidates/${app.id}`)}
                        >
                          <td className="pl-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary"
                              checked={selectedIds.includes(app.id)}
                              onChange={() => toggleSelectId(app.id)}
                            />
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar sm w-6 h-6 text-[10px]">{app.candidate?.fullName?.charAt(0) || '?'}</div>
                              <span className="font-bold text-text-1 group-hover:text-primary transition-colors">{app.candidate?.fullName || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="text-text-2">{app.job?.title || 'Unknown Role'}</td>
                          <td>
                            <span className={`text-xs`}>{app.status}</span>
                          </td>
                          <td>
                            <Badge variant={app.stage.toLowerCase() as 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'}>{app.stage}</Badge>
                          </td>
                          <td className="pr-4 text-right text-text-4 font-medium">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-border bg-surface">
                      <div className="text-sm text-gray-500">
                        Page {pagination.page} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPage(Math.max(1, pagination.page - 1))}
                          disabled={pagination.page === 1}
                          className="btn secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setPage(Math.min(totalPages, pagination.page + 1))}
                          disabled={pagination.page === totalPages}
                          className="btn secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            title="No applications found"
            description="Adjust your filters to see active candidates."
            action={{ label: 'Clear all filters', onClick: () => setFilters({ search: '', stage: 'all', minScore: 0 }) }}
          />
        )}
      </section>

      {selectedApplication && (
        <CandidateDossier
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}

      <BulkActionBar
        actions={[
          {
            label: 'Move to Interview',
            onClick: () => handleBulkStageChange('INTERVIEW'),
            variant: 'primary'
          },
          {
            label: 'Reject',
            onClick: () => handleBulkStageChange('REJECTED'),
            variant: 'danger'
          }
        ]}
      />

      <UploadCvModal
         onUploadSuccess={() => {
            setPage(1);
            setFilters({ search: '', stage: 'all', minScore: 0 });
         }}
      />
    </>
  );
}
