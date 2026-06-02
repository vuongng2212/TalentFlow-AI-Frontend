'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [activeTab, setActiveTab] = useState<'kanban' | 'list'>('list');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const router = useRouter();

  // Pagination (For list view)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (ignoreFlag: boolean) => {
    setLoading(true);
    try {
       // Need to fetch Applications, not Candidates for the Kanban board
       const queryStage = stage === 'all' ? undefined : (stage.toUpperCase() as ApplicationStage);
       const response = await applicationService.getApplications({
         page,
         limit: activeTab === 'kanban' ? 100 : 10, // Load more for kanban to show columns
         stage: queryStage
       });

       if (!ignoreFlag) {
          // Client-side search for now since backend might not support deep search on candidate name
          let filtered = response.data;
          if (search) {
             const s = search.toLowerCase();
             filtered = filtered.filter(app =>
                app.candidate?.fullName.toLowerCase().includes(s) ||
                app.job?.title?.toLowerCase().includes(s)
             );
          }
          setApplications(filtered);
          setTotalPages(response.meta.totalPages);
       }
    } catch (e) {
       console.error("Failed to fetch applications", e);
    } finally {
       if (!ignoreFlag) setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    loadData(ignore);
    return () => { ignore = true; };
  }, [search, stage, minScore, page, activeTab]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (search) filters.push({ id: 'search', label: 'Search', value: search });
    if (stage !== 'all') filters.push({ id: 'stage', label: 'Stage', value: stage.toUpperCase() });
    if (minScore > 0) filters.push({ id: 'score', label: 'Min Score', value: minScore.toString() });
    return filters;
  }, [search, stage, minScore]);

  const handleRemoveFilter = (id: string) => {
    if (id === 'search') setSearch('');
    if (id === 'stage') setStage('all');
    if (id === 'score') setMinScore(0);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStage('all');
    setMinScore(0);
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(applications.map(a => a.id)));
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
    await Promise.all(Array.from(selectedIds).map(id => applicationService.updateApplicationStage(id, newStage as ApplicationStage)));
    await loadData(false);
    setSelectedIds(new Set());
  };


  // UI Map Application to Legacy Candidate UI structure where needed
  const mapToKanbanItem = (app: Application) => ({
      id: app.id, // Using Application ID for drag/drop
      name: app.candidate?.fullName || 'Unknown',
      title: app.job?.title || 'Unknown Job',
      avatar: app.candidate?.fullName?.charAt(0) || '?',
      stage: app.stage.toLowerCase() as any,
      score: 85, // Mock score for now
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
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Applications Pipeline</strong>
        </div>
        <button className="btn primary" onClick={() => setIsUploadModalOpen(true)} style={{ cursor: 'pointer' }}>
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
              onClick={() => { setActiveTab('kanban'); setPage(1); }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeTab === 'kanban' ? 'bg-surface shadow-sm text-primary' : 'text-text-3 hover:text-text-1'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => { setActiveTab('list'); setPage(1); }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-surface shadow-sm text-primary' : 'text-text-3 hover:text-text-1'}`}
            >
              List
            </button>
          </div>
        </div>

        <FilterCenter
          search={search}
          onSearchChange={setSearch}
          stage={stage}
          onStageChange={setStage}
          minScore={minScore}
          onMinScoreChange={setMinScore}
        />

        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />

        {loading ? (
          <LoadingSkeleton type={activeTab === 'list' ? 'table' : 'card'} count={6} />
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
              {activeTab === 'kanban' ? (
                <KanbanBoard
                  candidates={applications.map(mapToKanbanItem)} // Map Applications to the structure KanbanBoard expects
                  onSelect={(c) => {
                     // Since kanban clicks return mapped candidate, we find the real app
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
                            checked={selectedIds.size === applications.length && applications.length > 0}
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
                          className={`group cursor-pointer ${selectedIds.has(app.id) ? 'bg-primary-soft/30' : ''}`}
                          onClick={() => router.push(`/candidates/${app.id}`)}
                        >
                          <td className="pl-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary"
                              checked={selectedIds.has(app.id)}
                              onChange={() => toggleSelect(app.id)}
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
                            <Badge variant={app.stage.toLowerCase()}>{app.stage}</Badge>
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
                        Page {page} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="btn secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
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
            action={{ label: 'Clear all filters', onClick: handleClearFilters }}
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
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
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
         isOpen={isUploadModalOpen}
         onClose={() => setIsUploadModalOpen(false)}
         onUploadSuccess={() => {
            setPage(1);
            setStage('all');
            setSearch('');
            // useEffect will re-fetch automatically
         }}
      />
    </>
  );
}
