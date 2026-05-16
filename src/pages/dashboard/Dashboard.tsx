import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { WebsiteSetupModal } from '../../components/dashboard/WebsiteSetupModal';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart2, Search, FileBarChart, Paintbrush, ArrowRight, Plus, Globe, TrendingUp } from 'lucide-react';

const features = [
  {
    id: 'analytics',
    label: 'Google Analytics',
    description: 'Track visitors, sessions, traffic sources, and user behaviour on your website.',
    icon: BarChart2,
    href: '/dashboard/analytics',
    accent: 'from-blue-600 to-blue-800',
    statLabel: 'View live data',
  },
  {
    id: 'seo',
    label: 'SEO Rankings',
    description: 'Monitor keyword positions, domain authority, and organic search performance.',
    icon: Search,
    href: '/dashboard/seo',
    accent: 'from-emerald-600 to-emerald-800',
    statLabel: 'Check rankings',
  },
  {
    id: 'reporting',
    label: 'Reporting',
    description: 'Access monthly performance reports, summaries, and growth insights.',
    icon: FileBarChart,
    href: '/dashboard/reporting',
    accent: 'from-amber-600 to-amber-800',
    statLabel: 'View reports',
  },
  {
    id: 'design',
    label: 'Design Improvements',
    description: 'Review recommended UI/UX enhancements and design change requests.',
    icon: Paintbrush,
    href: '/dashboard/design',
    accent: 'from-rose-600 to-rose-800',
    statLabel: 'See improvements',
  },
];

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);

  const hasWebsite = !!(profile?.website_url);

  return (
    <DashboardLayout>
      {showSetup && (
        <WebsiteSetupModal onClose={() => setShowSetup(false)} />
      )}

      {!hasWebsite ? (
        <EmptyState onAdd={() => setShowSetup(true)} name={profile?.business_name} />
      ) : (
        <div className="space-y-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {profile?.business_name || 'there'}
              </h1>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe className="h-4 w-4" />
                <a
                  href={profile.website_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {profile.website_url}
                </a>
              </div>
            </div>
            <button
              onClick={() => setShowSetup(true)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Edit Setup
            </button>
          </div>

          {(profile?.ga4_property_id || profile?.search_console_site_url) && (
            <div className="grid sm:grid-cols-2 gap-3">
              {profile?.ga4_property_id && (
                <div
                  onClick={() => navigate('/dashboard/analytics')}
                  className="group cursor-pointer bg-gray-900/60 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-4 flex items-center gap-3 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">Google Analytics</p>
                    <p className="text-xs text-gray-500 truncate">Property {profile.ga4_property_id}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              )}
              {profile?.search_console_site_url && (
                <div
                  onClick={() => navigate('/dashboard/seo')}
                  className="group cursor-pointer bg-gray-900/60 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Search className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">Search Console</p>
                    <p className="text-xs text-gray-500 truncate">{profile.search_console_site_url}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => navigate(feature.href)}
                  className="group relative text-left rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden transition-all duration-300 hover:border-gray-600 hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="p-8 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.accent}`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{feature.label}</h2>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">{feature.description}</p>
                    <div className="pt-5 border-t border-gray-800">
                      <span className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">{feature.statLabel} →</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function EmptyState({ onAdd, name }: { onAdd: () => void; name?: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center">
          <Globe className="h-10 w-10 text-gray-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-gray-950">
          <Plus className="h-4 w-4 text-white" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">
        Welcome{name ? `, ${name}` : ''}
      </h1>
      <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
        Add your website to get started. Once connected, you'll have access to analytics, SEO rankings, performance reports, and more.
      </p>

      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
      >
        <Plus className="h-5 w-5" />
        Add a website
      </button>

      <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm w-full">
        {[
          { icon: BarChart2, label: 'Analytics' },
          { icon: Search, label: 'SEO Rankings' },
          { icon: FileBarChart, label: 'Reports' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center opacity-40">
            <Icon className="h-5 w-5 text-gray-400 mx-auto mb-2" />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
