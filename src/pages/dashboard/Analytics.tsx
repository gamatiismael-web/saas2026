import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Users, Eye, Clock, TrendingUp, TrendingDown,
  Globe, Smartphone, Monitor, RefreshCw, AlertTriangle, Settings,
  Calendar,
} from 'lucide-react';

type AnalyticsData = {
  stats: { label: string; value: string; change: string | null; up: boolean }[];
  topPages: { path: string; label: string; views: number }[];
  sources: { name: string; percentage: number; color: string }[];
  devices: { name: string; percentage: number }[];
  sessions: number;
};

type DatePreset = {
  label: string;
  startDate: string;
  endDate: string;
  days: number;
};

const DATE_PRESETS: DatePreset[] = [
  { label: '7 days', startDate: '7daysAgo', endDate: 'today', days: 7 },
  { label: '30 days', startDate: '30daysAgo', endDate: 'today', days: 30 },
  { label: '90 days', startDate: '90daysAgo', endDate: 'today', days: 90 },
  { label: '6 months', startDate: '180daysAgo', endDate: 'today', days: 180 },
  { label: '12 months', startDate: '365daysAgo', endDate: 'today', days: 365 },
];

const deviceIcons: Record<string, React.ElementType> = {
  Mobile: Smartphone,
  Desktop: Monitor,
  Tablet: Globe,
};

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />;
}

export function Analytics() {
  const { profile } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notConfigured, setNotConfigured] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>(DATE_PRESETS[1]);

  const propertyId = profile?.ga4_property_id;

  const fetchData = async (preset: DatePreset = selectedPreset) => {
    if (!propertyId) {
      setNotConfigured(true);
      return;
    }
    setLoading(true);
    setError('');
    setNotConfigured(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ga4-data`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId,
            startDate: preset.startDate,
            endDate: preset.endDate,
          }),
        }
      );
      const json = await res.json();
      if (json.notConfigured) {
        setNotConfigured(true);
      } else if (json.error) {
        setError(json.error);
      } else {
        setData(json);
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetChange = (preset: DatePreset) => {
    setSelectedPreset(preset);
    fetchData(preset);
  };

  useEffect(() => {
    fetchData();
  }, [propertyId]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Google Analytics</h1>
              <p className="text-sm text-gray-400">
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : 'Live data from GA4'}
              </p>
            </div>
          </div>

          {propertyId && (
            <div className="flex items-center gap-3 flex-wrap">
              {/* Date range selector */}
              <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500 ml-2 mr-1" />
                {DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetChange(preset)}
                    disabled={loading}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 ${
                      selectedPreset.label === preset.label
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => fetchData()}
                disabled={loading}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          )}
        </div>

        {!propertyId && !loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-7 w-7 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Connect Google Analytics</h2>
            <p className="text-sm text-gray-400 mb-5 max-w-sm mx-auto">
              Link your GA4 property to see real visitor counts, page views, traffic sources, and more — updated live.
            </p>
            <Link
              to="/dashboard/settings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              Set up in Settings
            </Link>
          </div>
        )}

        {notConfigured && propertyId && (
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">Service account not configured</p>
              <p className="text-sm text-amber-400/80 mt-1">
                The Google service account key has not been set up yet. Please contact support to complete the integration.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-300">Failed to load analytics</p>
              <p className="text-sm text-rose-400/80 mt-1">{error}</p>
              <button
                onClick={() => fetchData()}
                className="mt-2 text-sm text-rose-300 hover:text-rose-200 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <div className="space-y-6">
                <Skeleton className="h-40" />
                <Skeleton className="h-32" />
              </div>
            </div>
          </>
        )}

        {data && !loading && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.stats.map((stat, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  {stat.change !== null ? (
                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {stat.change}% vs prior period
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No prior data</div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  Top Pages
                </h2>
                <div className="space-y-3">
                  {data.topPages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-white">{page.label}</div>
                        <div className="text-xs text-gray-500">{page.path}</div>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {page.views.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {data.topPages.length === 0 && (
                    <p className="text-sm text-gray-500">No page data available.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-400" />
                    Traffic Sources
                  </h2>
                  {data.sources.length > 0 ? (
                    <div className="space-y-3">
                      {data.sources.map((source, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{source.name}</span>
                            <span className="font-medium text-white">{source.percentage}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${source.color}`}
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No traffic source data available.</p>
                  )}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    Device Breakdown
                  </h2>
                  {data.devices.length > 0 ? (
                    <div className="flex gap-4">
                      {data.devices.map((device, i) => {
                        const Icon = deviceIcons[device.name] ?? Monitor;
                        return (
                          <div key={i} className="flex-1 text-center p-4 bg-gray-950 rounded-xl">
                            <Icon className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                            <div className="text-lg font-bold text-white">{device.percentage}%</div>
                            <div className="text-xs text-gray-500">{device.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No device data available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-5 py-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">
                Data pulled live from Google Analytics 4 · Property {propertyId} · Last {selectedPreset.label}
              </span>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
