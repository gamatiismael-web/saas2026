'use client';

// Combined sign in / sign up page backed by Aurora PostgreSQL via NextAuth.
import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type AuthMode = 'signin' | 'signup';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function switchMode(next: AuthMode) {
    setMode(next);
    setError('');
    setPassword('');
    setConfirmPassword('');
  }

  async function signInWithCredentials(emailValue: string, passwordValue: string) {
    // Use the NextAuth credentials callback directly. The next-auth/react
    // signIn() helper was not persisting the session cookie reliably in this
    // setup, whereas posting to the callback endpoint does. We fetch the CSRF
    // token first, then submit credentials.
    const { csrfToken } = await fetch('/api/auth/csrf').then((r) => r.json());

    const body = new URLSearchParams({
      csrfToken,
      email: emailValue,
      password: passwordValue,
      json: 'true',
    });

    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));

    // On failure NextAuth returns a url containing "error".
    if (!res.ok || (typeof data?.url === 'string' && data.url.includes('error'))) {
      throw new Error('Invalid email or password');
    }

    // Hard navigation so the SessionProvider re-reads the freshly set session
    // cookie from the server and lands on the dashboard.
    window.location.href = '/dashboard';
  }

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithCredentials(email, password);
    } catch (err) {
      console.error('[v0] Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Unable to sign in');
      setIsLoading(false);
    }
  }

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Could not create your account');
        setIsLoading(false);
        return;
      }

      // Account created — sign the user straight in and go to the dashboard.
      await signInWithCredentials(email, password);
    } catch (err) {
      console.error('[v0] Sign up error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (mode === 'signin') {
      handleSignIn();
    } else {
      handleSignUp();
    }
  }

  const isSignup = mode === 'signup';

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Value<span className="text-blue-500">-</span>Connection
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            {isSignup
              ? 'Create your account to get started'
              : 'Sign in to access your dashboard'}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Authentication options"
            className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-gray-800 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              onClick={() => switchMode('signin')}
              disabled={isLoading}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                !isSignup
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              onClick={() => switchMode('signup')}
              disabled={isLoading}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isSignup
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3"
            >
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
                autoComplete="name"
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              helperText={isSignup ? 'At least 8 characters' : undefined}
              required
            />

            {isSignup && (
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
            )}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignup ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : isSignup ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
              disabled={isLoading}
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
