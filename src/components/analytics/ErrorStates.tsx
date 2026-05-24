'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface SyncErrorProps {
  errorMessage: string;
  onRetry: () => void;
  isRetrying?: boolean;
  syncType?: 'metrics' | 'seo' | 'health_check';
}

export function SyncError({
  errorMessage,
  onRetry,
  isRetrying = false,
  syncType = 'metrics',
}: SyncErrorProps) {
  const getSyncTypeLabel = () => {
    switch (syncType) {
      case 'seo':
        return 'SEO data collection';
      case 'health_check':
        return 'Health check';
      default:
        return 'Metrics collection';
    }
  };

  return (
    <Card className="border-red-500/30 bg-red-500/10 p-4">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-400 mb-1">
            {getSyncTypeLabel()} Failed
          </h3>
          <p className="text-red-300/80 text-sm mb-3">
            {errorMessage || 'An error occurred during data collection'}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            disabled={isRetrying}
            className="border-red-400/30 hover:border-red-400/50 hover:bg-red-500/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface NoDataStateProps {
  websiteName?: string;
  isWaiting?: boolean;
  lastAttempt?: string;
}

export function NoDataState({
  websiteName = 'website',
  isWaiting = true,
  lastAttempt,
}: NoDataStateProps) {
  return (
    <Card className="p-8 text-center">
      <div className="inline-block p-3 bg-gray-800 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {isWaiting ? 'Waiting for Data' : 'No Data Available'}
      </h3>
      <p className="text-gray-400 mb-4">
        {isWaiting
          ? `We're waiting to receive tracking data from your ${websiteName}. Make sure you've installed the tracking script and visited your website.`
          : `No metrics have been collected yet for your ${websiteName}. Please ensure the tracking script is properly installed.`}
      </p>
      {lastAttempt && (
        <p className="text-sm text-gray-500">
          Last check: {lastAttempt}
        </p>
      )}
    </Card>
  );
}

interface ConnectionQualityProps {
  status: 'excellent' | 'good' | 'poor' | 'unknown';
  lastSync: string | null;
}

export function ConnectionQuality({ status, lastSync }: ConnectionQualityProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'good':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'poor':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'excellent':
        return 'Excellent Connection';
      case 'good':
        return 'Good Connection';
      case 'poor':
        return 'Poor Connection';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className={`border rounded px-3 py-2 text-sm flex items-center justify-between ${getStatusColor()}`}>
      <span className="font-medium">{getStatusLabel()}</span>
      {lastSync && (
        <span className="text-xs opacity-75">Updated {lastSync}</span>
      )}
    </div>
  );
}
