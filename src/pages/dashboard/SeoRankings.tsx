import { useEffect, useState, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Search, TrendingUp, TrendingDown, Award, Link2,
  Minus, MapPin, Target, Clock, Settings, Plus, X, CheckCircle,
  AlertCircle, Pencil,
} from 'lucide-react';

type SeoSettings = {
  domain_authority: number;
  organic_traffic: number;
  backlinks: number;
  target_location: string;
  seo_goal: string;
  competitors: string[];
};

type SeoKeyword = {
  id: string;
  keyword: string;
  monthly_search_volume: number;
  target_position: number;
  latestRanking?: {
    position: number;
    change_direction: string;
    change_amount: number;
    recorded_at: string;
  };
};

type SeoOpportunity = {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  status: string;
};

const IMPACT_STYLES: Record<string, string> = {
  high: 'text-emerald-400 bg-emerald-400/10',
  medium: 'text-amber-400 bg-amber-400/10',
  low: 'text-gray-400 bg-gray-700',
};

const SEO_GOAL_LABELS: Record<string, string> = {
  increase_traffic: 'Increase organic traffic',
  local_rankings: 'Improve local search rankings',
  generate_leads: 'Generate more organic leads',
  brand_visibility: 'Grow brand visibility',
  ecommerce_sales: 'Drive e-commerce sales',
};

const SEO_GOALS = [
  { value: '', label: 'Select your primary goal' },
  { value: 'increase_traffic', label: 'Increase organic traffic' },
  { value: 'local_rankings', label: 'Improve local search rankings' },
  { value: 'generate_leads', label: 'Generate more organic leads' },
  { value: 'brand_visibility', label: 'Grow brand visibility' },
  { value: 'ecommerce_sales', label: 'Drive e-commerce sales' },
];

