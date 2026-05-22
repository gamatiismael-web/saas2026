'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-white">
              Value<span className="text-blue-500">-</span>Connection
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-2 px-3 py-2 rounded text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Welcome Card */}
          <div className="md:col-span-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session.user?.name}!
            </h1>
            <p className="text-gray-400">
              You&apos;re logged in to your Value-Connection dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Active Projects</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Audits Completed</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Current Plan</p>
            <p className="text-lg font-bold text-white">Free Trial</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/">
              <Button variant="outline" fullWidth>
                View Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" fullWidth>
                Contact Support
              </Button>
            </Link>
            <Button variant="outline" fullWidth disabled>
              Create Project (Coming Soon)
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
