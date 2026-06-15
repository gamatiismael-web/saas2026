'use client';

import { WebsiteMetricsTab } from './tabs/WebsiteMetricsTab';
import { SEORankingsTab } from './tabs/SEORankingsTab';
import { SEORecommendationsTab } from './tabs/SEORecommendationsTab';
import { AIRecommendationsTab } from './tabs/AIRecommendationsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { BillingTab } from './tabs/BillingTab';
import { TabId } from './DashboardSidebar';

interface Props {
  activeTab: TabId;
}

const tabDescriptions: Record<TabId, { title: string; description: string }> = {
  metrics: {
    title: 'Website Metrics',
    description: 'Track visitor activity, engagement, and performance across your websites',
  },
  seo: {
    title: 'SEO Rankings',
    description: 'Monitor keyword positions and search visibility trends',
  },
  'seo-recs': {
    title: 'SEO Recommendations',
    description: 'Get actionable improvements to optimize your SEO',
  },
  ai: {
    title: 'AI Recommendations',
    description: 'Personalized insights powered by AI analysis of your data',
  },
  reports: {
    title: 'Reports & Exports',
    description: 'Generate custom reports and export your data',
  },
  settings: {
    title: 'Settings',
    description: 'Manage your account preferences and integrations',
  },
  billing: {
    title: 'Billing',
    description: 'View your subscription plan and billing history',
  },
};

export function DashboardTabs({ activeTab }: Props) {
  const currentTab = tabDescriptions[activeTab];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{currentTab.title}</h1>
        <p className="text-gray-400 text-sm">{currentTab.description}</p>
      </div>

      {/* Tab Content with fade transition */}
      <div className="transition-opacity duration-300">
        {activeTab === 'metrics' && <WebsiteMetricsTab />}
        {activeTab === 'seo' && <SEORankingsTab />}
        {activeTab === 'seo-recs' && <SEORecommendationsTab />}
        {activeTab === 'ai' && <AIRecommendationsTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'billing' && <BillingTab />}
      </div>
    </div>
  );
}
