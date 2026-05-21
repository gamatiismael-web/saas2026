# Deployment Guide - WebPilot to Vercel

## Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] All code is committed to GitHub
- [ ] Environment variables are set up in Vercel project settings
- [ ] Aurora PostgreSQL database schema is applied
- [ ] Data migration from Supabase is complete (if applicable)
- [ ] All tests pass locally (`npm run build` successful)
- [ ] No console errors in development
- [ ] NextAuth secret is generated (`openssl rand -base64 32`)

## Step 1: Prepare Your Git Repository

Ensure all changes are committed:

```bash
# Check status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "chore: Migrate Supabase to Aurora PostgreSQL + Next.js 16

- Upgraded from Vite+React to Next.js 16 with App Router
- Replaced Supabase with AWS Aurora PostgreSQL
- Implemented NextAuth.js for authentication
- Fixed 15+ critical bugs from previous version
- Added comprehensive migration documentation
- Enhanced security with HTTP-only cookies"

# Push to GitHub
git push origin main
```

## Step 2: Configure Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create new if first deployment)
3. Navigate to **Settings** → **Environment Variables**

Add the following variables:

### Required: Aurora PostgreSQL
```
PGHOST: your-aurora-cluster.rds.amazonaws.com
PGDATABASE: webpilot_prod
PGUSER: postgres
AWS_REGION: us-east-1
AWS_ROLE_ARN: arn:aws:iam::ACCOUNT_ID:role/WebPilotRole
```

### Required: NextAuth.js
```
NEXTAUTH_URL: https://your-domain.vercel.app
NEXTAUTH_SECRET: (generate with: openssl rand -base64 32)
```

### Optional: Google OAuth
```
GOOGLE_CLIENT_ID: xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET: xxx
```

### Optional: Analytics
```
NEXT_PUBLIC_GA4_PROPERTY_ID: G-XXXXXXXXXX
```

**Note:** Leave `NEXT_PUBLIC_SUPABASE_*` variables empty or removed - they're only needed for data migration.

## Step 3: Deploy to Vercel

### Option A: Automatic Deployment (Recommended)

If your repository is already connected to Vercel:

