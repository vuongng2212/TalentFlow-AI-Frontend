import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-white/90 dark:bg-zinc-950/90 border border-slate-200/60 dark:border-zinc-800/60 backdrop-blur-xl rounded-2xl shadow-2xl w-full ${sizeClasses} max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)] relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Micro-noise overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.012] dark:opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

        <div className="flex justify-between items-center p-5 border-b border-slate-100/80 dark:border-zinc-800/60 relative z-10">
          <h2 className="text-lg font-bold font-jakarta text-slate-900 dark:text-zinc-50 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100/80 dark:hover:bg-zinc-850"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
