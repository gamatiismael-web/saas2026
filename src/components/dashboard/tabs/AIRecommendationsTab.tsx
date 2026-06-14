'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useWebsites } from '@/hooks/useAnalytics';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

const categories = {
  'quick-win': { label: 'Quick Wins', color: 'bg-green-500' },
  'content': { label: 'Content Opportunities', color: 'bg-blue-500' },
  'technical': { label: 'Technical Improvements', color: 'bg-purple-500' },
  'traffic': { label: 'Traffic Growth', color: 'bg-orange-500' },
  'conversion': { label: 'Conversion Optimization', color: 'bg-pink-500' },
};

export function AIRecommendationsTab() {
  const { websites } = useWebsites();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('');
  const { recommendations, summary, totalImpact, loading, error, generateRecommendations } =
    useAIRecommendations();

  const selectedWebsite = websites.find((w) => w.id === selectedWebsiteId);
  const hasRecommendations = recommendations.length > 0;

  const handleAnalyze = async () => {
    if (!selectedWebsiteId) return;
    await generateRecommendations(selectedWebsiteId);
  };

  return (
    <div className="space-y-8">
      {/* Website Selector and Analyze Button */}
      <div className="flex gap-4">
        <select
          value={selectedWebsiteId}
          onChange={(e) => setSelectedWebsiteId(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a website to analyze...</option>
          {websites.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name || w.domain}
            </option>
          ))}
        </select>
        <Button onClick={handleAnalyze} disabled={!selectedWebsiteId || loading} loading={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {error && (
        <Card>
          <CardBody>
            <p className="text-red-400 text-sm">{error}</p>
          </CardBody>
        </Card>
      )}

      {!hasRecommendations && !loading && (
        <Card>
          <CardBody>
            <p className="text-gray-400 text-sm">
              Select a website and click "Analyze" to generate AI-powered recommendations based on your tracking
              metrics.
            </p>
          </CardBody>
        </Card>
      )}

      {hasRecommendations && (
        <>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardBody>
                <p className="text-gray-400 text-sm mb-2">Total Recommendations</p>
                <p className="text-4xl font-bold text-white">{recommendations.length}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-400 text-sm mb-2">Website Analyzed</p>
                <p className="text-lg font-bold text-white">{selectedWebsite?.domain}</p>
                <p className="text-gray-400 text-sm mt-2">Last 7 days of data</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-400 text-sm mb-2">Potential Impact</p>
                <p className="text-2xl font-bold text-blue-400">{totalImpact}</p>
                <p className="text-gray-400 text-sm mt-2">If all implemented</p>
              </CardBody>
            </Card>
          </div>

          {summary && (
            <Card>
              <CardBody>
                <p className="text-gray-300 text-sm">{summary}</p>
              </CardBody>
            </Card>
          )}

          {/* Recommendations by Category */}
          {Object.entries(categories).map(([catKey, catValue]) => {
            const catRecommendations = recommendations.filter((r) => r.category === catKey);
            if (catRecommendations.length === 0) return null;

            return (
              <div key={catKey}>
                <h3 className="text-lg font-bold text-white mb-4">{catValue.label}</h3>
                <div className="space-y-3">
                  {catRecommendations.map((rec) => (
                    <Card key={rec.id} hover>
                      <CardBody className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            {rec.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className={`font-semibold ${rec.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                                {rec.title}
                              </p>
                              <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                              <div className="flex items-center gap-2 mt-3 flex-wrap">
                                <Badge
                                  variant={
                                    rec.difficulty === 'Easy'
                                      ? 'success'
                                      : rec.difficulty === 'Medium'
                                        ? 'warning'
                                        : 'danger'
                                  }
                                >
                                  {rec.difficulty}
                                </Badge>
                                <span className="text-blue-400 text-sm font-semibold flex items-center gap-1">
                                  <Zap className="h-4 w-4" />
                                  {rec.expectedRoi}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <input type="checkbox" checked={rec.completed || false} readOnly className="mt-1 w-5 h-5" />
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
