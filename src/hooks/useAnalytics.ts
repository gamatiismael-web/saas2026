import { useState, useCallback, useEffect } from 'react';

export interface Website {
  id: string;
  user_id: string;
  url: string;
  domain: string;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'failed';
  tracking_script_id: string;
  tracking_enabled: boolean;
  last_metrics_sync: string | null;
  metrics_collection_status: 'pending' | 'active' | 'failed' | 'paused';
  has_7_days_data: boolean;
  ai_recommendations_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebsiteMetrics {
  id: string;
  website_id: string;
  metric_date: string;
  metric_hour: number | null;
  visitors: number;
  pageviews: number;
  sessions: number;
  avg_session_duration: number;
  bounce_rate: number;
  conversion_rate: number;
  organic_traffic: number;
  direct_traffic: number;
  referral_traffic: number;
  social_traffic: number;
  paid_traffic: number;
  desktop_traffic: number;
  mobile_traffic: number;
  tablet_traffic: number;
  created_at: string;
  updated_at: string;
}

export function useWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analytics/websites');
      const data = await response.json();
      
      if (data.status === 'success') {
        setWebsites(data.websites);
      } else {
        setError(data.message || 'Failed to fetch websites');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { websites, loading, error, refetch };
}

export function useCreateWebsite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createWebsite = useCallback(async (
    url: string,
    name: string,
    description?: string
  ): Promise<Website | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analytics/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name, description }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return data.website;
      } else {
        setError(data.message || 'Failed to create website');
        return null;
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createWebsite, loading, error };
}

export function useWebsiteMetrics(websiteId: string | null, days: number = 30) {
  const [metrics, setMetrics] = useState<WebsiteMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!websiteId) {
      setMetrics([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/analytics/metrics?website_id=${websiteId}&days=${days}`
      );
      const data = await response.json();
      
      if (data.status === 'success') {
        setMetrics(data.metrics);
        setLastUpdated(new Date().toISOString());
      } else {
        setError(data.message || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [websiteId, days]);

  useEffect(() => {
    refetch();
  }, [websiteId, days, refetch]);

  return { metrics, loading, error, lastUpdated, refetch };
}

export function useMetricsAggregation(websiteId: string | null) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncDuration, setSyncDuration] = useState<number | null>(null);

  const aggregate = useCallback(async (date?: string) => {
    if (!websiteId) return;

    setIsSyncing(true);
    setError(null);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/analytics/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website_id: websiteId,
          date: date || new Date().toISOString().split('T')[0],
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setLastSync(new Date().toISOString());
        setSyncDuration(data.sync_duration_ms);
      } else {
        setError(data.message || 'Failed to aggregate metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSyncing(false);
    }
  }, [websiteId]);

  return { aggregate, isSyncing, lastSync, error, syncDuration };
}
