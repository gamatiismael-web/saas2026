import { useState, useCallback } from 'react';

export interface SeoRecommendation {
  id: string;
  group: 'on-page' | 'technical';
  priority: 'high' | 'medium' | 'low';
  title: string;
  explanation: string;
  action: string;
  link: string | null;
}

export interface SeoSummary {
  high: number;
  medium: number;
  low: number;
  passed: number;
  total: number;
}

export interface SeoAnalysis {
  website: { id: string; name: string; url: string; domain: string };
  analyzedAt: string;
  summary: SeoSummary;
  recommendations: SeoRecommendation[];
}

export function useSeoRecommendations() {
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (websiteId: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      });
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setAnalysis(data as SeoAnalysis);
      } else {
        setError(data.message || 'Failed to analyze website');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return { analysis, loading, error, analyze };
}
