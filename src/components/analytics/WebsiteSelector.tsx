'use client';

import { ChevronDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Website } from '@/hooks/useAnalytics';

interface WebsiteSelectorProps {
  websites: Website[];
  selectedWebsite: Website | null;
  onSelectWebsite: (website: Website) => void;
  loading?: boolean;
}

export function WebsiteSelector({
  websites,
  selectedWebsite,
  onSelectWebsite,
}: WebsiteSelectorProps) {
  const getStatusIcon = (website: Website) => {
    if (website.metrics_collection_status === 'active') {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    } else if (website.metrics_collection_status === 'failed') {
      return <AlertCircle className="h-4 w-4 text-red-400" />;
    } else {
      return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (website: Website) => {
    if (website.metrics_collection_status === 'active') {
      return 'Active';
    } else if (website.metrics_collection_status === 'failed') {
      return 'Failed';
    } else {
      return 'Pending';
    }
  };

  if (websites.length === 0) {
    return (
      <div className="p-4 bg-gray-950 border border-gray-800 rounded">
        <p className="text-gray-400 text-sm">No websites added yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Select Website</label>
      <div className="relative">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-950 border border-gray-800 rounded hover:border-gray-700 transition-colors text-left">
          <div className="flex-1">
            {selectedWebsite ? (
              <div className="space-y-1">
                <p className="text-white font-medium">{selectedWebsite.name}</p>
                <p className="text-gray-400 text-sm">{selectedWebsite.domain}</p>
              </div>
            ) : (
              <p className="text-gray-400">Choose a website...</p>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
        </button>

        {/* Dropdown menu - would use a proper menu component in real app */}
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
          {websites.map((website) => (
            <button
              key={website.id}
              onClick={() => onSelectWebsite(website)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0 flex items-center gap-3 ${
                selectedWebsite?.id === website.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="flex-1">
                <p className="text-white font-medium">{website.name}</p>
                <p className="text-gray-400 text-xs">{website.domain}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusIcon(website)}
                <span className="text-xs text-gray-400">{getStatusText(website)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
