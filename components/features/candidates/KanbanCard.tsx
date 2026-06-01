import React from 'react';
import Link from 'next/link';
import { Candidate } from '../../../types';
import Badge from '../../ui/badge';

interface KanbanCardProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  candidate,
  onSelect,
  onDragStart,
}) => {
  return (
    <article
      className="candidate-card"
      draggable
      onDragStart={(e) => onDragStart(e, candidate.id)}
      style={{ userSelect: 'none' }}
    >
      <div className="candidate-row">
        <div className="avatar" style={{ cursor: 'pointer' }} onClick={() => onSelect(candidate)}>
          {candidate.avatar}
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => onSelect(candidate)}>
          <strong>{candidate.name}</strong>
          <p className="text-xs">
            {candidate.title.split(' · ')[0]} ·{' '}
            <Badge variant={candidate.stage} className="text-[10px] py-0 px-1.5 font-bold">
              {candidate.stage.toUpperCase()}
            </Badge>
          </p>
        </div>
        <span className={`score sm ${candidate.scoreCategory}`}>{candidate.score}</span>
      </div>

      {candidate.skills.length > 0 && (
        <div className="skills mt-1">
          {candidate.skills.map((skill) => (
            <span key={skill} className="chip text-[10px] py-0.5 px-2">
              {skill}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Applied {candidate.appliedDate}
      </p>

      <div className="quick-actions">
        <Link href={`/candidates/${candidate.id}`} className="btn secondary text-xs min-h-[28px] py-1 px-3">
          View profile
        </Link>
        <button
          onClick={() => onSelect(candidate)}
          className="btn ghost text-xs min-h-[28px] py-1 px-3"
          style={{ cursor: 'pointer' }}
        >
          Details
        </button>
      </div>
    </article>
  );
};

export default KanbanCard;
