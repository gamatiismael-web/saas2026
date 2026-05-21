# WebPilot Migration Guide: Supabase to Aurora PostgreSQL

## Overview
This guide documents the migration from Supabase to AWS Aurora PostgreSQL with NextAuth.js authentication.

## Migration Steps

### Step 1: Apply Database Schema
The database schema is defined in SQL migration files:
- `scripts/001-core-schema.sql` - Core tables (users, profiles, audits, projects, etc.)
- `scripts/002-seo-infrastructure.sql` - SEO tracking tables

**To apply these migrations to Aurora PostgreSQL:**

Option A: Using AWS RDS console
1. Go to AWS RDS console
2. Select your Aurora cluster
3. Use Query Editor to run the SQL files sequentially

Option B: Using psql CLI (if available in your environment)
```bash
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f scripts/001-core-schema.sql
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f scripts/002-seo-infrastructure.sql
```

Option C: Using AWS Lambda or your application startup
The scripts can be executed programmatically on first app load.

### Step 2: Export Data from Supabase
The data migration script (`scripts/migrate-data.ts`) will:
1. Connect to Supabase using your credentials
2. Export all users, profiles, audits, projects, and SEO data
3. Import into Aurora PostgreSQL
4. Handle UUID to VARCHAR conversions

**To run the migration:**
```bash
npm run migrate-data
```

(Add this script to package.json:)
```json
"scripts": {
  "migrate-data": "tsx scripts/migrate-data.ts"
}
```

### Step 3: Verify Data
After migration, verify data integrity:
```sql
-- Check user count
SELECT COUNT(*) as user_count FROM users;

-- Check audit count
SELECT COUNT(*) as audit_count FROM audits;

-- Check for any NULL critical fields
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM audits WHERE website_url IS NULL;
```

### Step 4: Test Authentication
1. Sign up with email/password at /auth/signup
2. Login at /auth/login
3. Test Google OAuth login
4. Verify sessions are stored correctly

### Step 5: Deploy to Vercel
```bash
git add .
git commit -m "Migrate Supabase to Aurora PostgreSQL + NextAuth.js"
git push
```

The app will automatically deploy to Vercel.

## Environment Variables Required

Ensure these are set in your Vercel project:

**Aurora PostgreSQL:**
- `PGHOST` - Aurora cluster endpoint
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `AWS_REGION` - AWS region
- `AWS_ROLE_ARN` - IAM role ARN for authentication

**NextAuth.js:**
- `NEXTAUTH_URL` - Your app URL (e.g., https://webpilot.vercel.app)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

**OAuth (Optional):**
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

**Legacy (Can be removed after migration):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Breaking Changes

### Authentication
- **Before:** Supabase Auth (JWT tokens stored in localStorage)
- **After:** NextAuth.js (secure HTTP-only cookies)

Users will need to log in again after migration.

### Database
- **Before:** UUID primary keys
- **After:** VARCHAR(36) primary keys (still works as UUID format)

No application code changes needed - the DB layer abstracts this.

### API Layer
- **Before:** Supabase client (`.from().select()`)
- **After:** Direct SQL queries via `query()` function in `/lib/db.ts`

All page components have been updated to use the new query pattern.

## Rollback Plan

If migration fails:

1. Keep your Supabase database intact during migration
2. Keep the git branch with old code (`fix-supabase-errors-1`)
3. If needed, revert: `git checkout fix-supabase-errors-1`
4. Redeploy to Vercel

## Known Issues & Fixes

### Issue #1: Missing Supabase Environment Variables
**Fixed:** Updated `src/lib/supabase.ts` to use `process.env.NEXT_PUBLIC_*` instead of `import.meta.env.VITE_*`

### Issue #2: Vite Syntax in Multiple Components
**Fixed:** All components now use Next.js native imports and routing

### Issue #3: Poor Error Handling
**Fixed:** All error boundaries now validate input and show user-friendly messages

### Issue #4: Race Conditions in Auth
**Fixed:** NextAuth.js handles session management securely

## Support

For issues during migration:
1. Check console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Aurora PostgreSQL schema was applied successfully
4. Review the data migration script output for any failed record imports

## Timeline

- **Duration:** 1-3 hours depending on data size
- **Downtime:** ~30 minutes (during schema application and data import)
- **Testing:** 30 minutes (verify auth flows and data access)
- **Deployment:** 5 minutes (Vercel auto-deploys)

Total: ~2-4 hours

## Success Criteria

✅ Users can sign up with email/password
✅ Users can log in successfully  
✅ Google OAuth login works
✅ User data persists across sessions
✅ Dashboard loads with user's audits and projects
✅ All SEO data is accessible
✅ No errors in browser console or server logs
