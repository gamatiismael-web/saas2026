import { Suspense } from 'react';
import AuthErrorContent from './error-content';

export const metadata = {
  title: 'Authentication Error',
  description: 'An error occurred during authentication.',
};

export const viewport = {
  themeColor: '#000000',
  userScalable: false,
};

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthErrorContent />
    </Suspense>
  );
}
