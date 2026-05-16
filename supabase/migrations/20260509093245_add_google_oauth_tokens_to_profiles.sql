/*
  # Add Google OAuth Token Storage to Profiles

  ## Summary
  Replaces the service account approach with per-user OAuth tokens so users can
  connect their own Google account instead of manually adding a service account email.

  ## Changes to profiles table
  - `google_access_token` (text, nullable) — short-lived Google OAuth access token
  - `google_refresh_token` (text, nullable) — long-lived refresh token used to get new access tokens
  - `google_token_expiry` (timestamptz, nullable) — when the current access token expires
  - `google_connected_email` (text, nullable) — the Google account email that was connected

  ## Security
  - Existing RLS policies on profiles cover these new columns automatically
  - Tokens are only accessible to the owning user via existing RLS
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'google_access_token'
  ) THEN
    ALTER TABLE profiles ADD COLUMN google_access_token text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'google_refresh_token'
  ) THEN
    ALTER TABLE profiles ADD COLUMN google_refresh_token text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'google_token_expiry'
  ) THEN
    ALTER TABLE profiles ADD COLUMN google_token_expiry timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'google_connected_email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN google_connected_email text;
  END IF;
END $$;