1. Commit and push to GitHub
2. Vercel automatically deploys on push
3. Monitor deployment in [Vercel Dashboard](https://vercel.com/dashboard)

### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
cd /vercel/share/v0-project
vercel --prod
```

Follow the prompts:
- Select your Vercel team/account
- Link to existing project or create new
- Confirm environment variables
- Start deployment

## Step 4: Database Schema on Production

**Critical:** Apply database schema to production Aurora instance before or during deployment:

### Using AWS RDS Console
1. Go to [AWS RDS Console](https://console.aws.amazon.com/rds)
2. Select your Aurora cluster
3. Open **Query Editor**
4. Run `scripts/001-core-schema.sql`
5. Run `scripts/002-seo-infrastructure.sql`

### Using AWS CLI
```bash
# If you have AWS CLI configured
aws rds execute-statement \
  --resource-arn "arn:aws:rds:REGION:ACCOUNT:cluster:CLUSTER_NAME" \
  --database "webpilot_prod" \
  --sql file://scripts/001-core-schema.sql
```

### Manual Connection (if you have access)
```bash
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f scripts/001-core-schema.sql
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f scripts/002-seo-infrastructure.sql
```

## Step 5: Data Migration (if applicable)

If migrating existing data from Supabase:

```bash
# Run locally first to test
npm run migrate-data

# If successful, verify with queries:
# SELECT COUNT(*) FROM users;
# SELECT COUNT(*) FROM audits;
# etc.
```

## Step 6: Verify Production Deployment

After Vercel deployment completes:

1. **Visit your production URL**
   - Go to your domain (e.g., `https://webpilot.vercel.app`)
   - Check that home page loads without errors

2. **Test Authentication**
   - Sign up with new email/password
   - Verify user appears in database
   - Log out and log back in
   - Test Google OAuth (if configured)

3. **Monitor Logs**
   - In Vercel Dashboard, go to **Deployments** → **Latest** → **Logs**
   - Check for any errors or warnings
   - Look for database connection success message

4. **Check Database Connection**
   - Create a test user
   - Verify record appears in Aurora database
   - Query: `SELECT * FROM users ORDER BY created_at DESC LIMIT 1;`

5. **Test Protected Routes**
   - Try accessing `/dashboard` without logging in
   - Should redirect to `/auth/login`
   - Log in and verify access works

## Common Deployment Issues

### Issue: `NEXTAUTH_SECRET` not set
**Solution:** Add `NEXTAUTH_SECRET` to Vercel environment variables (not `.env` file)

### Issue: Database connection timeout
**Solution:** 
- Check Aurora security group allows Vercel's IP
- Verify AWS RLS policies
- Ensure `AWS_ROLE_ARN` has correct permissions

### Issue: `PGHOST` or other env var undefined
**Solution:**
- Verify all env vars are set in Vercel settings (not in code)
- Redeploy after adding variables
- Clear browser cache (Vercel sometimes caches build errors)

### Issue: "User not found" after signup
**Solution:**
- Verify database schema was applied to production
- Check `users` table exists: `\dt users`
- Verify data is being inserted: `SELECT * FROM users;`

### Issue: Google OAuth returns error
**Solution:**
- Verify redirect URI in Google Cloud Console matches `NEXTAUTH_URL`
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure OAuth consent screen is configured

## Rollback Procedure

If production has critical issues:

1. **Immediate:** Set Vercel deployment to previous working version
   - Vercel Dashboard → Deployments → Select previous → Promote to Production

2. **Or revert in Git:**
   ```bash
   git log --oneline  # Find previous commit
   git revert <commit-hash>
   git push origin main
   # Vercel will automatically deploy the reverted code
   ```

3. **Notify users** if there was any data loss or service interruption

## Post-Deployment Monitoring

### Daily Monitoring
- [ ] Check Vercel deployment status
- [ ] Monitor error logs in Vercel
- [ ] Test sign-up/login flows manually
- [ ] Verify database backups are running

### Weekly Monitoring
- [ ] Review analytics (if GA4 configured)
- [ ] Check database query performance
- [ ] Monitor error rate trends
- [ ] Review user feedback

### Set Up Alerts (Optional)
- Vercel: Enable deployment notifications
- AWS RDS: Monitor CPU, connections, storage
- Configure Sentry or similar for error tracking

## Success Criteria

✅ App is live at your domain
✅ Sign-up creates new user in database
✅ Login/logout works correctly
✅ Google OAuth works (if configured)
✅ Protected routes redirect to login
✅ No JavaScript errors in console
✅ Database queries are fast (<100ms)
✅ HTTPS is enforced
✅ Environment variables are loaded
✅ Error logs are clean

## Support During Deployment

If issues arise during deployment:

1. Check **BUG_REPORT.md** for known issues
2. Review **MIGRATION_GUIDE.md** for Aurora-specific guidance
3. Check **TESTING_CHECKLIST.md** for verification steps
4. Review Vercel deployment logs for specific errors
5. Contact AWS support if database connection issues persist

## What's Next?

After successful deployment:

1. **Set up monitoring** - Configure error tracking, analytics
2. **Configure backups** - Enable RDS automated backups
3. **Set up CI/CD** - GitHub Actions for automated testing
4. **Monitor costs** - Review Vercel and AWS bills
5. **Plan feature roadmap** - Use GitHub Issues for feature tracking

## Post-Deployment Tasks

- [ ] Update DNS records if using custom domain
- [ ] Set up SSL certificate (Vercel handles automatically)
- [ ] Configure Vercel preview deployments
- [ ] Set up GitHub branch protection rules
- [ ] Create team access if multiple developers
- [ ] Document team runbook for future deployments
