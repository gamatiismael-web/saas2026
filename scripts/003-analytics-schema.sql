-- WebPilot Analytics Schema - Part 3: Website Analytics & Tracking

-- Create websites table to track user's websites
CREATE TABLE IF NOT EXISTS websites (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  url VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'failed')),
  
  -- Tracking configuration
  tracking_script_id VARCHAR(36) DEFAULT gen_random_uuid()::text,
  tracking_enabled BOOLEAN DEFAULT true,
  
  -- SEO configuration
  google_search_console_property_id VARCHAR(255),
  gsc_verified BOOLEAN DEFAULT false,
  
  -- Last data collection timestamps
  last_metrics_sync TIMESTAMPTZ,
  last_seo_sync TIMESTAMPTZ,
  last_health_check TIMESTAMPTZ,
  
  -- Collection status
  metrics_collection_status VARCHAR(50) DEFAULT 'pending' CHECK (metrics_collection_status IN ('pending', 'active', 'failed', 'paused')),
  
  -- Flags
  has_7_days_data BOOLEAN DEFAULT false,
  ai_recommendations_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create website_metrics table for aggregated metrics
CREATE TABLE IF NOT EXISTS website_metrics (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  website_id VARCHAR(36) REFERENCES websites(id) ON DELETE CASCADE NOT NULL,
  
  -- Timestamp for this metric snapshot (hourly or daily)
  metric_date DATE NOT NULL,
  metric_hour SMALLINT, -- 0-23, NULL for daily aggregates
  
  -- Traffic metrics
  visitors INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  
  -- Engagement metrics
  avg_session_duration NUMERIC(8, 2) DEFAULT 0, -- in seconds
  bounce_rate NUMERIC(5, 2) DEFAULT 0, -- percentage 0-100
  conversion_rate NUMERIC(5, 2) DEFAULT 0,
  
  -- Traffic sources
  organic_traffic INTEGER DEFAULT 0,
  direct_traffic INTEGER DEFAULT 0,
  referral_traffic INTEGER DEFAULT 0,
  social_traffic INTEGER DEFAULT 0,
  paid_traffic INTEGER DEFAULT 0,
  
  -- Device breakdown
  desktop_traffic INTEGER DEFAULT 0,
  mobile_traffic INTEGER DEFAULT 0,
  tablet_traffic INTEGER DEFAULT 0,
  
  -- Geographic data (JSON for flexibility)
  top_countries JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(website_id, metric_date, metric_hour)
);

-- Create tracking_events table for individual visitor events
CREATE TABLE IF NOT EXISTS tracking_events (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  website_id VARCHAR(36) REFERENCES websites(id) ON DELETE CASCADE NOT NULL,
  tracking_script_id VARCHAR(36) NOT NULL, -- matches website's tracking_script_id
  
  -- Visitor session tracking
  session_id VARCHAR(255) NOT NULL,
  visitor_id VARCHAR(255),
  
  -- Event data
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('pageview', 'session_start', 'session_end', 'conversion', 'custom')),
  page_url VARCHAR(255),
  referrer VARCHAR(255),
  
  -- Device & browser
  device_type VARCHAR(50),
  browser_name VARCHAR(100),
  browser_version VARCHAR(20),
  os_name VARCHAR(100),
  os_version VARCHAR(20),
  
  -- Location
  country_code VARCHAR(2),
  country_name VARCHAR(100),
  
  -- Session metrics
  session_duration INTEGER, -- in seconds
  pages_in_session SMALLINT DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create website_seo_keywords table for keyword tracking (separate from existing seo_keywords)
CREATE TABLE IF NOT EXISTS website_seo_keywords (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  website_id VARCHAR(36) REFERENCES websites(id) ON DELETE CASCADE NOT NULL,
  
  -- Keyword data
  keyword VARCHAR(255) NOT NULL,
  current_rank INTEGER DEFAULT 0,
  search_volume INTEGER DEFAULT 0,
  difficulty_score INTEGER DEFAULT 0, -- 0-100
  opportunity_score NUMERIC(5, 2) DEFAULT 0, -- calculated
  
  -- Ranking performance
  previous_rank INTEGER,
  rank_change_7_days INTEGER DEFAULT 0,
  rank_change_30_days INTEGER DEFAULT 0,
  
  -- Search metrics
  click_through_rate NUMERIC(5, 2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'tracking', 'archived')),
  
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create website_seo_rank_history table for rank history tracking
CREATE TABLE IF NOT EXISTS website_seo_rank_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  website_seo_keyword_id VARCHAR(36) REFERENCES website_seo_keywords(id) ON DELETE CASCADE NOT NULL,
  
  -- Historical rank data
  rank INTEGER NOT NULL,
  rank_date DATE NOT NULL,
  
  -- Historical metrics
  search_volume INTEGER DEFAULT 0,
  difficulty_score INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(website_seo_keyword_id, rank_date)
);

-- Create data_sync_logs table for monitoring collection status
CREATE TABLE IF NOT EXISTS data_sync_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  website_id VARCHAR(36) REFERENCES websites(id) ON DELETE CASCADE NOT NULL,
  
  -- Sync details
  sync_type VARCHAR(50) NOT NULL CHECK (sync_type IN ('metrics', 'seo', 'health_check')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'success', 'failed')),
  
  -- Error tracking
  error_message TEXT,
  error_code VARCHAR(50),
  
  -- Metrics about the sync
  records_collected INTEGER DEFAULT 0,
  sync_duration_ms INTEGER, -- milliseconds
  
  triggered_by VARCHAR(50) DEFAULT 'manual' CHECK (triggered_by IN ('manual', 'scheduled', 'webhook')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);
CREATE INDEX IF NOT EXISTS idx_websites_tracking_script_id ON websites(tracking_script_id);
CREATE INDEX IF NOT EXISTS idx_website_metrics_website_id ON website_metrics(website_id);
CREATE INDEX IF NOT EXISTS idx_website_metrics_date ON website_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_website_metrics_website_date ON website_metrics(website_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_website_id ON tracking_events(website_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_session_id ON tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON tracking_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_seo_keywords_website_id ON website_seo_keywords(website_id);
CREATE INDEX IF NOT EXISTS idx_website_seo_keywords_keyword ON website_seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_website_seo_rank_history_keyword_id ON website_seo_rank_history(website_seo_keyword_id);
CREATE INDEX IF NOT EXISTS idx_website_seo_rank_history_date ON website_seo_rank_history(rank_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_website_id ON data_sync_logs(website_id);
CREATE INDEX IF NOT EXISTS idx_data_sync_logs_created_at ON data_sync_logs(created_at DESC);
