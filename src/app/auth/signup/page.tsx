import { redirect } from 'next/navigation';

// Sign in and sign up now live on a single combined auth page.
export default function SignupRedirect() {
  redirect('/auth/login');
}
