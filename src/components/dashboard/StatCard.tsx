'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number | null;
  change?: number | null;
  icon: ReactNode;
  isLoading?: boolean;
  error?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  isLoading = false,
  error,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-40"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-red-500/20 rounded-xl p-6">
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const isPositive = change ? change >= 0 : true;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value !== null ? value.toLocaleString() : '-'}</p>
          {change !== null && change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span>{isPositive ? '↑' : '↓'} {Math.abs(change)}%</span>
              <span className="text-gray-400">vs last week</span>
            </div>
          )}
        </div>
        <div className="text-blue-400 opacity-70">{icon}</div>
      </div>
    </div>
  );
}
