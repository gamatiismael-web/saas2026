import { useState, KeyboardEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  X, Globe, BarChart2, CheckCircle, ChevronRight, ExternalLink, ArrowRight,
  Search, Plus, Target, MapPin, Copy, Check,
} from 'lucide-react';

type Step = 'business' | 'ga4' | 'search-console' | 'seo' | 'done';

const SERVICE_ACCOUNT_EMAIL =
  import.meta.env.VITE_GA4_SERVICE_ACCOUNT_EMAIL ||
  'webpilot-analytics@your-project.iam.gserviceaccount.com';

const INDUSTRIES = [
  { value: '', label: 'Select your industry' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'healthcare', label: 'Healthcare & Wellness' },
  { value: 'home-services', label: 'Home Services' },
  { value: 'education', label: 'Education & Training' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'financial', label: 'Financial Services' },
  { value: 'other', label: 'Other' },
];

const SEO_GOALS = [
  { value: '', label: 'Select your primary goal' },
  { value: 'increase_traffic', label: 'Increase organic traffic' },
  { value: 'local_rankings', label: 'Improve local search rankings' },
  { value: 'generate_leads', label: 'Generate more organic leads' },
  { value: 'brand_visibility', label: 'Grow brand visibility' },
  { value: 'ecommerce_sales', label: 'Drive e-commerce sales' },
];

const STEPS: Step[] = ['business', 'ga4', 'search-console', 'seo'];
const STEP_INDEX: Record<Step, number> = {
  business: 0,
  ga4: 1,
  'search-console': 2,
  seo: 3,
  done: 4,
};

