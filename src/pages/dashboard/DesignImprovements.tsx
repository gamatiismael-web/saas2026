import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, CheckCircle2, Clock, AlertCircle, Zap,
  Sparkles, ChevronDown, ChevronUp, RefreshCw, Settings,
  TrendingDown, TrendingUp, BarChart2, Smartphone, MousePointerClick, Eye,
} from 'lucide-react';

type MetricDecision = {
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'In Progress' | 'Pending';
  metric: {
    label: string;
    value: string;
    trend: 'bad' | 'good' | 'neutral';
    icon: React.ElementType;
  };
  decision: string;
  reason: string;
  expectedOutcome: string;
};

type AiImprovement = {
  title: string;
  insight: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
};

const METRIC_DECISIONS: MetricDecision[] = [
  {
    title: 'Redesigned hero section with higher contrast',
    category: 'Accessibility',
    priority: 'High',
    status: 'In Progress',
    metric: { label: 'Mobile bounce rate', value: '74%', trend: 'bad', icon: TrendingDown },
    decision: 'Increase text-to-background contrast ratio from 2.8:1 to 7:1 on the hero section and update font size from 14px to 16px base on mobile.',
    reason: 'Analytics showed 74% of mobile visitors bounced within 5 seconds. Heatmaps confirmed users were not scrolling past the hero. Low contrast and small text were identified as the primary friction points on mobile devices.',
    expectedOutcome: 'Reduce mobile bounce rate to below 55% and improve average session depth from 1.2 to 2.5 pages.',
  },
  {
    title: 'Added social proof strip above the fold',
    category: 'Conversion',
    priority: 'High',
    status: 'Pending',
    metric: { label: 'Homepage conversion rate', value: '0.8%', trend: 'bad', icon: MousePointerClick },
    decision: 'Insert a client logo strip and a "200+ businesses trust us" counter directly below the navigation bar, visible without scrolling.',
    reason: 'The homepage CTA click-through rate was 0.8%, well below the 3–5% industry benchmark. Session recordings showed users scrolling past the CTA without acting. Trust signals above the fold are proven to increase first-impression credibility and push conversion.',
    expectedOutcome: 'Increase CTA click-through rate to 2.5%+ and improve trial signup conversion by an estimated 1.5×.',
  },
  {
    title: 'Moved CTA buttons above the fold on pricing page',
    category: 'Conversion',
    priority: 'Medium',
    status: 'Pending',
    metric: { label: 'Pricing page scroll depth', value: '38%', trend: 'bad', icon: Eye },
    decision: 'Add a sticky "Start Free Trial" button to the pricing page header and duplicate CTAs to appear at the top of each plan card.',
    reason: 'Only 38% of pricing page visitors scrolled to the existing CTA buttons at the bottom. The majority left without seeing any call-to-action. Moving CTAs higher captures the intent of users who decide quickly.',
    expectedOutcome: 'Increase pricing page conversion rate from 1.2% to an estimated 2.8% by capturing high-intent visitors earlier in the page.',
  },
  {
    title: 'Redesigned mobile navigation with larger tap targets',
    category: 'UX',
    priority: 'Medium',
    status: 'Completed',
    metric: { label: 'Mobile nav error rate', value: '31%', trend: 'bad', icon: Smartphone },
    decision: 'Increased all touch targets to minimum 48×48px, added 12px padding between nav items, and replaced text links with icon+label pairs.',
    reason: 'Session data showed 31% of mobile users tapping the wrong nav item on their first attempt, leading to frustration and early exits. The previous nav used 28px tap targets — well below the 44px recommended minimum for mobile interfaces.',
    expectedOutcome: 'Mobile navigation mis-tap rate reduced to below 5%, confirmed post-deployment. Mobile session duration increased by 22%.',
  },
  {
    title: 'Optimised page load speed on the dashboard',
    category: 'Performance',
    priority: 'High',
    status: 'Completed',
    metric: { label: 'Avg page load time', value: '4.7s', trend: 'bad', icon: TrendingDown },
    decision: 'Lazy-loaded non-critical dashboard widgets, compressed all chart libraries, and deferred third-party analytics scripts until after user interaction.',
    reason: 'Core Web Vitals data showed a 4.7s average load time — above the 3s threshold where users begin abandoning pages. 18% of users left before the dashboard fully loaded. Performance improvements directly impact perceived reliability.',
    expectedOutcome: 'Page load time reduced to 1.9s, confirmed. Dashboard abandonment dropped from 18% to 6%.',
  },
  {
    title: 'Added persistent progress indicators to onboarding flow',
    category: 'UX',
    priority: 'Medium',
    status: 'Pending',
    metric: { label: 'Onboarding completion rate', value: '41%', trend: 'bad', icon: BarChart2 },
    decision: 'Add a step-progress bar to the top of every onboarding screen showing "Step X of 4" with estimated time remaining.',
    reason: 'Only 41% of new sign-ups completed the onboarding flow. Drop-off analysis showed the highest abandonment on step 2 of 4, where users had no visibility into how much remained. Progress indicators reduce perceived effort and increase completion.',
    expectedOutcome: 'Target onboarding completion rate of 70%+, which would significantly increase the number of users who reach the "aha moment" and convert to paid plans.',
  },
];

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  'In Progress': { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  'Pending': { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-800 border-gray-700' },
  'Completed': { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
};

const PRIORITY_STYLES: Record<string, string> = {
  High: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Low: 'text-gray-400 bg-gray-800 border-gray-700',
};

const CATEGORY_COLORS: Record<string, string> = {
  Accessibility: 'text-blue-400 bg-blue-400/10',
  Conversion: 'text-emerald-400 bg-emerald-400/10',
  UX: 'text-amber-400 bg-amber-400/10',
  Performance: 'text-orange-400 bg-orange-400/10',
};

const AI_PRIORITY_STYLES: Record<string, string> = {
  high: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  low: 'text-gray-400 bg-gray-800 border-gray-700',
};

const AI_CATEGORY_COLORS: Record<string, string> = {
  accessibility: 'text-blue-400 bg-blue-400/10',
  conversion: 'text-emerald-400 bg-emerald-400/10',
  ux: 'text-amber-400 bg-amber-400/10',
  mobile: 'text-cyan-400 bg-cyan-400/10',
  performance: 'text-orange-400 bg-orange-400/10',
  branding: 'text-rose-400 bg-rose-400/10',
};

const FOCUS_AREAS = [
  'Accessibility',
  'Conversion rate',
  'Mobile experience',
  'Page speed',
  'Trust & credibility',
  'Navigation & UX',
  'Branding consistency',
  'Call-to-action clarity',
];

const totals = {
  total: METRIC_DECISIONS.length,
  completed: METRIC_DECISIONS.filter((d) => d.status === 'Completed').length,
  inProgress: METRIC_DECISIONS.filter((d) => d.status === 'In Progress').length,
  pending: METRIC_DECISIONS.filter((d) => d.status === 'Pending').length,
};

export function DesignImprovements() {
  const { profile } = useAuth();

  const [aiImprovements, setAiImprovements] = useState<AiImprovement[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiNotConfigured, setAiNotConfigured] = useState(false);
  const [expandedAiIdx, setExpandedAiIdx] = useState<number | null>(null);
  const [expandedDecisionIdx, setExpandedDecisionIdx] = useState<number | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);

  const toggleFocus = (area: string) => {
    setSelectedFocus((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const generateImprovements = async () => {
    if (!profile?.website_url && !profile?.business_name) return;
    setAiLoading(true);
    setAiError('');
    setAiNotConfigured(false);
    setExpandedAiIdx(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-recommendations`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode: 'design',
            websiteUrl: profile?.website_url,
            businessName: profile?.business_name,
            industry: profile?.industry,
            focusAreas: selectedFocus.length > 0 ? selectedFocus : undefined,
          }),
        }
      );
      const json = await res.json();
      if (json.notConfigured) {
        setAiNotConfigured(true);
      } else if (json.error) {
        setAiError(json.error);
      } else {
        setAiImprovements(json.recommendations || []);
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to generate improvements.');
    } finally {
      setAiLoading(false);
    }
  };

  const hasProfile = !!(profile?.website_url || profile?.business_name);

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

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Recommendations</h1>
            <p className="text-sm text-gray-400">Decisions made from website metrics and user behaviour data</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Decisions', value: totals.total },
            { label: 'Completed', value: totals.completed },
            { label: 'In Progress', value: totals.inProgress },
            { label: 'Pending', value: totals.pending },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Metric-based decisions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
            <Zap className="h-4 w-4 text-rose-400" />
            <h2 className="text-base font-semibold text-white">Metric-Driven Design Decisions</h2>
            <span className="text-xs text-gray-500 ml-auto">Each change is backed by a specific data point</span>
          </div>
          <div className="divide-y divide-gray-800">
            {METRIC_DECISIONS.map((item, i) => {
              const status = STATUS_CONFIG[item.status];
              const StatusIcon = status.icon;
              const MetricIcon = item.metric.icon;
              const isOpen = expandedDecisionIdx === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setExpandedDecisionIdx(isOpen ? null : i)}
                    className="w-full flex items-start gap-4 px-6 py-4 text-left hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Status icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-sm font-semibold text-white">{item.title}</span>
                      </div>
                      {/* Metric trigger */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 rounded-md px-2 py-0.5">
                          <MetricIcon className="h-3 w-3 text-rose-400" />
                          <span className="text-xs text-rose-300 font-medium">{item.metric.label}: {item.metric.value}</span>
                        </div>
                        <span className="text-xs text-gray-600 hidden sm:block">triggered this change</span>
                      </div>
                    </div>

                    {/* Badges + chevron */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[item.priority]}`}>
                        {item.priority}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? 'text-gray-400 bg-gray-800'}`}>
                        {item.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                        {item.status}
                      </span>
                      {isOpen
                        ? <ChevronUp className="h-4 w-4 text-gray-500 ml-1" />
                        : <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 ml-8 space-y-4 border-t border-gray-800 pt-4 bg-gray-950/50">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <TrendingDown className="h-3 w-3" /> Metric that triggered this
                          </p>
                          <p className="text-lg font-bold text-white">{item.metric.value}</p>
                          <p className="text-xs text-gray-500">{item.metric.label}</p>
                        </div>
                        <div className="sm:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Decision made</p>
                          <p className="text-sm text-gray-200 leading-relaxed">{item.decision}</p>
                        </div>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Why we made this change</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{item.reason}</p>
                      </div>
                      <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-xl p-4">
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3" /> Expected outcome
                        </p>
                        <p className="text-sm text-emerald-200 leading-relaxed">{item.expectedOutcome}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Generator */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">AI Design Improvement Generator</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {profile?.website_url
                    ? `Generating personalised recommendations for ${profile.website_url.replace(/^https?:\/\//, '')}`
                    : 'Add your website URL in Settings to get personalised recommendations'}
                </p>
              </div>
            </div>
            {aiImprovements.length > 0 && !aiLoading && (
              <button
                onClick={generateImprovements}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </button>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* Focus area selector */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Focus areas <span className="normal-case font-normal">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleFocus(area)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedFocus.includes(area)
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {aiImprovements.length === 0 && !aiLoading && !aiNotConfigured && !aiError && (
              <div className="text-center py-4">
                {hasProfile ? (
                  <button
                    onClick={generateImprovements}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Zap className="h-4 w-4" />
                    Generate AI Recommendations
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Add your website and business details first.</p>
                    <Link
                      to="/dashboard/settings"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Go to Settings
                    </Link>
                  </div>
                )}
              </div>
            )}

            {aiLoading && (
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-800 rounded-xl h-14" />
                ))}
                <p className="text-xs text-gray-600 text-center pt-1">Analysing your website with AI...</p>
              </div>
            )}

            {aiNotConfigured && !aiLoading && (
              <div className="text-center py-4 space-y-1">
                <p className="text-sm text-gray-400">OpenAI API key not configured.</p>
                <p className="text-xs text-gray-600">Add your <code className="text-gray-500">OPENAI_API_KEY</code> secret to enable AI recommendations.</p>
              </div>
            )}

            {aiError && !aiLoading && (
              <div className="flex items-start gap-2 text-sm text-rose-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{aiError}</span>
              </div>
            )}

            {!aiLoading && aiImprovements.length > 0 && (
              <div className="space-y-2">
                {aiImprovements.map((item, i) => {
                  const isOpen = expandedAiIdx === i;
                  const catStyle = AI_CATEGORY_COLORS[item.category] ?? 'text-gray-400 bg-gray-800';
                  return (
                    <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedAiIdx(isOpen ? null : i)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <span className="text-sm font-medium text-white truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${catStyle}`}>{item.category}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${AI_PRIORITY_STYLES[item.priority]}`}>{item.priority}</span>
                          {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Why it matters</p>
                            <p className="text-sm text-gray-300">{item.insight}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">What to do</p>
                            <p className="text-sm text-gray-200">{item.action}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Request a change */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-2">Request a Design Change</h2>
          <p className="text-sm text-gray-400 mb-4">
            Have a specific design update in mind? Send us a message and we will review it against your current metrics.
          </p>
          <Link
            to="/dashboard/messages"
            className="inline-flex items-center gap-2 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors"
          >
            Send a message <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
