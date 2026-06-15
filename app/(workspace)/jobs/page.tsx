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

          // Sort locally if needed, though backend should handle this ideally
          if (sortBy === "newest") {
            list.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
          } else if (sortBy === "oldest") {
            list.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
          } else if (sortBy === "apps") {
            list.sort(
              (a, b) =>
                (b._count?.applications ?? 0) - (a._count?.applications ?? 0),
            );
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
    setPage(1); // Reset page on filter change
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
      <header className="topbar flex items-center justify-between">
        <div className="crumb flex items-center gap-2">
          <span>
            {activeWorkspace?.name ?? 'Workspace'} <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong>Jobs</strong>
          </span>
          {isFetching && (
            <svg
              className="animate-spin h-4 w-4 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
        </div>
        <button className="btn primary" onClick={() => openModal("create-job")}>
          Create Job
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Jobs</h1>
            <p>
              Manage active requisitions, stage velocity, and applicant volume.
            </p>
          </div>
          <div className="flex bg-surface-2 p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === "table" ? "bg-surface shadow-sm text-primary" : "text-text-3 hover:text-text-1"}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === "grid" ? "bg-surface shadow-sm text-primary" : "text-text-3 hover:text-text-1"}`}
            >
              Grid
            </button>
          </div>
        </div>

        <div className="job-toolbar">
          <input
            className="input"
            type="text"
            placeholder="Search jobs, departments, locations"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="select animate-none"
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
            className="select animate-none"
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
          <button
            className="btn secondary"
            onClick={handleClearFilters}
            style={{ cursor: "pointer" }}
          >
            Clear
          </button>
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
              <div className="grid-3">
                {jobs.map((job) => (
                  <article
                    key={job.id}
                    className="card job-card interactive"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <div className="page-head" style={{ margin: 0 }}>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <Badge
                        variant={
                          job.status.toLowerCase() as BadgeProps["variant"]
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="job-meta">
                      <span className="chip">{job.location}</span>
                      <span className="chip">
                        {formatEmploymentType(job.employmentType)}
                      </span>
                      <span className="chip">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                    </div>
                    <p className="text-xs text-text-3">
                      {(job._count?.applications || 0) > 0
                        ? `${job._count?.applications} applicants · owned by ${job.createdBy?.fullName || "System"}`
                        : "Draft waiting on compensation approval and interview panel."}
                    </p>
                    <div className="pipeline-dots">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={idx < 2 ? "filled" : ""} // Mocking filled pipelines for UI sake
                        />
                      ))}
                    </div>
                    <div className="page-head mt-4" style={{ margin: 0 }}>
                      <Link
                        className="text-primary font-extrabold hover:underline"
                        href={`/jobs/${job.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                      </Link>
                      <button
                        className="btn ghost h-8 w-8 p-0"
                        aria-label="More job actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ⋯
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="card table-wrap overflow-hidden">
                <table className="density-tight">
                  <thead>
                    <tr className="bg-surface-2/50 border-b border-border">
                      <th className="pl-4 w-10">
                        <input
                          type="checkbox"
                          className="rounded border-border text-primary focus:ring-primary"
                          checked={
                            selectedIds.size === jobs.length && jobs.length > 0
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Job Title</th>
                      <th>Status</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>Salary Range</th>
                      <th>Apps</th>
                      <th className="pr-4 text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className={`group cursor-pointer ${selectedIds.has(job.id) ? "bg-primary-soft/30" : ""}`}
                        onClick={() =>
                          router.push(`/jobs/${job.id}`)
                        }
                      >
                        <td
                          className="pl-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="rounded border-border text-primary focus:ring-primary"
                            checked={selectedIds.has(job.id)}
                            onChange={() => toggleSelect(job.id)}
                          />
                        </td>
                        <td className="font-bold text-text-1 group-hover:text-primary transition-colors">
                          {job.title}
                        </td>
                        <td>
                          <Badge
                            variant={
                              job.status.toLowerCase() as BadgeProps["variant"]
                            }
                          >
                            {job.status}
                          </Badge>
                        </td>
                        <td>{job.department}</td>
                        <td>{job.location}</td>
                        <td className="text-text-3">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </td>
                        <td>
                          <span className="font-bold text-text-2">
                            {job._count?.applications || 0}
                          </span>
                        </td>
                        <td className="pr-4 text-right text-text-4 font-medium">
                          {new Date(job.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn secondary disabled:opacity-50 disabled:cursor-not-allowed"
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
            description="Clear the search or create a new requisition with a calibrated AI score rubric."
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
            onClick: () => {
              alert(`Closing ${selectedIds.size} jobs`);
              setSelectedIds(new Set());
            },
            variant: "danger",
          },
          {
            label: "Export Data",
            onClick: () => {
              alert(`Exporting ${selectedIds.size} jobs`);
              setSelectedIds(new Set());
            },
            variant: "secondary",
          },
        ]}
      />

      <CreateJobModal
        onJobCreated={() => {
          // Reload logic
          setPage(1);
          setSearch("");
          setStatus("all");
          // the useEffect will trigger loadAndSort automatically
        }}
      />
    </>
  );
}