type Props = {
  onClose: () => void;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap flex-shrink-0"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function WebsiteSetupModal({ onClose }: Props) {
  const { profile, refreshProfile } = useAuth();

  const [step, setStep] = useState<Step>('business');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [businessName, setBusinessName] = useState(profile?.business_name || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [industry, setIndustry] = useState(profile?.industry || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [ga4PropertyId, setGa4PropertyId] = useState(profile?.ga4_property_id || '');
  const [searchConsoleSiteUrl, setSearchConsoleSiteUrl] = useState(profile?.search_console_site_url || '');

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [targetLocation, setTargetLocation] = useState('');
  const [seoGoal, setSeoGoal] = useState('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorInput, setCompetitorInput] = useState('');

  const stepIndex = STEP_INDEX[step];

  const addKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 5) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  };

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addKeyword(); }
  };

  const removeKeyword = (kw: string) => setKeywords(keywords.filter((k) => k !== kw));

  const addCompetitor = () => {
    const trimmed = competitorInput.trim();
    if (trimmed && !competitors.includes(trimmed) && competitors.length < 3) {
      setCompetitors([...competitors, trimmed]);
      setCompetitorInput('');
    }
  };

  const handleCompetitorKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addCompetitor(); }
  };

  const removeCompetitor = (url: string) => setCompetitors(competitors.filter((c) => c !== url));

  const saveBusinessInfo = async () => {
    if (!businessName.trim() || !websiteUrl.trim()) {
      setError('Business name and website URL are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({
          business_name: businessName.trim(),
          website_url: websiteUrl.trim(),
          industry,
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile!.id);
      if (err) throw err;
      setStep('ga4');
    } catch (e: any) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveGA4 = async (skip = false) => {
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({
          ga4_property_id: skip ? null : (ga4PropertyId.trim() || null),
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile!.id);
      if (err) throw err;
      setStep('search-console');
    } catch (e: any) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveSearchConsole = async (skip = false) => {
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({
          search_console_site_url: skip ? null : (searchConsoleSiteUrl.trim() || null),
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile!.id);
      if (err) throw err;
      setStep('seo');
    } catch (e: any) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveSeoAndFinish = async (skip = false) => {
    setSaving(true);
    setError('');
    try {
      const userId = profile!.id;

      if (!skip && (keywords.length > 0 || targetLocation.trim() || seoGoal)) {
        const { error: settingsErr } = await supabase
          .from('seo_settings')
          .upsert(
            {
              user_id: userId,
              target_location: targetLocation.trim(),
              seo_goal: seoGoal,
              competitors: competitors,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        if (settingsErr) throw settingsErr;

        if (keywords.length > 0) {
          const { error: delErr } = await supabase
            .from('seo_keywords')
            .delete()
            .eq('user_id', userId);
          if (delErr) throw delErr;

          const { error: insErr } = await supabase
            .from('seo_keywords')
            .insert(keywords.map((kw) => ({ user_id: userId, keyword: kw })));
          if (insErr) throw insErr;
        }
      }

      await refreshProfile();
      setStep('done');
    } catch (e: any) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header / stepper */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            {step !== 'done' && (
              <>
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        i < stepIndex
                          ? 'bg-emerald-500 text-white'
                          : i === stepIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-5 h-px ${i < stepIndex ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                    )}
                  </div>
                ))}
              </>
            )}
            {step === 'done' && (
              <span className="text-sm font-medium text-emerald-400">Setup complete</span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">

          {/* ── Step 1: Business ── */}
          {step === 'business' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Set up your website</h2>
                  <p className="text-sm text-gray-400">Tell us about your business</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Business Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Ltd"
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Website URL <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://www.yourwebsite.co.uk"
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    {INDUSTRIES.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0800 123 4567"
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button
                onClick={saveBusinessInfo}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
              >
                {saving ? 'Saving...' : (<>Continue <ChevronRight className="h-4 w-4" /></>)}
              </button>
            </div>
          )}

          {/* ── Step 2: Google Analytics GA4 ── */}
          {step === 'ga4' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Connect Google Analytics</h2>
                  <p className="text-sm text-gray-400">See real-time traffic data in your dashboard</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step 1 — Grant access</p>
                  <p className="text-sm text-gray-300">
                    Open{' '}
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5">
                      Google Analytics <ExternalLink className="h-3 w-3" />
                    </a>
                    , then go to <span className="text-white font-medium">Admin → Property Access Management</span> and add the service account below as a <span className="text-white font-medium">Viewer</span>:
                  </p>
                  <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                    <code className="text-xs text-blue-300 flex-1 break-all">{SERVICE_ACCOUNT_EMAIL}</code>
                    <CopyButton text={SERVICE_ACCOUNT_EMAIL} />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step 2 — Find your Property ID</p>
                  <p className="text-sm text-gray-300">
                    In GA4, go to <span className="text-white font-medium">Admin → Property Settings</span>. Your <span className="text-white font-medium">Property ID</span> is a number like <code className="text-blue-300 text-xs">123456789</code> shown at the top right.
                  </p>
                  <input
                    type="text"
                    value={ga4PropertyId}
                    onChange={(e) => setGa4PropertyId(e.target.value)}
                    placeholder="e.g. 123456789"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* How to enable the API */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Enable the API (one-time)</p>
                  <ol className="text-sm text-gray-300 space-y-1.5 list-decimal list-inside">
                    <li>Go to{' '}
                      <a href="https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com"
                        target="_blank" rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5">
                        Google Cloud Console <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>Select the project linked to your GA4 account</li>
                    <li>Search for <span className="text-white font-medium">Google Analytics Data API</span> and click <span className="text-white font-medium">Enable</span></li>
                  </ol>
                </div>
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => saveGA4(true)}
                  disabled={saving}
                  className="flex-1 py-3 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-medium rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => saveGA4(false)}
                  disabled={saving || !ga4PropertyId.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {saving ? 'Saving...' : (<>Continue <ArrowRight className="h-4 w-4" /></>)}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Google Search Console ── */}
          {step === 'search-console' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center flex-shrink-0">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Connect Search Console</h2>
                  <p className="text-sm text-gray-400">Track keyword impressions and click data from Google</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step 1 — Add the service account</p>
                  <p className="text-sm text-gray-300">
                    Open{' '}
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5">
                      Google Search Console <ExternalLink className="h-3 w-3" />
                    </a>
                    , select your property, then go to <span className="text-white font-medium">Settings → Users and permissions</span>. Add the email below as a <span className="text-white font-medium">Full user</span>:
                  </p>
                  <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                    <code className="text-xs text-blue-300 flex-1 break-all">{SERVICE_ACCOUNT_EMAIL}</code>
                    <CopyButton text={SERVICE_ACCOUNT_EMAIL} />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step 2 — Enter your site URL</p>
                  <p className="text-sm text-gray-300">
                    This is the exact URL shown in your Search Console property list. It can be a <span className="text-white font-medium">URL prefix</span> (e.g. <code className="text-blue-300 text-xs">https://example.com/</code>) or a <span className="text-white font-medium">Domain property</span> (e.g. <code className="text-blue-300 text-xs">sc-domain:example.com</code>).
                  </p>
                  <input
                    type="text"
                    value={searchConsoleSiteUrl}
                    onChange={(e) => setSearchConsoleSiteUrl(e.target.value)}
                    placeholder="https://www.yourwebsite.co.uk/ or sc-domain:yourwebsite.co.uk"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>

                {/* Enable the API */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Enable the API (one-time)</p>
                  <ol className="text-sm text-gray-300 space-y-1.5 list-decimal list-inside">
                    <li>Go to{' '}
                      <a href="https://console.cloud.google.com/apis/library/searchconsole.googleapis.com"
                        target="_blank" rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5">
                        Google Cloud Console <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>Select your Google Cloud project</li>
                    <li>Search for <span className="text-white font-medium">Google Search Console API</span> and click <span className="text-white font-medium">Enable</span></li>
                  </ol>
                </div>
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => saveSearchConsole(true)}
                  disabled={saving}
                  className="flex-1 py-3 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-medium rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => saveSearchConsole(false)}
                  disabled={saving || !searchConsoleSiteUrl.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {saving ? 'Saving...' : (<>Continue <ArrowRight className="h-4 w-4" /></>)}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: SEO Goals ── */}
          {step === 'seo' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">SEO Setup</h2>
                  <p className="text-sm text-gray-400">Tell us about your SEO goals</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-blue-400" />
                      Target Keywords
                      <span className="text-gray-500 font-normal ml-1">up to 5</span>
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeywordKeyDown}
                      placeholder="e.g. plumber london"
                      disabled={keywords.length >= 5}
                      className="flex-1 bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      disabled={!keywordInput.trim() || keywords.length >= 5}
                      className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((kw) => (
                        <span key={kw} className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full px-3 py-1">
                          {kw}
                          <button type="button" onClick={() => removeKeyword(kw)} className="text-blue-500 hover:text-blue-300 transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-400" />
                      Target Location
                    </span>
                  </label>
                  <input
                    type="text"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Primary SEO Goal</label>
                  <select
                    value={seoGoal}
                    onChange={(e) => setSeoGoal(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    {SEO_GOALS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Competitor Websites
                    <span className="text-gray-500 font-normal ml-1">up to 3</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={competitorInput}
                      onChange={(e) => setCompetitorInput(e.target.value)}
                      onKeyDown={handleCompetitorKeyDown}
                      placeholder="https://competitor.co.uk"
                      disabled={competitors.length >= 3}
                      className="flex-1 bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={addCompetitor}
                      disabled={!competitorInput.trim() || competitors.length >= 3}
                      className="px-3 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-lg transition-colors flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {competitors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {competitors.map((url) => (
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

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => saveSeoAndFinish(true)}
                  disabled={saving}
                  className="flex-1 py-3 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-medium rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => saveSeoAndFinish(false)}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {saving ? 'Saving...' : (<>Finish Setup <CheckCircle className="h-4 w-4" /></>)}
                </button>
              </div>
            </div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <div className="text-center space-y-5 py-2">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">You're all set!</h2>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Your website is connected and tracking is configured. Your dashboard is ready to use.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
