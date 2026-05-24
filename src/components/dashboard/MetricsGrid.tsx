'use client';

import { ReactNode } from 'react';

interface MetricsGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function MetricsGrid({ children, columns = 4 }: MetricsGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridClasses[columns]}`}>
      {children}
    </div>
  );
}
