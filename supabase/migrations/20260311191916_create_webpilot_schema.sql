/*
  # WebPilot UK Database Schema

  ## Overview
  This migration creates the complete database schema for WebPilot UK, a website growth platform for UK SMEs.

  ## New Tables

  ### 1. profiles
  Extended user profile information
  - `id` (uuid, FK to auth.users)
  - `business_name` (text)
  - `industry` (text)
  - `website_url` (text)
  - `phone` (text)
  - `role` (text) - 'client' or 'admin'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. audits
  Website audit submissions and results
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles, nullable for anonymous)
  - `business_name` (text)
  - `website_url` (text)
  - `industry` (text)
  - `business_goal` (text)
  - `email` (text)
  - `overall_score` (integer)
  - `homepage_clarity_score` (integer)
  - `seo_score` (integer)
  - `conversion_score` (integer)
  - `mobile_score` (integer)
  - `recommendations` (jsonb)
  - `recommended_package` (text)
  - `status` (text) - 'pending', 'completed'
  - `created_at` (timestamptz)

  ### 3. projects
  Client website projects
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `name` (text)
  - `status` (text) - 'onboarding', 'in_progress', 'review', 'live'
  - `stage` (text) - 'discovery', 'design', 'development', 'launch'
  - `onboarding_progress` (integer)
  - `pages_in_scope` (jsonb)
  - `launch_date` (date, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. subscriptions
  Client subscription plans
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `plan` (text) - 'starter', 'growth', 'pro'
  - `status` (text) - 'active', 'cancelled', 'expired'
  - `monthly_price` (numeric)
  - `billing_cycle_start` (date)
  - `billing_cycle_end` (date)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. assets
  Client uploaded files and assets
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `project_id` (uuid, FK to projects)
  - `file_name` (text)
  - `file_type` (text)
  - `file_size` (integer)
  - `category` (text) - 'logo', 'brand_guidelines', 'images', 'documents', 'credentials'
  - `storage_path` (text)
  - `uploaded_at` (timestamptz)

  ### 6. tasks
  Project tasks and action items
  - `id` (uuid, PK)
  - `project_id` (uuid, FK to projects)
  - `user_id` (uuid, FK to profiles)
  - `title` (text)
  - `description` (text)
  - `status` (text) - 'pending', 'in_progress', 'completed'
  - `awaiting_client` (boolean)
  - `due_date` (date, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. messages
  Communication between clients and admin
  - `id` (uuid, PK)
  - `sender_id` (uuid, FK to profiles)
  - `recipient_id` (uuid, FK to profiles)
  - `project_id` (uuid, FK to projects, nullable)
  - `subject` (text)
  - `content` (text)
  - `read` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Clients can only view/edit their own data
  - Admins can view/edit all data
  - Public can submit audits anonymously
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text,
  industry text,
  website_url text,
  phone text,
  role text DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  website_url text NOT NULL,
  industry text NOT NULL,
  business_goal text NOT NULL,
  email text NOT NULL,
  overall_score integer DEFAULT 0,
  homepage_clarity_score integer DEFAULT 0,
  seo_score integer DEFAULT 0,
  conversion_score integer DEFAULT 0,
  mobile_score integer DEFAULT 0,
  recommendations jsonb DEFAULT '[]'::jsonb,
  recommended_package text DEFAULT 'starter',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  status text DEFAULT 'onboarding' CHECK (status IN ('onboarding', 'in_progress', 'review', 'live')),
  stage text DEFAULT 'discovery' CHECK (stage IN ('discovery', 'design', 'development', 'launch')),
  onboarding_progress integer DEFAULT 0,
  pages_in_scope jsonb DEFAULT '[]'::jsonb,
  launch_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan text NOT NULL CHECK (plan IN ('starter', 'growth', 'pro')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  monthly_price numeric NOT NULL,
  billing_cycle_start date DEFAULT CURRENT_DATE,
  billing_cycle_end date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer DEFAULT 0,
  category text CHECK (category IN ('logo', 'brand_guidelines', 'images', 'documents', 'credentials')),
  storage_path text,
  uploaded_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  awaiting_client boolean DEFAULT false,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  subject text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Audits policies
CREATE POLICY "Anyone can submit audits"
  ON audits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own audits"
  ON audits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update audits"
  ON audits FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Projects policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Assets policies
CREATE POLICY "Users can view own assets"
  ON assets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can upload own assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own assets"
  ON assets FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Tasks policies
CREATE POLICY "Users can view related tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Messages policies
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());