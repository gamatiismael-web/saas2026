-- WebPilot UK Aurora PostgreSQL Schema - Part 1: Core Tables

-- Create users table (replacing Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255),
  industry VARCHAR(255),
  website_url VARCHAR(255),
  phone VARCHAR(20),
  google_oauth_tokens JSONB,
  search_console_property_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  business_goal TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  overall_score INTEGER DEFAULT 0,
  homepage_clarity_score INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  conversion_score INTEGER DEFAULT 0,
  mobile_score INTEGER DEFAULT 0,
  recommendations JSONB DEFAULT '[]'::jsonb,
  recommended_package VARCHAR(50) DEFAULT 'starter',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'onboarding' CHECK (status IN ('onboarding', 'in_progress', 'review', 'live')),
  stage VARCHAR(50) DEFAULT 'discovery' CHECK (stage IN ('discovery', 'design', 'development', 'launch')),
  onboarding_progress INTEGER DEFAULT 0,
  pages_in_scope JSONB DEFAULT '[]'::jsonb,
  launch_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('starter', 'growth', 'pro')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  monthly_price NUMERIC(10, 2) NOT NULL,
  billing_cycle_start DATE DEFAULT CURRENT_DATE,
  billing_cycle_end DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id VARCHAR(36) REFERENCES projects(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER DEFAULT 0,
  category VARCHAR(50) CHECK (category IN ('logo', 'brand_guidelines', 'images', 'documents', 'credentials')),
  storage_path VARCHAR(255),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id VARCHAR(36) REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  awaiting_client BOOLEAN DEFAULT false,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id VARCHAR(36) REFERENCES projects(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
