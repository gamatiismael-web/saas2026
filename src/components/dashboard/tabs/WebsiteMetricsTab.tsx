'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, TrendingDown, Users, Eye, Clock, PercentSquare, Plus, Copy, Check, RefreshCw } from 'lucide-react';
import { useWebsites, useWebsiteMetrics } from '@/hooks/useAnalytics';
import { AddWebsiteModal } from '@/components/analytics/AddWebsiteModal';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

function MetricCard({ label, value, change, icon }: MetricCardProps) {
  const isPositive = change ? change >= 0 : true;
  
  return (
    <Card>
      <CardBody className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(change)}% vs last week</span>
            </div>
          )}
        </div>
        <div className="text-blue-400 opacity-70">{icon}</div>
      </CardBody>
    </Card>
  );
}

export function WebsiteMetricsTab() {
  const { websites, loading: websitesLoading, refetch } = useWebsites();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [copiedScriptId, setCopiedScriptId] = useState(false);

  const selectedWebsite = websites?.find(w => w.id === selectedWebsiteId) || websites?.[0];
  const { metrics, lastUpdated, loading: metricsLoading, refetch: refetchMetrics } = useWebsiteMetrics(selectedWebsite?.id);

  // `metrics` is an array of daily rows. Reduce it into real totals for the
  // selected period. Numeric columns can arrive as strings from pg, so coerce.
  const num = (v: unknown) => Number(v) || 0;
  const totals = (metrics || []).reduce(
    (acc, m) => {
      acc.visitors += num(m.visitors);
      acc.pageviews += num(m.pageviews);
      acc.sessions += num(m.sessions);
      acc.durationWeighted += num(m.avg_session_duration) * num(m.sessions);
      acc.organic += num(m.organic_traffic);
      acc.direct += num(m.direct_traffic);
      acc.social += num(m.social_traffic);
      acc.referral += num(m.referral_traffic);
      acc.desktop += num(m.desktop_traffic);
      acc.mobile += num(m.mobile_traffic);
      acc.tablet += num(m.tablet_traffic);
      return acc;
    },
    { visitors: 0, pageviews: 0, sessions: 0, durationWeighted: 0, organic: 0, direct: 0, social: 0, referral: 0, desktop: 0, mobile: 0, tablet: 0 }
  );

  const avgDurationSecs = totals.sessions > 0 ? Math.round(totals.durationWeighted / totals.sessions) : 0;
  const hasData = totals.visitors > 0 || totals.pageviews > 0;

  const displayMetrics = {
    visitors: totals.visitors,
    pageviews: totals.pageviews,
    avgSessionDuration: `${Math.floor(avgDurationSecs / 60)}m ${avgDurationSecs % 60}s`,
    sessions: totals.sessions,
  };

  const sourceTotal = totals.organic + totals.direct + totals.social + totals.referral;
  const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);
  const trafficSources = [
    { source: 'Organic Search', visitors: totals.organic, percentage: pct(totals.organic, sourceTotal) },
    { source: 'Direct', visitors: totals.direct, percentage: pct(totals.direct, sourceTotal) },
    { source: 'Social Media', visitors: totals.social, percentage: pct(totals.social, sourceTotal) },
    { source: 'Referral', visitors: totals.referral, percentage: pct(totals.referral, sourceTotal) },
  ];

  const deviceTotal = totals.desktop + totals.mobile + totals.tablet;
  const deviceBreakdown = [
    { device: 'Desktop', visitors: totals.desktop, percentage: pct(totals.desktop, deviceTotal) },
    { device: 'Mobile', visitors: totals.mobile, percentage: pct(totals.mobile, deviceTotal) },
    { device: 'Tablet', visitors: totals.tablet, percentage: pct(totals.tablet, deviceTotal) },
  ];

  const copyTrackingScript = () => {
    if (selectedWebsite?.tracking_script_id) {
      const script = `<!-- ValueConnection Analytics -->
<script>
  window.vc_api_endpoint = '${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}';
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/vc-analytics.js?id=${selectedWebsite.tracking_script_id}"><\/script>`;
      
      navigator.clipboard.writeText(script);
      setCopiedScriptId(true);
      setTimeout(() => setCopiedScriptId(false), 2000);
    }
  };

  if (!websites || websites.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white">Website Metrics</h2>
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-white mb-2">No websites tracked yet</p>
            <p className="text-gray-400 mb-6">Add your first website to start tracking metrics</p>
            <Button 
              variant="primary"
              onClick={() => setIsAddWebsiteOpen(true)}
            >
              Add Your First Website
            </Button>
          </CardBody>
        </Card>
        <AddWebsiteModal 
          isOpen={isAddWebsiteOpen}
          onClose={() => setIsAddWebsiteOpen(false)}
          onSuccess={() => {
            setIsAddWebsiteOpen(false);
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Website Metrics</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchMetrics()}
            disabled={metricsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddWebsiteOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Website
          </Button>
        </div>
      </div>

      {/* Website Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {websites.map((website) => (
          <button
            key={website.id}
            onClick={() => setSelectedWebsiteId(website.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedWebsite?.id === website.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {website.domain}
          </button>
        ))}
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-sm text-gray-400">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}

      {/* No data yet hint */}
      {!metricsLoading && !hasData && (
        <Card>
          <CardBody className="py-6">
            <p className="text-white font-semibold mb-1">No analytics data yet for {selectedWebsite?.domain}</p>
            <p className="text-gray-400 text-sm">
              Make sure the tracking script below is installed on your site, then visit a page. Events are
              rolled up automatically — hit Refresh to pull in the latest. Numbers below reflect real tracked
              data and will update as visitors arrive.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Key Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <MetricCard
            label="Total Visitors"
            value={displayMetrics.visitors}
            icon={<Users className="h-8 w-8" />}
          />
          <MetricCard
            label="Page Views"
            value={displayMetrics.pageviews}
            icon={<Eye className="h-8 w-8" />}
          />
          <MetricCard
            label="Avg Session Duration"
            value={displayMetrics.avgSessionDuration}
            icon={<Clock className="h-8 w-8" />}
          />
          <MetricCard
            label="Sessions"
            value={displayMetrics.sessions}
            icon={<PercentSquare className="h-8 w-8" />}
          />
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Traffic Sources</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-300">{source.source}</p>
                    <p className="text-white font-semibold">{source.visitors.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(source.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{source.percentage.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Device Breakdown</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {deviceBreakdown.map((device) => (
                <div key={device.device}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-300">{device.device}</p>
                    <p className="text-white font-semibold">{device.visitors.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(device.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{device.percentage.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Setup Tracking Script */}
      {selectedWebsite && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Setup Tracking Script</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-400">
              To start tracking metrics on {selectedWebsite.domain}, add this script to your website&apos;s head or body tag:
            </p>
            <div className="bg-black rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto border border-gray-800">
              <code>{`<!-- ValueConnection Analytics -->
<script>
  window.vc_api_endpoint = '${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}';
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/vc-analytics.js?id=${selectedWebsite.tracking_script_id}"><\/script>`}</code>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Tracking ID: <span className="text-blue-400 font-mono">{selectedWebsite.tracking_script_id}</span>
              </p>
              <button 
                onClick={copyTrackingScript}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {copiedScriptId ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Script
                  </>
                )}
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      <AddWebsiteModal 
        isOpen={isAddWebsiteOpen}
        onClose={() => setIsAddWebsiteOpen(false)}
        onSuccess={() => {
          setIsAddWebsiteOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
