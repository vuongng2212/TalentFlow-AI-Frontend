import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string;
}

export default function EmptyState({ title, description, action, icon = '∅' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center card bg-surface-2/50 border-dashed">
      <div className="w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center text-2xl mb-4 text-text-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-text-1">{title}</h3>
      <p className="text-text-3 mt-2 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          className="btn primary mt-6"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
