import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const industries = [
    { value: '', label: 'Select your industry' },
    { value: 'professional-services', label: 'Professional Services' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'healthcare', label: 'Healthcare & Wellness' },
    { value: 'home-services', label: 'Home Services' },
    { value: 'education', label: 'Education & Training' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.businessName, formData.industry);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <AuthLogo />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-300">Start growing your business online today</p>
        </div>

        <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed mb-6"
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Name"
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Your Business Ltd"
            />

            <Select
              label="Industry"
              required
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              options={industries}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />

            <Button type="submit" size="lg" fullWidth disabled={loading || googleLoading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-300 hover:text-white">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
