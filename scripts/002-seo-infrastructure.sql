-- WebPilot UK Aurora PostgreSQL Schema - Part 2: SEO Infrastructure

-- Create seo_settings table
CREATE TABLE IF NOT EXISTS seo_settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  target_location VARCHAR(255) NOT NULL DEFAULT '',
  seo_goal VARCHAR(255) NOT NULL DEFAULT '',
  competitors JSONB NOT NULL DEFAULT '[]'::jsonb,
  domain_authority INTEGER NOT NULL DEFAULT 0,
  organic_traffic INTEGER NOT NULL DEFAULT 0,
  backlinks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create seo_keywords table
CREATE TABLE IF NOT EXISTS seo_keywords (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  monthly_search_volume INTEGER NOT NULL DEFAULT 0,
  target_position INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create seo_rankings table
CREATE TABLE IF NOT EXISTS seo_rankings (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  keyword_id VARCHAR(36) NOT NULL REFERENCES seo_keywords(id) ON DELETE CASCADE,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  change_direction VARCHAR(50) NOT NULL DEFAULT 'stable' CHECK (change_direction IN ('up', 'down', 'stable')),
  change_amount INTEGER NOT NULL DEFAULT 0,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create unique index for one ranking per keyword per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_rankings_keyword_date ON seo_rankings(keyword_id, recorded_at);

-- Create seo_opportunities table
CREATE TABLE IF NOT EXISTS seo_opportunities (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  impact VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (impact IN ('high', 'medium', 'low')),
  effort VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (effort IN ('high', 'medium', 'low')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for SEO tables
CREATE INDEX IF NOT EXISTS idx_seo_settings_user_id ON seo_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_user_id ON seo_keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_rankings_user_id ON seo_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_rankings_keyword_id ON seo_rankings(keyword_id);
CREATE INDEX IF NOT EXISTS idx_seo_opportunities_user_id ON seo_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_opportunities_status ON seo_opportunities(status);
