import { useState } from 'react';

interface Recommendation {
  id: string;
  category: 'quick-win' | 'content' | 'technical' | 'traffic' | 'conversion';
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedRoi: string;
  actionUrl?: string | null;
  completed?: boolean;
}

interface AIRecommendationsResponse {
  status: 'success' | 'error';
  data?: {
    recommendations: Recommendation[];
    summary: string;
    totalPotentialImpact: string;
  };
  fallback?: {
    recommendations: Recommendation[];
    summary: string;
    totalPotentialImpact: string;
  };
  message?: string;
}

export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [summary, setSummary] = useState('');
  const [totalImpact, setTotalImpact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async (websiteId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      });

      const data: AIRecommendationsResponse = await response.json();

      if (response.ok && data.status === 'success' && data.data) {
        setRecommendations(data.data.recommendations);
        setSummary(data.data.summary);
        setTotalImpact(data.data.totalPotentialImpact);
      } else if (data.fallback) {
        // Use fallback if AI call failed
        setRecommendations(data.fallback.recommendations);
        setSummary(data.fallback.summary);
        setTotalImpact(data.fallback.totalPotentialImpact);
      } else {
        setError(data.message || 'Failed to generate recommendations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    summary,
    totalImpact,
    loading,
    error,
    generateRecommendations,
  };
}
