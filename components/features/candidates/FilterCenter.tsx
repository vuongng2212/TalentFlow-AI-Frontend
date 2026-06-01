import React from "react";

interface FilterCenterProps {
  search: string;
  onSearchChange: (value: string) => void;
  stage: string;
  onStageChange: (value: string) => void;
  minScore: number;
  onMinScoreChange: (value: number) => void;
}

export const FilterCenter: React.FC<FilterCenterProps> = ({
  search,
  onSearchChange,
  stage,
  onStageChange,
  minScore,
  onMinScoreChange,
}) => {
  return (
    <div className="job-toolbar">
      <input
        className="input"
        type="text"
        placeholder="Search candidate, skill, role"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="select animate-none"
        value={stage}
        onChange={(e) => onStageChange(e.target.value)}
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
        className="select animate-none"
        value={minScore}
        onChange={(e) => onMinScoreChange(Number(e.target.value))}
      >
        <option value="0">Any score</option>
        <option value="80">AI Score: 80+</option>
        <option value="60">AI Score: 60+</option>
      </select>
      <button
        className="btn secondary"
        onClick={() => {
          onSearchChange('');
          onStageChange('all');
          onMinScoreChange(0);
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default FilterCenter;
