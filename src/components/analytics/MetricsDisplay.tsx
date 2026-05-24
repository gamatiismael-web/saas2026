'use client';

import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { WebsiteMetrics } from '@/hooks/useAnalytics';
import { formatDistanceToNow } from 'date-fns';

interface MetricsDisplayProps {
  metrics: WebsiteMetrics[];
  loading: boolean;
  isSyncing: boolean;
  lastUpdated: string | null;
  onRefresh: () => void;
  hasEnoughData: boolean;
}

export function MetricsDisplay({
  metrics,
  loading,
  isSyncing,
  lastUpdated,
  onRefresh,
  hasEnoughData,
}: MetricsDisplayProps) {
  if (!hasEnoughData) {
    return (
      <div className="bg-gray-950 border border-gray-800 rounded p-8 text-center">
        <p className="text-gray-400 mb-4">
          Waiting for data from your website tracking script...
        </p>
        <p className="text-sm text-gray-500">
          Make sure you've installed the tracking script and visited your website.
          Data usually appears within a few minutes.
        </p>
        <Button onClick={onRefresh} className="mt-4" disabled={isSyncing}>
          {isSyncing ? 'Syncing...' : 'Check for Updates'}
        </Button>
      </div>
    );
  }

  const latest = metrics[0];
  const previous = metrics[1];

  const getChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return null;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-950 border border-gray-800 rounded p-4 animate-pulse h-20"
          />
        ))}
      </div>
    );
  }

  const visitorsChange = getChange(latest.visitors, previous?.visitors || latest.visitors);
  const pageviewsChange = getChange(latest.pageviews, previous?.pageviews || latest.pageviews);
  const sessionsChange = getChange(latest.sessions, previous?.sessions || latest.sessions);
  const bounceRateChange = getChange(latest.bounce_rate, previous?.bounce_rate || latest.bounce_rate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Today's Metrics</h3>
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isSyncing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors Card */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Visitors</span>
              {visitorsChange !== 0 && (
                <div className={`flex items-center gap-1 ${getTrendColor(visitorsChange)}`}>
                  {getTrendIcon(visitorsChange)}
                  <span className="text-xs font-medium">
                    {visitorsChange > 0 ? '+' : ''}{visitorsChange.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{latest.visitors.toLocaleString()}</p>
          </div>
        </Card>

        {/* Pageviews Card */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Pageviews</span>
              {pageviewsChange !== 0 && (
                <div className={`flex items-center gap-1 ${getTrendColor(pageviewsChange)}`}>
                  {getTrendIcon(pageviewsChange)}
                  <span className="text-xs font-medium">
                    {pageviewsChange > 0 ? '+' : ''}{pageviewsChange.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{latest.pageviews.toLocaleString()}</p>
          </div>
        </Card>

        {/* Sessions Card */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Sessions</span>
              {sessionsChange !== 0 && (
                <div className={`flex items-center gap-1 ${getTrendColor(sessionsChange)}`}>
                  {getTrendIcon(sessionsChange)}
                  <span className="text-xs font-medium">
                    {sessionsChange > 0 ? '+' : ''}{sessionsChange.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{latest.sessions.toLocaleString()}</p>
          </div>
        </Card>

        {/* Bounce Rate Card */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Bounce Rate</span>
              {bounceRateChange !== 0 && (
                <div className={`flex items-center gap-1 ${getTrendColor(-bounceRateChange)}`}>
                  {getTrendIcon(-bounceRateChange)}
                  <span className="text-xs font-medium">
                    {bounceRateChange > 0 ? '+' : ''}{bounceRateChange.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{latest.bounce_rate.toFixed(1)}%</p>
          </div>
        </Card>
      </div>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4">Traffic Sources</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Organic</span>
                <Badge variant="info">{latest.organic_traffic}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Direct</span>
                <Badge variant="info">{latest.direct_traffic}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Referral</span>
                <Badge variant="info">{latest.referral_traffic}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Device Distribution */}
        <Card>
          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4">Device Distribution</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Desktop</span>
                <Badge variant="success">{latest.desktop_traffic}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Mobile</span>
                <Badge variant="success">{latest.mobile_traffic}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Tablet</span>
                <Badge variant="success">{latest.tablet_traffic}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Session Duration */}
        <Card>
          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4">Engagement</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Avg. Duration</span>
                <span className="font-medium text-white">
                  {Math.floor(latest.avg_session_duration)}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Conversion Rate</span>
                <span className="font-medium text-white">
                  {latest.conversion_rate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
