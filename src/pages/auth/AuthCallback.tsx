import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function getUrlParam(key: string): string | null {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.substring(1));
  return query.get(key) || hash.get(key);
}

export function AuthCallback() {
  const navigate = useNavigate();
  const resolved = useRef(false);
  const exchanged = useRef(false);

  const resolve = (path: string) => {
    if (!resolved.current) {
      resolved.current = true;
      navigate(path, { replace: true });
    }
  };

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const errorParam = getUrlParam('error_description') || getUrlParam('error');
    if (errorParam) {
      resolve(`/login?error=oauth_failed&reason=${encodeURIComponent(errorParam)}`);
      return;
    }

    // The `type` param is set by Supabase for password recovery emails.
    // It is the most reliable signal — check it before anything else.
    const typeParam = getUrlParam('type');
    const isRecovery = typeParam === 'recovery';

    const code = getUrlParam('code');

    if (code) {
      supabase.auth
        .exchangeCodeForSession(window.location.href)
        .then(({ data, error }) => {
          if (error) {
            resolve(`/login?error=oauth_failed&reason=${encodeURIComponent(error.message)}`);
            return;
          }
          if (data.session) {
            // Use the URL type param or AMR to detect recovery
            const hasRecoveryAmr = data.session.user?.amr?.some(
              (m: { method: string }) => m.method === 'recovery' || m.method === 'otp'
            );
            if (isRecovery || hasRecoveryAmr) {
              resolve('/reset-password');
            } else {
              resolve('/dashboard');
            }
          } else {
            resolve('/login?error=oauth_failed');
          }
        });
      return;
    }

    // Hash-based flow (implicit / magic link)
    const accessToken = getUrlParam('access_token');
    const tokenType = getUrlParam('type');

    if (accessToken && tokenType === 'recovery') {
      resolve('/reset-password');
      return;
    }

    if (accessToken) {
      resolve('/dashboard');
      return;
    }

    // Fall back to listening for auth state events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        resolve('/reset-password');
      } else if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        resolve('/dashboard');
      }
    });

    const timeout = setTimeout(async () => {
      if (resolved.current) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        resolve('/dashboard');
      } else {
        resolve('/login?error=oauth_failed');
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-300 text-sm">Please wait...</p>
      </div>
    </div>
  );
}
