import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

function AuthLogo() {
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

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <AuthLogo />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
          <p className="text-gray-300">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="bg-gray-950 text-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-2">Check Your Email</h3>
                <p className="text-sm">
                  We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                </p>
              </div>
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-300">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-300 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
