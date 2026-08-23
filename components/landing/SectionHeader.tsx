import React from 'react';
import { SectionHeaderProps } from './types';

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  chip,
  title,
  subtitle,
  centered = false,
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}`}>
      {chip && (
        <div className={`mb-4 ${centered ? 'flex justify-center' : 'inline-flex'}`}>
          <span className="chip ai-chip">{chip}</span>
        </div>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
