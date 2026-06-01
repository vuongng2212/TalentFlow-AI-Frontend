import React from 'react';

interface LoadingSkeletonProps {
  type?: 'row' | 'card' | 'text' | 'table';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({ type = 'text', count = 1, className = '' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return (
          <div className={`space-y-4 ${className}`}>
            <div className="h-8 bg-surface-2 rounded-md w-full animate-pulse" />
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-2 rounded-md w-full animate-pulse opacity-60" />
            ))}
          </div>
        );
      case 'card':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="card p-4 h-48 bg-surface animate-pulse" />
            ))}
          </div>
        );
      case 'row':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-16 bg-surface-2 rounded-lg w-full animate-pulse" />
            ))}
          </div>
        );
      case 'text':
      default:
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-4 bg-surface-2 rounded w-full animate-pulse" />
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
}
