import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[v0] Supabase config - URL exists:', !!supabaseUrl, 'Key exists:', !!supabaseAnonKey);

// If env vars are missing, create a placeholder client
let supabaseClient: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[v0] Missing Supabase environment variables. Using placeholder client.');
  // Create a mock client that won't crash the app
  supabaseClient = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => { throw new Error('Supabase not configured'); },
      signInWithPassword: async () => { throw new Error('Supabase not configured'); },
      signInWithOAuth: async () => { throw new Error('Supabase not configured'); },
      signOut: async () => { throw new Error('Supabase not configured'); },
      resetPasswordForEmail: async () => { throw new Error('Supabase not configured'); },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
    },
  });
}

export const supabase = supabaseClient;

export type Profile = {
  id: string;
  business_name: string | null;
  industry: string | null;
  website_url: string | null;
  phone: string | null;
  role: 'client' | 'admin';
  ga4_property_id: string | null;
  search_console_site_url: string | null;
  google_access_token: string | null;
  google_refresh_token: string | null;
  google_token_expiry: string | null;
  google_connected_email: string | null;
  created_at: string;
  updated_at: string;
};

export type Audit = {
  id: string;
  user_id: string | null;
  business_name: string;
  website_url: string;
  industry: string;
  business_goal: string;
  email: string;
  overall_score: number;
  homepage_clarity_score: number;
  seo_score: number;
  conversion_score: number;
  mobile_score: number;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  recommended_package: string;
  status: 'pending' | 'completed';
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  status: 'onboarding' | 'in_progress' | 'review' | 'live';
  stage: 'discovery' | 'design' | 'development' | 'launch';
  onboarding_progress: number;
  pages_in_scope: Array<{
    name: string;
    status: 'pending' | 'in_progress' | 'review' | 'completed';
  }>;
  launch_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: 'starter' | 'growth' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  monthly_price: number;
  billing_cycle_start: string;
  billing_cycle_end: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  awaiting_client: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Asset = {
  id: string;
  user_id: string;
  project_id: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  category: 'logo' | 'brand_guidelines' | 'images' | 'documents' | 'credentials';
  storage_path: string | null;
  uploaded_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  project_id: string | null;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
};
