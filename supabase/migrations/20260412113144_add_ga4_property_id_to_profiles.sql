/*
  # Add GA4 Property ID to Profiles

  ## Changes

  ### Modified Tables
  - `profiles`
    - Added `ga4_property_id` (text, nullable) — stores the user's Google Analytics 4 property ID (e.g. "123456789")

  ## Notes
  - This enables users to connect their GA4 property so real analytics data can be fetched
  - The field is optional; when empty, the dashboard shows placeholder data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'ga4_property_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ga4_property_id text;
  END IF;
END $$;
