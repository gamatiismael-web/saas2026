'use client';

import { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddWebsiteModal } from '@/components/analytics/AddWebsiteModal';
import { WebsiteSelector } from '@/components/analytics/WebsiteSelector';
import { MetricsDisplay } from '@/components/analytics/MetricsDisplay';
import { useWebsites, useWebsiteMetrics, useMetricsAggregation } from '@/hooks/useAnalytics';
import { format } from 'date-fns';

export default function AnalyticsDashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);

  const { websites, loading: websitesLoading, refetch: refetchWebsites } = useWebsites();
  const selectedWebsite = websites.find((w) => w.id === selectedWebsiteId) || websites[0];

  const { metrics, loading: metricsLoading, lastUpdated, refetch: refetchMetrics } =
    useWebsiteMetrics(selectedWebsite?.id || null, 30);

  const { aggregate, isSyncing } = useMetricsAggregation(selectedWebsite?.id || null);

  const handleWebsiteSelect = (website: any) => {
    setSelectedWebsiteId(website.id);
  };

  const handleAddWebsiteSuccess = () => {
    refetchWebsites();
  };

  const handleManualRefresh = async () => {
    if (selectedWebsite) {
      await aggregate();
      // Refetch metrics after aggregation
      setTimeout(refetchMetrics, 500);
    }
  };

  const hasEnoughData = metrics.length > 0;
  const hasSevenDaysData = selectedWebsite?.has_7_days_data || false;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your website's real-time analytics and performance</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            {websitesLoading ? (
              <div className="p-4 bg-gray-900 border border-gray-800 rounded animate-pulse h-12" />
            ) : (
              <WebsiteSelector
                websites={websites}
                selectedWebsite={selectedWebsite || null}
                onSelectWebsite={handleWebsiteSelect}
              />
            )}
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        </div>

        {/* Website Status */}
        {selectedWebsite && (
          <Card className="mb-8 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Website</p>
                <p className="text-white font-medium">{selectedWebsite.name}</p>
                <p className="text-gray-500 text-xs">{selectedWebsite.domain}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Collection Status</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedWebsite.metrics_collection_status === 'active'
                        ? 'success'
                        : selectedWebsite.metrics_collection_status === 'failed'
                          ? 'error'
                          : 'info'
                    }
                  >
                    {selectedWebsite.metrics_collection_status === 'active'
                      ? 'Active'
                      : selectedWebsite.metrics_collection_status === 'failed'
                        ? 'Failed'
                        : 'Pending'}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Last Sync</p>
                <p className="text-white font-medium">
                  {selectedWebsite.last_metrics_sync
                    ? format(new Date(selectedWebsite.last_metrics_sync), 'MMM d, HH:mm')
                    : 'Never'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Features</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={hasSevenDaysData ? 'success' : 'info'} size="sm">
                    {hasSevenDaysData ? '7+ Days Data' : 'Collecting Data'}
                  </Badge>
                  {selectedWebsite.gsc_verified && <Badge variant="success" size="sm">GSC Connected</Badge>}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        {selectedWebsite && (
          <Tabs defaultValue="metrics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="metrics">Website Metrics</TabsTrigger>
              <TabsTrigger value="seo" disabled={!selectedWebsite.gsc_verified}>
                SEO Rankings
                {!selectedWebsite.gsc_verified && (
                  <Badge variant="info" size="sm" className="ml-2">
                    Connect GSC
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="insights" disabled={!hasSevenDaysData}>
                AI Insights
                {!hasSevenDaysData && (
                  <Badge variant="info" size="sm" className="ml-2">
                    {30 - (metrics.length || 0)} days remaining
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <MetricsDisplay
                metrics={metrics}
                loading={metricsLoading}
                isSyncing={isSyncing}
                lastUpdated={lastUpdated}
                onRefresh={handleManualRefresh}
                hasEnoughData={hasEnoughData}
              />
            </TabsContent>

            <TabsContent value="seo">
              <Card className="p-8 text-center">
                <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">SEO Rankings Coming Soon</h3>
                <p className="text-gray-400 mb-4">
                  Connect your Google Search Console account to see keyword rankings and performance
                </p>
                <Button variant="outline">Connect Google Search Console</Button>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card className="p-8 text-center">
                <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">AI Insights Coming Soon</h3>
                <p className="text-gray-400 mb-4">
                  After 7 days of data collection, you&apos;ll unlock AI-powered actionable recommendations
                  to improve your website&apos;s performance.
                </p>
                <p className="text-sm text-gray-500">
                  {Math.max(0, 7 - (metrics.length || 0))} days until recommendations are available
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Modals */}
      <AddWebsiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddWebsiteSuccess}
      />
    </div>
  );
}
