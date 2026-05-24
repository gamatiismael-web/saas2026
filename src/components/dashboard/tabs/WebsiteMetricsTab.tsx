'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Users, Eye, Clock, PercentSquare } from 'lucide-react';

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
  // Mock data - in production this would come from database
  const metrics = {
    visitors: { value: 12453, change: 12 },
    pageviews: { value: 45230, change: 8 },
    avgSessionDuration: { value: '2m 34s', change: 5 },
    bounceRate: { value: '42%', change: -3 },
  };

  const trafficSources = [
    { source: 'Organic Search', visitors: 6200, percentage: 49.8 },
    { source: 'Direct', visitors: 2814, percentage: 22.6 },
    { source: 'Social Media', visitors: 2091, percentage: 16.8 },
    { source: 'Referral', visitors: 1348, percentage: 10.8 },
  ];

  const deviceBreakdown = [
    { device: 'Desktop', visitors: 7250, percentage: 58.2 },
    { device: 'Mobile', visitors: 4380, percentage: 35.1 },
    { device: 'Tablet', visitors: 823, percentage: 6.6 },
  ];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Website Overview</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <MetricCard
            label="Total Visitors"
            value={metrics.visitors.value}
            change={metrics.visitors.change}
            icon={<Users className="h-8 w-8" />}
          />
          <MetricCard
            label="Page Views"
            value={metrics.pageviews.value}
            change={metrics.pageviews.change}
            icon={<Eye className="h-8 w-8" />}
          />
          <MetricCard
            label="Avg Session Duration"
            value={metrics.avgSessionDuration.value}
            change={metrics.avgSessionDuration.change}
            icon={<Clock className="h-8 w-8" />}
          />
          <MetricCard
            label="Bounce Rate"
            value={metrics.bounceRate.value}
            change={metrics.bounceRate.change}
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
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{source.percentage}%</p>
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
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{device.percentage}%</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Setup Tracking Script</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-gray-400">
            To start tracking metrics, add this script to your website&apos;s head or body tag:
          </p>
          <div className="bg-black rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto border border-gray-800">
            <code>{`<script async src="https://cdn.valueconnection.app/tracker.js" data-site-id="YOUR_SITE_ID"><\/script>`}</code>
          </div>
          <p className="text-gray-400 text-sm">
            Your Site ID: <span className="text-blue-400 font-mono">site_abc123xyz789</span>
          </p>
          <button className="text-blue-400 hover:text-blue-300 text-sm mt-4">
            Copy Script →
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
