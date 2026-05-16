import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  CheckCircle, AlertCircle, BarChart2, Search,
  LogOut, Loader2, ExternalLink,
} from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function GoogleConnectButton({
  connected,
  connectedEmail,
  onConnect,
  onDisconnect,
  loading,
}: {
  connected: boolean;
  connectedEmail: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  loading: boolean;
}) {
  if (connected) {
    return (
      <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Google account connected</p>
            {connectedEmail && (
              <p className="text-xs text-emerald-400">{connectedEmail}</p>
            )}
          </div>
        </div>
        <button
          onClick={onDisconnect}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-rose-400 transition-colors"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={loading}
      className="flex items-center gap-3 w-full px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium text-sm transition-all shadow-sm hover:shadow disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      Connect Google Account
    </button>
  );
}

export function Settings() {
  const { profile, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    businessName: profile?.business_name || '',
    industry: profile?.industry || '',
    websiteUrl: profile?.website_url || '',
    phone: profile?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // GA4 property ID (entered after connecting Google)
  const [ga4PropertyId, setGa4PropertyId] = useState(profile?.ga4_property_id || '');
  const [ga4Saving, setGa4Saving] = useState(false);
  const [ga4Status, setGa4Status] = useState<'idle' | 'success' | 'error'>('idle');

  // Search Console URL
  const [searchConsoleUrl, setSearchConsoleUrl] = useState(profile?.search_console_site_url || '');
  const [scSaving, setScSaving] = useState(false);
  const [scStatus, setScStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // OAuth state
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState('');
  const [notConfigured, setNotConfigured] = useState(false);

  const isGoogleConnected = !!(profile?.google_access_token || profile?.google_refresh_token);

  const handleConnectGoogle = async () => {
    setOauthLoading(true);
    setOauthError('');
    setNotConfigured(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/google-oauth?action=get-auth-url&redirect_uri=${encodeURIComponent(`${window.location.origin}/dashboard/settings`)}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Apikey': SUPABASE_ANON_KEY,
          },
        }
      );
      const data = await res.json();
      if (data.notConfigured) {
        setNotConfigured(true);
        return;
      }
      if (data.error) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: any) {
      setOauthError(err.message || 'Failed to start Google connection.');
      setOauthLoading(false);
    }
  };

  // Handle the Google redirect — Google returns ?code=... to our settings page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // Only handle if there's a code and we're on the settings page (not a Supabase auth callback)
    if (!code) return;
    // Supabase auth callbacks don't hit this page, so any ?code here is from Google

    window.history.replaceState({}, '', window.location.pathname);

    (async () => {
      setOauthLoading(true);
      setOauthError('');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/google-oauth?action=exchange-code`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
              'Apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              code,
              redirect_uri: `${window.location.origin}/dashboard/settings`,
            }),
          }
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        await refreshProfile();
      } catch (err: any) {
        setOauthError(err.message || 'Failed to connect Google account.');
      } finally {
        setOauthLoading(false);
      }
    })();
  }, []);

  const handleDisconnectGoogle = async () => {
    setOauthLoading(true);
    setOauthError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/google-oauth?action=disconnect`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Apikey': SUPABASE_ANON_KEY,
          },
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await refreshProfile();
    } catch (err: any) {
      setOauthError(err.message || 'Failed to disconnect.');
    } finally {
      setOauthLoading(false);
    }
  };

  const industries = [
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaveStatus('idle');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: formData.businessName,
          industry: formData.industry,
          website_url: formData.websiteUrl,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
      if (error) throw error;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGA4 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setGa4Saving(true);
    setGa4Status('idle');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ga4_property_id: ga4PropertyId.trim() || null, updated_at: new Date().toISOString() })
        .eq('id', profile.id);
      if (error) throw error;
      setGa4Status('success');
      setTimeout(() => setGa4Status('idle'), 3000);
    } catch {
      setGa4Status('error');
    } finally {
      setGa4Saving(false);
    }
  };

  const handleSaveSearchConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setScSaving(true);
    setScStatus('idle');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ search_console_site_url: searchConsoleUrl.trim() || null, updated_at: new Date().toISOString() })
        .eq('id', profile.id);
      if (error) throw error;
      setScStatus('success');
      setTimeout(() => setScStatus('idle'), 3000);
    } catch {
      setScStatus('error');
    } finally {
      setScSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Manage your account settings and integrations</p>
        </div>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Business Information</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Business Name"
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
              <Select
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                options={industries}
              />
              <Input
                label="Website URL"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.yourwebsite.co.uk"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0800 123 4567"
              />
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                {saveStatus === 'success' && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                    <CheckCircle className="h-4 w-4" /> Saved successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-1.5 text-sm text-rose-400">
                    <AlertCircle className="h-4 w-4" /> Failed to save
                  </span>
                )}
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Google Integrations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Google Integrations</h2>
                <p className="text-sm text-gray-400">Connect your Google account to enable Analytics and Search Console data</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-5">

              {/* Connect / Connected state */}
              <GoogleConnectButton
                connected={isGoogleConnected}
                connectedEmail={profile?.google_connected_email ?? null}
                onConnect={handleConnectGoogle}
                onDisconnect={handleDisconnectGoogle}
                loading={oauthLoading}
              />

              {!isGoogleConnected && (
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3 space-y-1">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Required redirect URI in Google Cloud Console</p>
                  <code className="text-xs text-blue-400 break-all select-all">{typeof window !== 'undefined' ? `${window.location.origin}/dashboard/settings` : ''}</code>
                </div>
              )}

              {notConfigured && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3 text-sm text-amber-400">
                  Google OAuth is not yet configured for this platform. Please contact support.
                </div>
              )}

              {oauthError && (
                <p className="flex items-center gap-1.5 text-sm text-rose-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /> {oauthError}
                </p>
              )}

              {/* GA4 Property ID — shown once connected */}
              {isGoogleConnected && (
                <div className="border-t border-gray-800 pt-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-blue-400" />
                    <p className="text-sm font-semibold text-white">Google Analytics 4</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Enter your GA4 Property ID. Find it in GA4 under{' '}
                    <span className="text-gray-200">Admin → Property Settings</span>.
                  </p>
                  <form onSubmit={handleSaveGA4} className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        label="Property ID"
                        type="text"
                        value={ga4PropertyId}
                        onChange={(e) => setGa4PropertyId(e.target.value)}
                        placeholder="e.g. 123456789"
                      />
                    </div>
                    <Button type="submit" disabled={ga4Saving || !ga4PropertyId.trim()}>
                      {ga4Saving ? 'Saving...' : 'Save'}
                    </Button>
                  </form>
                  {ga4Status === 'success' && (
                    <p className="flex items-center gap-1.5 text-sm text-emerald-400">
                      <CheckCircle className="h-4 w-4" /> Property ID saved
                    </p>
                  )}
                  {profile?.ga4_property_id && (
                    <p className="text-xs text-gray-500">
                      Currently connected to property <code className="text-blue-400">{profile.ga4_property_id}</code>
                    </p>
                  )}
                  <a
                    href="https://analytics.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Open Google Analytics <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Search Console — shown once connected */}
              {isGoogleConnected && (
                <div className="border-t border-gray-800 pt-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-emerald-400" />
                    <p className="text-sm font-semibold text-white">Google Search Console</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Enter the exact URL shown in your Search Console property list.
                  </p>
                  <form onSubmit={handleSaveSearchConsole} className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        label="Site URL"
                        type="text"
                        value={searchConsoleUrl}
                        onChange={(e) => setSearchConsoleUrl(e.target.value)}
                        placeholder="https://www.yourwebsite.co.uk/ or sc-domain:yourwebsite.co.uk"
                      />
                    </div>
                    <Button type="submit" disabled={scSaving || !searchConsoleUrl.trim()}>
                      {scSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </form>
                  {scStatus === 'success' && (
                    <p className="flex items-center gap-1.5 text-sm text-emerald-400">
                      <CheckCircle className="h-4 w-4" /> Site URL saved
                    </p>
                  )}
                  {profile?.search_console_site_url && (
                    <p className="text-xs text-gray-500">
                      Currently connected to <code className="text-emerald-400">{profile.search_console_site_url}</code>
                    </p>
                  )}
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Open Search Console <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

            </div>
          </CardBody>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
          </CardHeader>
          <CardBody>
            <form className="space-y-4">
              <Input label="Current Password" type="password" placeholder="Enter current password" />
              <Input label="New Password" type="password" placeholder="Enter new password" />
              <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
              <Button type="submit">Update Password</Button>
            </form>
          </CardBody>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-700" />
                <div>
                  <div className="font-medium text-white">Project Updates</div>
                  <div className="text-sm text-gray-300">Receive notifications about your project progress</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-700" />
                <div>
                  <div className="font-medium text-white">Performance Reports</div>
                  <div className="text-sm text-gray-300">Monthly website performance reports</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-700" />
                <div>
                  <div className="font-medium text-white">Marketing Emails</div>
                  <div className="text-sm text-gray-300">Tips and insights to grow your business</div>
                </div>
              </label>
            </div>
            <div className="mt-6">
              <Button>Save Preferences</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
