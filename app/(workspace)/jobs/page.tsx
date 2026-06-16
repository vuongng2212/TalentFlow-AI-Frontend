"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { jobService } from "../../../services/api/job.service";
import { Job } from "../../../types";
import Badge from "../../../components/ui/badge";
import type { BadgeProps } from "../../../components/ui/badge";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import EmptyState from "../../../components/ui/EmptyState";
import FilterChips from "../../../components/ui/FilterChips";
import BulkActionBar from "../../../components/ui/BulkActionBar";

import CreateJobModal from "../../../components/features/jobs/CreateJobModal";
import { useModalStore } from "../../../lib/store/useModalStore";
import { useAuth } from "../../../components/features/workspace/RoleContext";
import { useMinDuration } from "../../../hooks/useMinDuration";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const { isLoading: isAuthLoading, isAuthenticated, activeWorkspace } = useAuth();
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { start: startMinDuration, end: endMinDuration } = useMinDuration();
  const debouncedSearch = useDebouncedValue(search, 250);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Custom confirmation dialog state
  const [confirmBulkAction, setConfirmBulkAction] = useState<string | null>(null);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && !max) return `$${min.toLocaleString()}+`;
    if (!min && max) return `Up to $${max.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  const formatEmploymentType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    let ignore = false;

    const loadAndSort = async (isBackground = false) => {
      if (!isBackground) {
        startMinDuration();
        setLoading(true);
      } else setIsFetching(true);

      try {
        const queryStatus = status === "all" ? undefined : status.toUpperCase();

        const response = await jobService.getJobs({
          search: debouncedSearch || undefined,
          status: queryStatus,
          page,
          limit: 10,
        });

        if (!ignore) {
          const list = [...response.data];

          // Sort locally
          if (sortBy === "newest") {
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          } else if (sortBy === "oldest") {
            list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          } else if (sortBy === "apps") {
            list.sort((a, b) => (b._count?.applications ?? 0) - (a._count?.applications ?? 0));
          }

          setJobs(list);
          setTotalPages(response.meta.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        if (!ignore) {
          if (!isBackground) endMinDuration(() => setLoading(false));
          setIsFetching(false);
        }
      }
    };

    loadAndSort();

    const onFocus = () => {
      loadAndSort(true);
    };

    window.addEventListener("focus", onFocus);

    return () => {
      ignore = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [
    debouncedSearch,
    status,
    sortBy,
    page,
    isAuthLoading,
    isAuthenticated,
    startMinDuration,
    endMinDuration,
    refreshKey,
  ]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (search) filters.push({ id: "search", label: "Search", value: search });
    if (status !== "all")
      filters.push({
        id: "status",
        label: "Status",
        value: status.toUpperCase(),
      });
    return filters;
  }, [search, status]);

  const handleRemoveFilter = (id: string) => {
    if (id === "search") setSearch("");
    if (id === "status") setStatus("all");
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("newest");
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === jobs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(jobs.map((j) => j.id)));
    }
  };

  return (
    <>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          {activeWorkspace?.name ?? 'Workspace'} <span className="mx-2 text-slate-300 dark:text-zinc-700">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">Jobs</strong>
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
        <button className="btn primary text-xs h-8 px-3 cursor-pointer" onClick={() => openModal("create-job")}>
          Create Job
        </button>
      </header>

      <section className="content bg-noise">
        <div className="page-head mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Jobs</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Manage active requisitions, applicant volume, and pipeline stages.
            </p>
          </div>
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg border border-slate-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === "table" ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100"}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === "grid" ? "bg-white dark:bg-zinc-900 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100"}`}
            >
              Grid View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
          <input
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 sm:col-span-2 text-sm"
            type="text"
            placeholder="Search jobs, departments, locations"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <select
            className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-sm"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="newest">Newest first</option>
            <option value="apps">Most applications</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />

        {loading ? (
          <LoadingSkeleton
            type={viewMode === "table" ? "table" : "card"}
            count={6}
          />
        ) : jobs.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {jobs.map((job) => (
                  <article
                    key={job.id}
                    className="card interactive p-6 bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none cursor-pointer flex flex-col justify-between"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50 truncate max-w-[70%]" title={job.title}>
                          {job.title}
                        </h3>
                        <Badge variant={job.status.toLowerCase() as BadgeProps["variant"]}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="chip text-[10px] font-medium py-0.5 px-2 bg-slate-50 dark:bg-zinc-800">{job.location}</span>
                        <span className="chip text-[10px] font-medium py-0.5 px-2 bg-slate-50 dark:bg-zinc-800">
                          {formatEmploymentType(job.employmentType)}
                        </span>
                        <span className="chip text-[10px] font-medium py-0.5 px-2 bg-slate-50 dark:bg-zinc-800 tabular-data">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                        {(job._count?.applications || 0) > 0
                          ? `${job._count?.applications} applicant(s) · owned by ${job.createdBy?.fullName || "System"}`
                          : "Draft waiting on compensation approval and interview panel."}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-slate-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
                        View Details
                      </span>
                      <button
                        className="btn ghost h-7 w-7 p-0 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer text-slate-500"
                        aria-label="More job actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/jobs/${job.id}`);
                        }}
                      >
                        ⋯
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="card bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden relative z-10">
                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-zinc-800">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-zinc-800/50">
                        <th className="pl-4 w-10 py-3">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            checked={selectedIds.size === jobs.length && jobs.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Job Title</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Status</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Department</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Location</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Salary Range</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-center">Apps</th>
                        <th className="pr-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 text-right">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {jobs.map((job) => (
                        <tr
                          key={job.id}
                          className={`group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors duration-150 ${selectedIds.has(job.id) ? "bg-indigo-50/20 dark:bg-indigo-950/10" : ""}`}
                          onClick={() => router.push(`/jobs/${job.id}`)}
                        >
                          <td
                            className="pl-4 py-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                              checked={selectedIds.has(job.id)}
                              onChange={() => toggleSelect(job.id)}
                            />
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                            {job.title}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={job.status.toLowerCase() as BadgeProps["variant"]}
                            >
                              {job.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">{job.department}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">{job.location}</td>
                          <td className="px-4 py-3 text-sm text-slate-500 dark:text-zinc-400 tabular-data">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex tabular-data items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                              {job._count?.applications || 0}
                            </span>
                          </td>
                          <td className="pr-4 py-3 text-right text-xs text-slate-400 dark:text-zinc-500 font-medium tabular-data">
                            {new Date(job.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-xs text-slate-500 dark:text-zinc-400">
                  Page <span className="font-bold tabular-data">{page}</span> of <span className="font-bold tabular-data">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn secondary text-xs h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn secondary text-xs h-8 px-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No roles match these filters"
            description="Clear the search or create a new job requisition."
            action={{ label: "Clear filters", onClick: handleClearFilters }}
          />
        )}
      </section>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        actions={[
          {
            label: "Close Positions",
            onClick: () => setConfirmBulkAction('close'),
            variant: "danger",
          },
          {
            label: "Export Data",
            onClick: () => setConfirmBulkAction('export'),
            variant: "secondary",
          },
        ]}
      />

      <CreateJobModal
        onJobCreated={() => {
          setPage(1);
          setSearch("");
          setStatus("all");
          setRefreshKey(prev => prev + 1);
        }}
      />

      {/* Bulk Action Confirmation Dialog */}
      {confirmBulkAction && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 animate-fade-in-up">
            <h3 className="font-jakarta text-lg font-bold text-slate-900 dark:text-zinc-50">
              {confirmBulkAction === 'close' ? 'Close Positions' : 'Export Job Data'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              {confirmBulkAction === 'close'
                ? `Are you sure you want to close the ${selectedIds.size} selected positions? This will mark all candidates as closed-archive.`
                : `Export metadata and applicant count for the ${selectedIds.size} selected jobs? This will download a CSV report.`}
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                className="btn secondary text-xs h-9 cursor-pointer"
                onClick={() => setConfirmBulkAction(null)}
              >
                Cancel
              </button>
              <button
                className={`btn text-xs h-9 cursor-pointer ${confirmBulkAction === 'close' ? 'danger' : 'primary'}`}
                onClick={() => {
                  alert(confirmBulkAction === 'close' ? `Closed ${selectedIds.size} jobs` : `Exported data for ${selectedIds.size} jobs`);
                  setSelectedIds(new Set());
                  setConfirmBulkAction(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
