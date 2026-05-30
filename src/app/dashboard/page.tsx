import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth-config';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

// Server-side auth gate. getServerSession reads the session cookie directly
// from the incoming request and decrypts it with NEXTAUTH_SECRET, so it does
// not depend on client-side session hydration or the preview URL. If there is
// no valid session we redirect to login before any UI is sent to the browser.
export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return <DashboardShell user={session.user} />;
}
