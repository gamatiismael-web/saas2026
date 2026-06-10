'use client';

import { useState } from 'react';
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWebsites } from '@/hooks/useAnalytics';
import { useSeoRecommendations, type SeoRecommendation } from '@/hooks/useSeoRecommendations';

const PRIORITY_STYLES: Record<SeoRecommendation['priority'], { badge: string; label: string }> = {
  high: { badge: 'bg-red-500/15 text-red-400 border border-red-500/30', label: 'High priority' },
  medium: { badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', label: 'Medium priority' },
  low: { badge: 'bg-slate-500/15 text-slate-300 border border-slate-500/30', label: 'Low priority' },
};

function RecommendationCard({ rec }: { rec: SeoRecommendation }) {
  const styles = PRIORITY_STYLES[rec.priority];
  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-800">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-white font-semibold">{rec.title}</h4>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${styles.badge}`}>
          {styles.label}
        </span>
      </div>
      <p className="text-gray-400 text-sm mt-2 leading-relaxed">{rec.explanation}</p>
      <div className="mt-3 flex items-start gap-2 text-sm">
        <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
        <div>
          <span className="text-gray-300">{rec.action}</span>
          {rec.link && (
            <a
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-2"
            >
              Learn how
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function SEORecommendationsTab() {
  const { websites, loading: websitesLoading } = useWebsites();
  const { analysis, loading, error, analyze } = useSeoRecommendations();
  const [selectedId, setSelectedId] = useState<string>('');

  const onPage = analysis?.recommendations.filter((r) => r.group === 'on-page') ?? [];
  const technical = analysis?.recommendations.filter((r) => r.group === 'technical') ?? [];

  return (
    <div className="space-y-8">
      {/* Header / controls */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-white">SEO Recommendations</h3>
          <p className="text-gray-400 text-sm">
            Crawl a website&apos;s homepage and get clear, actionable on-page and technical SEO improvements.
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label htmlFor="seo-website" className="block text-sm text-gray-400 mb-2">
                Website
              </label>
              <select
                id="seo-website"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                disabled={websitesLoading || websites.length === 0}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">
                  {websitesLoading
                    ? 'Loading websites...'
                    : websites.length === 0
                    ? 'No websites added yet'
                    : 'Select a website'}
                </option>
                {websites.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.domain})
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => selectedId && analyze(selectedId)}
              disabled={!selectedId || loading}
              className="flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? 'Analyzing...' : 'Analyze SEO'}
            </Button>
          </div>
          {analysis && (
            <p className="text-gray-500 text-xs mt-3">
              Analyzed {analysis.website.url} on {new Date(analysis.analyzedAt).toLocaleString()}
            </p>
          )}
        </CardBody>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Analysis failed</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !analysis && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-gray-400 mt-4">Crawling the homepage and generating recommendations...</p>
        </div>
      )}

      {/* Empty (no analysis yet) */}
      {!loading && !analysis && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-gray-600" />
          <p className="text-gray-400 mt-4">Select a website and click &quot;Analyze SEO&quot; to get recommendations.</p>
        </div>
      )}

      {/* Results */}
      {analysis && (
        <>
          {/* Summary strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardBody>
                <p className="text-gray-400 text-sm mb-1">High priority</p>
                <p className="text-3xl font-bold text-red-400">{analysis.summary.high}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-400 text-sm mb-1">Medium priority</p>
                <p className="text-3xl font-bold text-amber-400">{analysis.summary.medium}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-400 text-sm mb-1">Low priority</p>
                <p className="text-3xl font-bold text-slate-300">{analysis.summary.low}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-400 text-sm mb-1">Checks passed</p>
                <p className="text-3xl font-bold text-green-400">
                  {analysis.summary.passed}/{analysis.summary.total}
                </p>
              </CardBody>
            </Card>
          </div>

          {/* All good */}
          {analysis.recommendations.length === 0 && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
              <p className="text-gray-300">
                No issues found on the homepage. All {analysis.summary.total} checks passed.
              </p>
            </div>
          )}

          {/* On-Page */}
          {onPage.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">On-Page SEO</h3>
                </div>
                <p className="text-gray-400 text-sm">Content and markup improvements on the page itself.</p>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {onPage.map((rec) => (
                    <RecommendationCard key={rec.id} rec={rec} />
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Technical */}
          {technical.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Technical SEO</h3>
                </div>
                <p className="text-gray-400 text-sm">Crawlability, indexing, and mobile/performance signals.</p>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {technical.map((rec) => (
                    <RecommendationCard key={rec.id} rec={rec} />
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
