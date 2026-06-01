'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getCandidates, updateCandidateStage, createCandidate } from '../../../services/mockData';
import { Candidate } from '../../../types';
import FilterCenter from '../../../components/features/candidates/FilterCenter';
import KanbanBoard from '../../../components/features/candidates/KanbanBoard';
import CandidateDossier from '../../../components/features/candidates/CandidateDossier';
import Badge from '../../../components/ui/badge';
import FilterChips from '../../../components/ui/FilterChips';
import BulkActionBar from '../../../components/ui/BulkActionBar';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [activeTab, setActiveTab] = useState<'kanban' | 'list'>('list');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      const data = await getCandidates({ search, stage, minScore });
      if (!ignore) {
        setCandidates(data);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [search, stage, minScore]);

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
  };

  const handleClearFilters = () => {
    setSearch('');
    setStage('all');
    setMinScore(0);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === candidates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(candidates.map(c => c.id)));
    }
  };

  const handleDropCandidate = async (id: string, newStage: string) => {
    try {
      const updated = await updateCandidateStage(id, newStage);
      const newList = await getCandidates({ search, stage, minScore });
      setCandidates(newList);

      if (selectedCandidate && selectedCandidate.id === id) {
        setSelectedCandidate(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkStageChange = async (newStage: string) => {
    setLoading(true);
    await Promise.all(Array.from(selectedIds).map(id => updateCandidateStage(id, newStage)));
    const newList = await getCandidates({ search, stage, minScore });
    setCandidates(newList);
    setSelectedIds(new Set());
    setLoading(false);
  };

  const handleUploadCv = async () => {
    setLoading(true);
    const names = ['Aria Vance', 'Devon Patel', 'Elena Rostova', 'Marcus Aurelius', 'Li Wei'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const initials = randomName.split(' ').map(n => n[0]).join('');
    const score = Math.floor(Math.random() * 41) + 60; // 60-100

    await createCandidate({
      name: randomName,
      title: 'Frontend Engineer Lead',
      avatar: initials,
      stage: 'applied',
      score,
      skills: ['React', 'TypeScript', 'Tailwind'],
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      email: `${randomName.toLowerCase().replace(' ', '.')}@example.dev`,
      summary: `${randomName} is an experienced frontend systems builder.`,
      timeline: [
        { id: `t-${Date.now()}`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), user: 'AI System', action: 'Uploaded CV & Triage Complete', notes: `Scored ${score} rating` }
      ],
      scorecard: [
        { criteria: 'Systems depth', score },
        { criteria: 'Communication', score: 80 }
      ]
    });

    const newList = await getCandidates({ search, stage, minScore });
    setCandidates(newList);
    setLoading(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          TalentFlow / <strong>Candidates</strong>
        </div>
        <button className="btn primary" onClick={handleUploadCv} style={{ cursor: 'pointer' }}>
          Upload CV
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Candidates</h1>
            <p>Filter, score, and move active candidates across role pipelines.</p>
          </div>
          <div className="flex bg-surface-2 p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeTab === 'kanban' ? 'bg-surface shadow-sm text-primary' : 'text-text-3 hover:text-text-1'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setActiveTab('list')}
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
        ) : candidates.length > 0 ? (
          <>
            <div className="card pad" style={{ marginBottom: '16px' }}>
              <div className="flex justify-between items-center mb-2">
                <strong className="text-sm">Pipeline Distribution</strong>
                <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest">{candidates.length} Total</span>
              </div>
              <div className="job-meta">
                <span className="badge applied">Applied {candidates.filter((c) => c.stage === 'applied').length}</span>
                <span className="badge screening">Screening {candidates.filter((c) => c.stage === 'screening').length}</span>
                <span className="badge interview">Interview {candidates.filter((c) => c.stage === 'interview').length}</span>
                <span className="badge offer">Offer {candidates.filter((c) => c.stage === 'offer').length}</span>
                <span className="badge hired">Hired {candidates.filter((c) => c.stage === 'hired').length}</span>
                <span className="badge rejected">Rejected {candidates.filter((c) => c.stage === 'rejected').length}</span>
              </div>
            </div>

            <div className="card overflow-hidden">
              {activeTab === 'kanban' ? (
                <KanbanBoard
                  candidates={candidates}
                  onSelect={setSelectedCandidate}
                  onDropCandidate={handleDropCandidate}
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
                            checked={selectedIds.size === candidates.length && candidates.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>Candidate</th>
                        <th>Applied For</th>
                        <th>AI Score</th>
                        <th>Stage</th>
                        <th className="pr-4 text-right">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((cand) => (
                        <tr
                          key={cand.id}
                          className={`group cursor-pointer ${selectedIds.has(cand.id) ? 'bg-primary-soft/30' : ''}`}
                          onClick={() => setSelectedCandidate(cand)}
                        >
                          <td className="pl-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary"
                              checked={selectedIds.has(cand.id)}
                              onChange={() => toggleSelect(cand.id)}
                            />
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar sm w-6 h-6 text-[10px]">{cand.avatar}</div>
                              <span className="font-bold text-text-1 group-hover:text-primary transition-colors">{cand.name}</span>
                            </div>
                          </td>
                          <td className="text-text-2">{cand.title}</td>
                          <td>
                            <span className={`score sm ${cand.scoreCategory}`}>{cand.score}</span>
                          </td>
                          <td>
                            <Badge variant={cand.stage}>{cand.stage.toUpperCase()}</Badge>
                          </td>
                          <td className="pr-4 text-right text-text-4 font-medium">
                            {cand.appliedDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            title="No candidates found"
            description="Adjust your filters or upload more resumes to see AI-ranked matches."
            action={{ label: 'Clear all filters', onClick: handleClearFilters }}
          />
        )}
      </section>

      {selectedCandidate && (
        <CandidateDossier
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStageChange={handleDropCandidate}
        />
      )}

      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        actions={[
          {
            label: 'Move to Interview',
            onClick: () => handleBulkStageChange('interview'),
            variant: 'primary'
          },
          {
            label: 'Reject',
            onClick: () => handleBulkStageChange('rejected'),
            variant: 'danger'
          }
        ]}
      />
    </>
  );
}
