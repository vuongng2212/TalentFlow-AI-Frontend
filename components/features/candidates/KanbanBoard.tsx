import React, { useState } from 'react';
import KanbanCard from './KanbanCard';

interface KanbanBoardProps {
  candidates: any[];
  onSelect: (candidate: any) => void;
  onDropCandidate: (id: string, stage: string) => void;
}

interface Column {
  key: string;
  label: string;
  badgeClass: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onSelect,
  onDropCandidate,
}) => {
  const columns: Column[] = [
    { key: 'applied', label: 'Applied', badgeClass: 'applied' },
    { key: 'screening', label: 'Screening', badgeClass: 'screening' },
    { key: 'interview', label: 'Interview', badgeClass: 'interview' },
    { key: 'offer', label: 'Offer', badgeClass: 'offer' },
    { key: 'hired', label: 'Hired', badgeClass: 'hired' },
    { key: 'rejected', label: 'Rejected', badgeClass: 'rejected' },
  ];

  const [activeDropCol, setActiveDropCol] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    setActiveDropCol(colKey);
  };

  const handleDragLeave = () => {
    setActiveDropCol(null);
  };

  const handleDrop = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    setActiveDropCol(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onDropCandidate(id, colKey);
    }
  };

  return (
    <div className="kanban">
      {columns.map((column) => {
        const colCandidates = candidates.filter((c) => c.stage === column.key);

        return (
          <div
            key={column.key}
            className={`kanban-column ${activeDropCol === column.key ? 'drop' : ''}`}
            onDragOver={(e) => handleDragOver(e, column.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            <div className="kanban-head">
              {column.label}{' '}
              <span className={`badge ${column.badgeClass}`} data-count>
                {colCandidates.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 min-h-[450px]">
              {colCandidates.map((cand) => (
                <KanbanCard
                  key={cand.id}
                  candidate={cand}
                  onSelect={onSelect}
                  onDragStart={handleDragStart}
                />
              ))}
              {colCandidates.length === 0 && (
                <div className="text-center text-xs text-gray-400 py-8 border border-dashed border-gray-200 rounded-lg">
                  Drop candidates here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
