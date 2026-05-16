/*
  # Add Search Console site URL to profiles

  ## Overview
  Adds a `search_console_site_url` column to the profiles table so users can
  connect their Google Search Console property during onboarding.

  ## Changes
  ### Modified Tables
  - `profiles`
    - `search_console_site_url` (text, nullable) — the verified site URL from
      Google Search Console (e.g. "https://example.com/" or "sc-domain:example.com")

  ## Notes
  1. Nullable — users can skip this step during onboarding.
  2. No RLS changes needed; existing profiles policies already cover this column.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'search_console_site_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN search_console_site_url text;
  END IF;
END $$;
