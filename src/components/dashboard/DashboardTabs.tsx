'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Lightbulb, FileText, Settings, CreditCard, Users, Search } from 'lucide-react';
import { WebsiteMetricsTab } from './tabs/WebsiteMetricsTab';
import { SEORankingsTab } from './tabs/SEORankingsTab';
import { SEORecommendationsTab } from './tabs/SEORecommendationsTab';
import { AIRecommendationsTab } from './tabs/AIRecommendationsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { BillingTab } from './tabs/BillingTab';

type TabId = 'metrics' | 'seo' | 'seo-recs' | 'ai' | 'reports' | 'settings' | 'billing';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'metrics', label: 'Website Metrics', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'seo', label: 'SEO Rankings', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'seo-recs', label: 'SEO Recommendations', icon: <Search className="h-4 w-4" /> },
  { id: 'ai', label: 'AI Recommendations', icon: <Lightbulb className="h-4 w-4" /> },
  { id: 'reports', label: 'Reports & Exports', icon: <FileText className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
];

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('metrics');

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-800 overflow-x-auto">
        <div className="flex space-x-1 px-4 min-w-max md:min-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200
                flex items-center gap-2
                border-b-2 -mb-[2px]
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }
              `}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - with smooth fade transition */}
      <div className="py-8 px-4 animate-fadeIn">
        <div className="transition-opacity duration-200">
          {activeTab === 'metrics' && <WebsiteMetricsTab />}
          {activeTab === 'seo' && <SEORankingsTab />}
          {activeTab === 'seo-recs' && <SEORecommendationsTab />}
          {activeTab === 'ai' && <AIRecommendationsTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'billing' && <BillingTab />}
        </div>
      </div>
    </div>
  );
}
