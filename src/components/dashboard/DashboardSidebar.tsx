'use client';

import { BarChart3, TrendingUp, Lightbulb, FileText, Settings, CreditCard, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export type TabId = 'metrics' | 'seo' | 'seo-recs' | 'ai' | 'reports' | 'settings' | 'billing';

interface Tab {
  id: TabId;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const TABS: Tab[] = [
  { id: 'metrics', label: 'Website Metrics', description: 'Track visitor activity and engagement', icon: <BarChart3 className="h-5 w-5" /> },
  { id: 'seo', label: 'SEO Rankings', description: 'Monitor keyword rankings', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 'seo-recs', label: 'SEO Recommendations', description: 'Get actionable SEO improvements', icon: <Search className="h-5 w-5" /> },
  { id: 'ai', label: 'AI Recommendations', description: 'AI-powered insights from your data', icon: <Lightbulb className="h-5 w-5" /> },
  { id: 'reports', label: 'Reports & Exports', description: 'Generate and download reports', icon: <FileText className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', description: 'Manage your account preferences', icon: <Settings className="h-5 w-5" /> },
  { id: 'billing', label: 'Billing', description: 'View your subscription and invoices', icon: <CreditCard className="h-5 w-5" /> },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 md:hidden p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white transition-colors"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-gray-950 border-r border-gray-800 overflow-y-auto
          transition-transform duration-300 z-40
          md:translate-x-0 md:relative md:top-0 md:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group
                flex items-start gap-3
                ${
                  activeTab === tab.id
                    ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                    : 'border border-transparent text-gray-400 hover:bg-gray-900 hover:text-gray-300'
                }
              `}
            >
              <div className="mt-1 flex-shrink-0">{tab.icon}</div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm leading-tight">{tab.label}</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 mt-0.5 line-clamp-1">
                  {tab.description}
                </p>
              </div>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
