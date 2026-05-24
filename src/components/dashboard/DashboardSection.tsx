'use client';

import { ReactNode } from 'react';

interface DashboardSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  subtitle,
  children,
  className = '',
}: DashboardSectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {(title || subtitle) && (
        <div>
          {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
          {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}
