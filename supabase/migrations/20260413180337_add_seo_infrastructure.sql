/*
  # SEO Infrastructure

  ## Overview
  Adds full SEO tracking infrastructure with four new tables to support keyword
  ranking monitoring, SEO configuration per client, and growth opportunity tracking.

  ## New Tables

  ### seo_settings
  Stores per-client SEO configuration including target location, primary SEO goal,
  competitor URLs, and high-level metrics (domain authority, organic traffic, backlinks)
  that admins can update manually.
  - `id` - Unique identifier
  - `user_id` - FK to auth.users (one record per client)
  - `target_location` - Geographic focus (e.g. "London, UK")
  - `seo_goal` - Primary objective (e.g. "increase_traffic")
  - `competitors` - JSON array of competitor URLs
  - `domain_authority` - Current DA score (0–100)
  - `organic_traffic` - Monthly organic visitors
  - `backlinks` - Total backlink count
  - `created_at` / `updated_at`

  ### seo_keywords
  Target keywords the client wants to rank for.
  - `id` - Unique identifier
  - `user_id` - FK to auth.users
  - `keyword` - The keyword string
  - `monthly_search_volume` - Estimated monthly searches
  - `target_position` - Desired SERP position
  - `created_at`

  ### seo_rankings
  Historical SERP position snapshots per keyword.
  - `id` - Unique identifier
  - `keyword_id` - FK to seo_keywords
  - `user_id` - FK to auth.users (denormalised for easier RLS)
  - `position` - Recorded SERP position
  - `change_direction` - "up" | "down" | "stable"
  - `change_amount` - Absolute position change
  - `recorded_at` - Date of the snapshot (one per day max)

  ### seo_opportunities
  SEO improvement recommendations per client.
  - `id` - Unique identifier
  - `user_id` - FK to auth.users
  - `title` - Short action title
  - `description` - Detailed guidance
  - `impact` - "high" | "medium" | "low"
  - `effort` - "high" | "medium" | "low"
  - `status` - "pending" | "in_progress" | "completed"
  - `created_at` / `updated_at`

  ## Security
  - RLS enabled on all four tables
  - Clients can read their own data; cannot insert/update directly (admin-managed)
  - Clients CAN insert their own seo_keywords and seo_settings during onboarding
  - Admins (role = 'admin') have full access to all rows

  ## Notes
  1. One seo_settings row per user enforced via unique index.
  2. seo_rankings has a unique constraint per keyword_id + recorded_at to prevent duplicate daily snapshots.
*/

-- ─── seo_settings ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seo_settings (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_location  text        NOT NULL DEFAULT '',
  seo_goal         text        NOT NULL DEFAULT '',
  competitors      jsonb       NOT NULL DEFAULT '[]',
  domain_authority integer     NOT NULL DEFAULT 0,
  organic_traffic  integer     NOT NULL DEFAULT 0,
  backlinks        integer     NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS seo_settings_user_id_idx ON seo_settings(user_id);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SEO settings"
  ON seo_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SEO settings"
  ON seo_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SEO settings"
  ON seo_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all SEO settings"
  ON seo_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all SEO settings"
  ON seo_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ─── seo_keywords ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seo_keywords (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword               text        NOT NULL,
  monthly_search_volume integer     NOT NULL DEFAULT 0,
  target_position       integer     NOT NULL DEFAULT 10,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SEO keywords"
  ON seo_keywords FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SEO keywords"
  ON seo_keywords FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own SEO keywords"
  ON seo_keywords FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all SEO keywords"
  ON seo_keywords FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert SEO keywords for any user"
  ON seo_keywords FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update SEO keywords"
  ON seo_keywords FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete SEO keywords"
  ON seo_keywords FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ─── seo_rankings ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seo_rankings (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id       uuid        NOT NULL REFERENCES seo_keywords(id) ON DELETE CASCADE,
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position         integer     NOT NULL,
  change_direction text        NOT NULL DEFAULT 'stable',
  change_amount    integer     NOT NULL DEFAULT 0,
  recorded_at      date        NOT NULL DEFAULT CURRENT_DATE
);

CREATE UNIQUE INDEX IF NOT EXISTS seo_rankings_keyword_date_idx
  ON seo_rankings(keyword_id, recorded_at);

ALTER TABLE seo_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SEO rankings"
  ON seo_rankings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all SEO rankings"
  ON seo_rankings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert SEO rankings"
  ON seo_rankings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update SEO rankings"
  ON seo_rankings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete SEO rankings"
  ON seo_rankings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ─── seo_opportunities ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS seo_opportunities (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  impact      text        NOT NULL DEFAULT 'medium',
  effort      text        NOT NULL DEFAULT 'medium',
  status      text        NOT NULL DEFAULT 'pending',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE seo_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SEO opportunities"
  ON seo_opportunities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all SEO opportunities"
  ON seo_opportunities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert SEO opportunities"
  ON seo_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update SEO opportunities"
  ON seo_opportunities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete SEO opportunities"
  ON seo_opportunities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
