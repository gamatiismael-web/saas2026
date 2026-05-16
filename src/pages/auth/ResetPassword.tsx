import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

type Stage = 'loading' | 'ready' | 'invalid' | 'done';

export function ResetPassword() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('loading');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token') ?? '';
      const tokenType = hash.get('type');

      if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (data.session) {
          setStage('ready');
        } else {
          console.error('Code exchange failed:', exchangeError?.message);
          const { data: { session } } = await supabase.auth.getSession();
          if (cancelled) return;
          setStage(session ? 'ready' : 'invalid');
        }
        return;
      }

      if (accessToken && tokenType === 'recovery') {
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (cancelled) return;
        if (data.session) {
          setStage('ready');
        } else {
          console.error('Session setup failed:', sessionError?.message);
          setStage('invalid');
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (session) {
        setStage('ready');
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
        if (cancelled) return;
        if (
          (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') &&
          s
        ) {
          setStage('ready');
        }
      });

      const timeout = setTimeout(() => {
        if (!cancelled) setStage('invalid');
      }, 8000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timeout);
      };
    };

    setup();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (stage === 'done') {
      const t = setTimeout(() => navigate('/login', { replace: true }), 3000);
      return () => clearTimeout(t);
    }
  }, [stage, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      await supabase.auth.signOut();
      setStage('done');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white tracking-tight">WebPilot</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-gray-400">Choose a strong password for your account</p>
        </div>

        <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-8">
          {stage === 'loading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Verifying your reset link...</p>
            </div>
          )}

          {stage === 'invalid' && (
            <div className="text-center py-4 space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Link expired or invalid</h3>
              <p className="text-sm text-gray-400">
                This reset link has already been used or has expired. Please request a new one.
              </p>
              <Link to="/forgot-password">
                <Button fullWidth>Request New Link</Button>
              </Link>
            </div>
          )}

          {stage === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Password updated</h3>
              <p className="text-sm text-gray-400">
                Your password has been changed. Redirecting you to sign in...
              </p>
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Go to Sign In
                </Button>
              </Link>
            </div>
          )}

          {stage === 'ready' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <KeyRound className="h-6 w-6 text-white" />
                </div>
              </div>

              {error && (
                <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="New Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                autoComplete="new-password"
              />

              <Button type="submit" size="lg" fullWidth disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}

          {stage !== 'loading' && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
