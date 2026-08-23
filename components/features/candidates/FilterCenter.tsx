import React, { useEffect, useState } from "react";
import { useApplicationsStore } from "../../../lib/store/useApplicationsStore";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

interface FilterCenterProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  stage?: string;
  onStageChange?: (value: string) => void;
  minScore?: number;
  onMinScoreChange?: (value: number) => void;
}

export const FilterCenter: React.FC<FilterCenterProps> = ({
  search: propSearch,
  onSearchChange: propOnSearchChange,
  stage: propStage,
  onStageChange: propOnStageChange,
  minScore: propMinScore,
  onMinScoreChange: propOnMinScoreChange,
}) => {
  const storeSearch = useApplicationsStore((state) => state.filters.search);
  const storeStage = useApplicationsStore((state) => state.filters.stage);
  const storeMinScore = useApplicationsStore((state) => state.filters.minScore);
  const setFilters = useApplicationsStore((state) => state.setFilters);

  const [searchInput, setSearchInput] = useState(storeSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 250);

  useEffect(() => {
    if (propSearch !== undefined) return;
    queueMicrotask(() => {
      setSearchInput(storeSearch);
    });
  }, [propSearch, storeSearch]);

  useEffect(() => {
    if (propOnSearchChange || propSearch !== undefined) return;
    if (debouncedSearch === storeSearch) return;
    setFilters({ search: debouncedSearch });
  }, [
    debouncedSearch,
    propOnSearchChange,
    propSearch,
    setFilters,
    storeSearch,
  ]);

  const search = propSearch !== undefined ? propSearch : searchInput;
  const stage = propStage !== undefined ? propStage : storeStage;
  const minScore = propMinScore !== undefined ? propMinScore : storeMinScore;

  const handleSearchChange =
    propOnSearchChange || ((val: string) => setSearchInput(val));
  const handleStageChange =
    propOnStageChange || ((val: string) => setFilters({ stage: val }));
  const handleMinScoreChange =
    propOnMinScoreChange || ((val: number) => setFilters({ minScore: val }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
      <input
        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 sm:col-span-2 text-sm"
        type="text"
        placeholder="Search candidate, skill, role"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <select
        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-sm"
        value={stage}
        onChange={(e) => handleStageChange(e.target.value)}
      >
        <option value="all">All stages</option>
        <option value="applied">Applied</option>
        <option value="screening">Screening</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>
      <select
        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 outline-none transition-all border-slate-200 dark:border-zinc-800 focus:border-indigo-500 text-sm"
        value={minScore}
        onChange={(e) => handleMinScoreChange(Number(e.target.value))}
      >
        <option value="0">Any AI Score</option>
        <option value="80">AI Score: 80+</option>
        <option value="60">AI Score: 60+</option>
      </select>
    </div>
  );
};

export default FilterCenter;
