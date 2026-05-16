import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  Settings,
  LogOut,
  Shield,
  BarChart2,
  Search,
  FileBarChart,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function SidebarLogo() {
  return (
    <svg width="100" height="32" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8L18 32H22L32 8H27L20 26L13 8H8Z" fill="#FFFFFF"/>
      <g opacity="0.6">
        <circle cx="42" cy="20" r="2" fill="#FFFFFF"/>
        <circle cx="50" cy="20" r="2" fill="#FFFFFF"/>
        <circle cx="58" cy="20" r="2" fill="#FFFFFF"/>
        <path d="M42 20 L50 20 L58 20" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2"/>
      </g>
      <path d="M88 8C80 8 73 15 73 23C73 31 80 38 88 38C92 38 95.5 36.5 98 34L94 29.5C92.5 31 90.5 32 88 32C84 32 80 28 80 23C80 18 84 14 88 14C90.5 14 92.5 15 94 16.5L98 12C95.5 9.5 92 8 88 8Z" fill="#FFFFFF"/>
    </svg>
  );
}

export function DashboardSidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const clientNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Google Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { name: 'SEO Rankings', href: '/dashboard/seo', icon: Search },
    { name: 'Reporting', href: '/dashboard/reporting', icon: FileBarChart },
    { name: 'AI Recommendations', href: '/dashboard/design', icon: Sparkles },
    { name: 'My Project', href: '/dashboard/project', icon: FolderKanban },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Admin Overview', href: '/admin', icon: Shield },
    { name: 'Clients', href: '/admin/clients', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Audits', href: '/admin/audits', icon: FileText },
  ];

  const navigation = profile?.role === 'admin' ? adminNavigation : clientNavigation;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center justify-center">
          <SidebarLogo />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                  ? 'bg-black text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-4 px-4">
          <p className="text-xs text-gray-400 mb-1">Logged in as</p>
          <p className="text-sm font-medium truncate">{profile?.business_name || 'User'}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
