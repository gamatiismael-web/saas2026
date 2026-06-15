'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { DashboardSidebar, TabId } from '@/components/dashboard/DashboardSidebar';

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardShell({ user }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('metrics');

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                Value<span className="text-blue-500">-</span>Connection
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-gray-400 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8 md:ml-64">
            <DashboardTabs activeTab={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
}
