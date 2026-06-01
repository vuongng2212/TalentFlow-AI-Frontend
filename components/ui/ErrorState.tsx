import React from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'An error occurred while loading this view.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center card border-danger/20 bg-danger/5">
      <div className="w-16 h-16 bg-white border border-danger/20 rounded-full flex items-center justify-center text-2xl mb-4 text-danger">
        !
      </div>
      <h3 className="text-lg font-bold text-text-1">Failed to load</h3>
      <p className="text-text-3 mt-2 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          className="btn secondary mt-6 border-danger/20 hover:bg-danger/10 text-danger"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
