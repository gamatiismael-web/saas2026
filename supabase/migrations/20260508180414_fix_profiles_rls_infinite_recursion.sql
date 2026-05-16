/*
  # Fix infinite recursion in profiles RLS SELECT policy

  The existing SELECT policy checks profiles.role by querying the profiles table
  from within a profiles policy, causing infinite recursion.

  Fix: replace the self-referencing subquery with auth.jwt() metadata check,
  which reads role from the JWT without touching the profiles table.
*/

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
