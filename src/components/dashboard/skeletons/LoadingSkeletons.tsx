'use client';

export function MetricCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-32 mb-4"></div>
      <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-40"></div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-800">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 animate-pulse space-y-4">
      <div className="h-6 bg-gray-700 rounded w-40"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
      ))}
    </div>
  );
}
