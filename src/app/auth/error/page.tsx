'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Callback: 'There was an error with the authentication callback.',
    OAuthSignin: 'Could not sign in with the OAuth provider.',
    OAuthCallback: 'OAuth callback failed. Please try again.',
    OAuthCreateAccount: 'Could not create OAuth account.',
    EmailCreateAccount: 'Could not create email account.',
    Callback: 'Callback error occurred.',
    OAuthAccountNotLinked: 'This email is associated with another account.',
    EmailSignInError: 'Email sign-in failed.',
    CredentialsSignin: 'Sign in failed. Check your credentials.',
    SessionCallback: 'Session callback error.',
    default: 'An authentication error occurred. Please try again.',
  };

  const message = error && errorMessages[error] ? errorMessages[error] : errorMessages.default;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-950 rounded-lg border border-gray-800 p-8">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-900/20 rounded-lg mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Authentication Error
        </h1>

        <p className="text-gray-400 text-center mb-6">
          {message}
        </p>

        {error && (
          <div className="bg-gray-900 rounded px-3 py-2 mb-6 text-xs text-gray-400 font-mono">
            Error: {error}
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors text-center"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
