import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'open'
    | 'closed'
    | 'draft'
    | 'applied'
    | 'screening'
    | 'interview'
    | 'offer'
    | 'hired'
    | 'rejected'
    | 'ai'
    | 'chip';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'chip',
  className = '',
}) => {
  const baseClass = variant === 'chip' ? 'chip' : 'badge';
  const variantClass = variant === 'ai' ? 'ai-chip' : variant;

  return (
    <span className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
