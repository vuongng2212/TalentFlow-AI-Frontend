"use client";

import React, { useState, useEffect, useCallback } from "react";
import { applicationService } from "../../../services/api/application.service";
import { Application, ApplicationStage, UICandidate } from "../../../types";
import { getScoreCategory } from "../../../lib/cv";
import FilterCenter from "../../../components/features/candidates/FilterCenter";
import KanbanBoard from "../../../components/features/candidates/KanbanBoard";
import CandidateDossier from "../../../components/features/candidates/CandidateDossier";
import Badge, { BadgeProps } from "../../../components/ui/badge";
import FilterChips from "../../../components/ui/FilterChips";
import BulkActionBar from "../../../components/ui/BulkActionBar";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import EmptyState from "../../../components/ui/EmptyState";
import { useRouter } from "next/navigation";
import UploadCvModal from "../../../components/features/candidates/UploadCvModal";
import { useModalStore } from "../../../lib/store/useModalStore";
import { useApplicationsStore } from "../../../lib/store/useApplicationsStore";
import { useAuth } from "../../../components/features/workspace/RoleContext";
import { useMinDuration } from "../../../hooks/useMinDuration";

export default function ApplicationsPage() {
  const { isLoading: isAuthLoading, isAuthenticated, activeWorkspace } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

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
  const { start: startMinDuration, end: endMinDuration } = useMinDuration();

  // Pagination (For list view)
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(
    async (isBackground = false) => {
      if (!activeWorkspace?.id) return; // Must have workspace context

      if (!isBackground) {
        startMinDuration();
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      try {
        const queryStage =
          filters.stage === "all"
            ? undefined
            : (filters.stage.toUpperCase() as ApplicationStage);
        const response = await applicationService.getApplications({
          page: pagination.page,
          limit: viewMode === "kanban" ? 100 : 10,
          stage: queryStage,
        });

        let filtered = response.data;
        if (filters.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(
            (app) =>
              app.candidate?.fullName.toLowerCase().includes(s) ||
              app.job?.title?.toLowerCase().includes(s),
          );
        }
        // Client-side min-score filter (backend query has no score param yet).
        // Only applied to applications that already have a parsed score.
        if (filters.minScore > 0) {
          filtered = filtered.filter(
            (app) =>
              app.aiScore !== null &&
              app.aiScore !== undefined &&
              app.aiScore >= filters.minScore,
          );
        }
        setApplications(filtered);
        setTotalPages(response.meta.totalPages);
      } catch (e: unknown) {
        console.error("Failed to fetch applications", e);
      } finally {
        if (!isBackground) endMinDuration(() => setLoading(false));
        setIsFetching(false);
      }
    },
    [
      activeWorkspace?.id,
      endMinDuration,
      filters.search,
      filters.stage,
      filters.minScore,
      pagination.page,
      startMinDuration,
      viewMode,
    ],
  );

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || !activeWorkspace?.id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData(false);

    const onFocus = () => {
      loadData(true);
    };

    const onCvParsingDone = () => {
      // Backend finished parsing a CV → refresh the pipeline silently.
      loadData(true);
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("cv-parsing-done", onCvParsingDone);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("cv-parsing-done", onCvParsingDone);
    };
  }, [isAuthLoading, isAuthenticated, activeWorkspace?.id, loadData]);

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length && applications.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  const handleDropCandidate = async (appId: string, newStage: string) => {
    try {
      const updated = await applicationService.updateApplicationStage(
        appId,
        newStage as ApplicationStage,
      );

      // Optimistic update
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, stage: updated.stage } : a)),
      );

      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication((prev) =>
          prev ? { ...prev, stage: updated.stage } : null,
        );
      }
    } catch (err) {
      console.error(err);
      loadData(false);
    }
  };

  const handleBulkStageChange = async (newStage: string) => {
    setLoading(true);
    await Promise.all(
      selectedIds.map((id) =>
        applicationService.updateApplicationStage(
          id,
          newStage as ApplicationStage,
        ),
      ),
    );
    await loadData(false);
    clearSelection();
  };

  // UI Map Application — surfaces the REAL aiScore + cvParsingStatus from backend
  const mapToKanbanItem = (app: Application): UICandidate & { name: string; title: string; appliedDate: string; stage: string } => ({
    id: app.id,
    fullName: app.candidate?.fullName || "Unknown",
    email: app.candidate?.email || "",
    createdAt: app.candidate?.createdAt || "",
    updatedAt: app.candidate?.updatedAt || "",
    name: app.candidate?.fullName || "Unknown",
    title: app.job?.title || "Unknown Job",
    avatar: app.candidate?.fullName?.charAt(0) || "?",
    stage: app.stage.toLowerCase(),
    // Real AI score from the parser pipeline (may be undefined until parsed)
    score: app.aiScore ?? null,
    scoreCategory: getScoreCategory(app.aiScore),
    cvParsingStatus: app.cvParsingStatus,
    skills: app.parsedData?.skills ?? [],
    appliedDate: new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    summary: app.notes || "",
    timeline: [],
    scorecard: [],
  });

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          <span>
            {activeWorkspace?.name ?? 'Workspace'} <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Applications Pipeline</strong>
          </span>
          {isFetching && (
            <svg
              className="animate-spin h-4 w-4 text-primary ml-2 inline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
        </div>
        <button
          className="btn primary text-xs h-8 px-3 cursor-pointer"
          onClick={() => openModal("upload-cv")}
        >
          Upload CV
        </button>
      </header>

      <section className="content bg-noise">
        <div className="page-head mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Applications</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Move active candidates across role pipeline stages.</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg border border-slate-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === "kanban" ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100"}`}
            >
              Kanban View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100"}`}
            >
              List View
            </button>
          </div>
        </div>

        <FilterCenter />

        <FilterChips />

        {loading ? (
          <LoadingSkeleton
            type={viewMode === "list" ? "table" : "card"}
            count={6}
          />
        ) : applications.length > 0 ? (
          <>
            <div className="card p-5 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none mb-6 relative z-10">
              <div className="flex justify-between items-center mb-4">
                <strong className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Pipeline Distribution</strong>
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest tabular-data">
                  {applications.length} Total
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <span className="badge applied text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 bg-slate-50 dark:bg-zinc-800">
                  Applied <span className="ml-1 font-extrabold tabular-data text-slate-800 dark:text-zinc-300">{applications.filter((a) => a.stage === "APPLIED").length}</span>
                </span>
                <span className="badge screening text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 bg-slate-50 dark:bg-zinc-800">
                  Screening <span className="ml-1 font-extrabold tabular-data text-slate-800 dark:text-zinc-300">{applications.filter((a) => a.stage === "SCREENING").length}</span>
                </span>
                <span className="badge interview text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 bg-slate-50 dark:bg-zinc-800">
                  Interview <span className="ml-1 font-extrabold tabular-data text-slate-800 dark:text-zinc-300">{applications.filter((a) => a.stage === "INTERVIEW").length}</span>
                </span>
                <span className="badge offer text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 bg-slate-50 dark:bg-zinc-800">
                  Offer <span className="ml-1 font-extrabold tabular-data text-slate-800 dark:text-zinc-300">{applications.filter((a) => a.stage === "OFFER").length}</span>
                </span>
                <span className="badge hired text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 bg-slate-50 dark:bg-zinc-800">
                  Hired <span className="ml-1 font-extrabold tabular-data text-slate-800 dark:text-zinc-300">{applications.filter((a) => a.stage === "HIRED").length}</span>
                </span>
                <span className="badge rejected text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 bg-slate-50 dark:bg-zinc-800">
                  Rejected <span className="ml-1 font-extrabold tabular-data text-slate-800 dark:text-zinc-300">{applications.filter((a) => a.stage === "REJECTED").length}</span>
                </span>
              </div>
            </div>

            <div className="relative z-10">
              {viewMode === "kanban" ? (
                <KanbanBoard
                  candidates={applications.map(mapToKanbanItem)}
                  onSelect={(c) => {
                    const realApp = applications.find((a) => a.id === c.id);
                    if (realApp) router.push(`/candidates/${realApp.id}`);
                  }}
                  onDropCandidate={(id, stage) =>
                    handleDropCandidate(id, stage.toUpperCase())
                  }
                />
              ) : (
                <div className="card bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden">
                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-zinc-800/50">
                          <th className="pl-4 w-10 py-3">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                              checked={
                                selectedIds.length === applications.length &&
                                applications.length > 0
                              }
                              onChange={toggleSelectAll}
                            />
                          </th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Candidate</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Applied For</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Status</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Stage</th>
                          <th className="pr-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-right">Applied Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {applications.map((app) => (
                          <tr
                            key={app.id}
                            className={`group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150 ${selectedIds.includes(app.id) ? "bg-indigo-50/20 dark:bg-indigo-950/10" : ""}`}
                            onClick={() => router.push(`/candidates/${app.id}`)}
                          >
                            <td
                              className="pl-4 py-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                checked={selectedIds.includes(app.id)}
                                onChange={() => toggleSelectId(app.id)}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-bold flex items-center justify-center text-xs">
                                  {app.candidate?.fullName?.charAt(0) || "?"}
                                </div>
                                <span className="font-bold text-slate-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                                  {app.candidate?.fullName || "Unknown"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">
                              {app.job?.title || "Unknown Role"}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-slate-500 dark:text-zinc-400">{app.status}</span>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  app.stage.toLowerCase() as BadgeProps['variant']
                                }
                              >
                                {app.stage}
                              </Badge>
                            </td>
                            <td className="pr-4 py-3 text-right text-xs text-slate-400 dark:text-zinc-500 font-medium tabular-data">
                              {new Date(app.appliedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div className="text-xs text-slate-500 dark:text-zinc-400">
                          Page <span className="font-bold tabular-data">{pagination.page}</span> of <span className="font-bold tabular-data">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setPage(Math.max(1, pagination.page - 1))
                            }
                            disabled={pagination.page === 1}
                            className="btn secondary text-xs h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setPage(Math.min(totalPages, pagination.page + 1))
                            }
                            disabled={pagination.page === totalPages}
                            className="btn secondary text-xs h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            title="No applications found"
            description="Adjust your filters to see active candidates."
            action={{
              label: "Clear all filters",
              onClick: () =>
                setFilters({ search: "", stage: "all", minScore: 0 }),
            }}
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
            label: "Move to Interview",
            onClick: () => handleBulkStageChange("INTERVIEW"),
            variant: "primary",
          },
          {
            label: "Reject",
            onClick: () => handleBulkStageChange("REJECTED"),
            variant: "danger",
          },
        ]}
      />

      <UploadCvModal
        onUploadSuccess={() => {
          setPage(1);
          setFilters({ search: "", stage: "all", minScore: 0 });
        }}
      />
    </>
  );
}
