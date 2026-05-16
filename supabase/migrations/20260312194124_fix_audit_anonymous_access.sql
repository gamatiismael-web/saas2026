/*
  # Fix Audit Anonymous Access

  ## Changes
  - Allow anonymous users to read audits
  - This enables the audit results page to work for non-authenticated users
  - Anonymous users can read any audit (since audits are public lead generation tools)

  ## Security Note
  - Audits are intentionally public as they're part of the lead generation funnel
  - No sensitive data is stored in audits
*/

-- Drop the existing select policy
DROP POLICY IF EXISTS "Users can view own audits" ON audits;

-- Create new select policy that allows anyone to read audits
CREATE POLICY "Anyone can view audits"
  ON audits FOR SELECT
  TO anon, authenticated
  USING (true);