export function SeoRankings() {
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [opportunities, setOpportunities] = useState<SeoOpportunity[]>([]);

  // Setup / edit panel state
  const [showSetup, setShowSetup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  const [editLocation, setEditLocation] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editKeywords, setEditKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [editCompetitors, setEditCompetitors] = useState<string[]>([]);
  const [competitorInput, setCompetitorInput] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    fetchSeoData();
  }, [profile?.id]);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const [settingsRes, keywordsRes, opportunitiesRes] = await Promise.all([
        supabase.from('seo_settings').select('*').eq('user_id', profile!.id).maybeSingle(),
        supabase.from('seo_keywords').select('*').eq('user_id', profile!.id).order('created_at', { ascending: true }),
        supabase.from('seo_opportunities').select('*').eq('user_id', profile!.id).order('created_at', { ascending: true }),
      ]);

      if (settingsRes.data) {
        const s = settingsRes.data;
        setSeoSettings({
          domain_authority: s.domain_authority,
          organic_traffic: s.organic_traffic,
          backlinks: s.backlinks,
          target_location: s.target_location,
          seo_goal: s.seo_goal,
          competitors: s.competitors || [],
        });
      }

      const kwData: SeoKeyword[] = (keywordsRes.data || []).map((k) => ({
        id: k.id,
        keyword: k.keyword,
        monthly_search_volume: k.monthly_search_volume,
        target_position: k.target_position,
      }));

      if (kwData.length > 0) {
        const kwIds = kwData.map((k) => k.id);
        const { data: rankingsData } = await supabase
          .from('seo_rankings')
          .select('*')
          .in('keyword_id', kwIds)
          .order('recorded_at', { ascending: false });

        const latestByKeyword: Record<string, any> = {};
        for (const r of rankingsData || []) {
          if (!latestByKeyword[r.keyword_id]) latestByKeyword[r.keyword_id] = r;
        }

        setKeywords(kwData.map((kw) => ({
          ...kw,
          latestRanking: latestByKeyword[kw.id]
            ? {
                position: latestByKeyword[kw.id].position,
                change_direction: latestByKeyword[kw.id].change_direction,
                change_amount: latestByKeyword[kw.id].change_amount,
                recorded_at: latestByKeyword[kw.id].recorded_at,
              }
            : undefined,
        })));
      } else {
        setKeywords([]);
      }

      setOpportunities(opportunitiesRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  const openSetup = () => {
    setEditLocation(seoSettings?.target_location || '');
    setEditGoal(seoSettings?.seo_goal || '');
    setEditKeywords(keywords.map((k) => k.keyword));
    setEditCompetitors(seoSettings?.competitors || []);
    setKeywordInput('');
    setCompetitorInput('');
    setSaveStatus('idle');
    setSaveError('');
    setShowSetup(true);
  };

  const addKeyword = () => {
    const t = keywordInput.trim().toLowerCase();
    if (t && !editKeywords.includes(t) && editKeywords.length < 10) {
      setEditKeywords([...editKeywords, t]);
      setKeywordInput('');
    }
  };

  const handleKeywordKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addKeyword(); }
  };

  const removeKeyword = (kw: string) => setEditKeywords(editKeywords.filter((k) => k !== kw));

  const addCompetitor = () => {
    const t = competitorInput.trim();
    if (t && !editCompetitors.includes(t) && editCompetitors.length < 5) {
      setEditCompetitors([...editCompetitors, t]);
      setCompetitorInput('');
    }
  };

  const handleCompetitorKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addCompetitor(); }
  };

  const removeCompetitor = (url: string) => setEditCompetitors(editCompetitors.filter((c) => c !== url));

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    setSaveStatus('idle');
    setSaveError('');
    try {
      const { error: settingsErr } = await supabase
        .from('seo_settings')
        .upsert(
          {
            user_id: profile.id,
            target_location: editLocation.trim(),
            seo_goal: editGoal,
            competitors: editCompetitors,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      if (settingsErr) throw settingsErr;

      // Replace keywords
      const { error: delErr } = await supabase
        .from('seo_keywords')
        .delete()
        .eq('user_id', profile.id);
      if (delErr) throw delErr;

      if (editKeywords.length > 0) {
        const { error: insErr } = await supabase
          .from('seo_keywords')
          .insert(editKeywords.map((kw) => ({ user_id: profile.id, keyword: kw })));
        if (insErr) throw insErr;
      }

      setSaveStatus('success');
      await fetchSeoData();
      setTimeout(() => {
        setSaveStatus('idle');
        setShowSetup(false);
      }, 1200);
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save.');
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const rankedKeywords = keywords.filter((k) => k.latestRanking);
  const domainAuthority = seoSettings?.domain_authority ?? 0;
  const organicTraffic = seoSettings?.organic_traffic ?? 0;
  const backlinks = seoSettings?.backlinks ?? 0;
  const hasAnyData = seoSettings !== null || keywords.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SEO Rankings</h1>
              <p className="text-sm text-gray-400">Keyword positions · Updated weekly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {seoSettings?.target_location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                {seoSettings.target_location}
              </div>
            )}
            <button
              onClick={openSetup}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-sm rounded-lg transition-colors"
            >
              {hasAnyData ? <Pencil className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
              {hasAnyData ? 'Edit SEO Setup' : 'Configure SEO'}
            </button>
          </div>
        </div>

        {/* Inline setup / edit panel */}
        {showSetup && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-400" />
                {hasAnyData ? 'Edit SEO Configuration' : 'Set Up SEO Tracking'}
              </h2>
              <button onClick={() => setShowSetup(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Target Keywords */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Keywords
                  <span className="text-gray-500 font-normal ml-1.5">up to 10</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKey}
                    placeholder="e.g. plumber london"
                    disabled={editKeywords.length >= 10}
                    className="flex-1 bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    disabled={!keywordInput.trim() || editKeywords.length >= 10}
                    className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {editKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editKeywords.map((kw) => (
                      <span key={kw} className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full px-3 py-1">
                        {kw}
                        <button type="button" onClick={() => removeKeyword(kw)} className="text-emerald-500 hover:text-emerald-300 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Target Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-400" />
                    Target Location
                  </span>
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. London, UK"
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              {/* Primary SEO Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary SEO Goal</label>
                <select
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition appearance-none"
                >
                  {SEO_GOALS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Competitor Websites */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Competitor Websites
                  <span className="text-gray-500 font-normal ml-1.5">up to 5</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    onKeyDown={handleCompetitorKey}
                    placeholder="https://competitor.co.uk"
                    disabled={editCompetitors.length >= 5}
                    className="flex-1 bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={addCompetitor}
                    disabled={!competitorInput.trim() || editCompetitors.length >= 5}
                    className="px-3 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {editCompetitors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editCompetitors.map((url) => (
                      <span key={url} className="inline-flex items-center gap-1.5 text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-full px-3 py-1">
                        {url}
                        <button type="button" onClick={() => removeCompetitor(url)} className="text-gray-500 hover:text-gray-300 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {saveStatus === 'error' && (
              <p className="text-sm text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> {saveError}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
              {saveStatus === 'success' && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <CheckCircle className="h-4 w-4" /> Saved
                </span>
              )}
              <button
                onClick={() => setShowSetup(false)}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
                  <div className="h-3 bg-gray-800 rounded w-24 mb-3" />
                  <div className="h-7 bg-gray-800 rounded w-16 mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        ) : !hasAnyData && !showSetup ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <Target className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">SEO tracking not configured</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Set up your target keywords and SEO goals to start monitoring your search rankings.
            </p>
            <button
              onClick={openSetup}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Settings className="h-4 w-4" />
              Configure SEO Tracking
            </button>
          </div>
        ) : hasAnyData ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-1">Domain Authority</div>
                <div className="text-2xl font-bold text-white mb-1">{domainAuthority > 0 ? domainAuthority : '—'}</div>
                <div className="text-sm text-gray-500">{domainAuthority > 0 ? 'out of 100' : 'Pending assessment'}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-1">Organic Traffic</div>
                <div className="text-2xl font-bold text-white mb-1">{organicTraffic > 0 ? organicTraffic.toLocaleString() : '—'}</div>
                <div className="text-sm text-gray-500">{organicTraffic > 0 ? 'monthly visitors' : 'Pending data'}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-1">Keywords Tracked</div>
                <div className="text-2xl font-bold text-white mb-1">{keywords.length}</div>
                <div className="text-sm text-gray-500">{rankedKeywords.length} with position data</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-1">Backlinks</div>
                <div className="text-2xl font-bold text-white mb-1">{backlinks > 0 ? backlinks.toLocaleString() : '—'}</div>
                <div className="text-sm text-gray-500">{backlinks > 0 ? 'total backlinks' : 'Pending data'}</div>
              </div>
            </div>

            {seoSettings?.seo_goal && (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-5 py-3.5">
                <Target className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  <span className="text-gray-500">Primary goal: </span>
                  {SEO_GOAL_LABELS[seoSettings.seo_goal] || seoSettings.seo_goal}
                </span>
              </div>
            )}

            {keywords.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  Keyword Positions
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-gray-500 font-medium pb-3">Keyword</th>
                        <th className="text-right text-gray-500 font-medium pb-3">Position</th>
                        <th className="text-right text-gray-500 font-medium pb-3">Change</th>
                        <th className="text-right text-gray-500 font-medium pb-3">Volume / mo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw) => (
                        <tr key={kw.id} className="border-b border-gray-800/50 last:border-0">
                          <td className="py-3 text-gray-200">{kw.keyword}</td>
                          <td className="py-3 text-right font-semibold text-white">
                            {kw.latestRanking ? `#${kw.latestRanking.position}` : (
                              <span className="text-gray-500 font-normal flex items-center justify-end gap-1">
                                <Clock className="h-3 w-3" /> Tracking
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {!kw.latestRanking ? (
                              <span className="text-gray-600">—</span>
                            ) : kw.latestRanking.change_direction === 'stable' || kw.latestRanking.change_amount === 0 ? (
                              <span className="text-gray-500 flex items-center justify-end gap-0.5"><Minus className="h-3.5 w-3.5" /></span>
                            ) : kw.latestRanking.change_direction === 'up' ? (
                              <span className="text-emerald-400 flex items-center justify-end gap-0.5">
                                <TrendingUp className="h-3.5 w-3.5" /> +{kw.latestRanking.change_amount}
                              </span>
                            ) : (
                              <span className="text-rose-400 flex items-center justify-end gap-0.5">
                                <TrendingDown className="h-3.5 w-3.5" /> -{kw.latestRanking.change_amount}
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right text-gray-400">
                            {kw.monthly_search_volume > 0 ? kw.monthly_search_volume.toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rankedKeywords.length === 0 && keywords.length > 0 && (
                  <div className="mt-4 flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
                    <Clock className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <p className="text-sm text-amber-300/80">
                      Ranking data is being collected. Your first update will appear within 7 days.
                    </p>
                  </div>
                )}
              </div>
            )}

            {opportunities.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-emerald-400" />
                  Growth Opportunities
                </h2>
                <div className="space-y-3">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="flex items-start justify-between p-4 bg-gray-950 rounded-xl gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200">{opp.title}</p>
                        {opp.description && <p className="text-xs text-gray-500 mt-1">{opp.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${IMPACT_STYLES[opp.impact] || IMPACT_STYLES.medium}`}>
                          {opp.impact}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{opp.effort} effort</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {opportunities.length === 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-emerald-400" />
                  Growth Opportunities
                </h2>
                <div className="flex items-center gap-3 py-4 text-gray-500">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">
                    Our team will add personalised SEO recommendations here based on your site analysis.
                  </p>
                </div>
              </div>
            )}

            {seoSettings?.competitors && seoSettings.competitors.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  Competitors Tracked
                </h2>
                <div className="flex flex-wrap gap-2">
                  {seoSettings.competitors.map((url, i) => (
                    <span key={i} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-full px-3 py-1.5">
                      {url}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
