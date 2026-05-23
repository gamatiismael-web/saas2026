# Database Setup Guide

## Problem
When trying to sign up, you get: `relation "users" does not exist`

This happens because the Aurora PostgreSQL database schema hasn't been initialized yet.

## Solution: Initialize Database Schema

You have two options:

### Option 1: Simple One-Click Initialization (Recommended)

1. Make sure your app is running:
```bash
npm run dev
```

2. In a new terminal, run:
```bash
chmod +x scripts/init-db.sh
./scripts/init-db.sh
```

3. You should see:
```
✅ Database initialization successful!
✨ Your database is now ready!
You can now sign up at: http://localhost:3000/auth/signup
```

### Option 2: Manual cURL Command

If the script doesn't work, manually call the initialization endpoint:

```bash
curl http://localhost:3000/api/db/init
```

You should get a response like:
```json
{
  "status": "success",
  "message": "Database schema initialized successfully",
  "tables": ["users", "profiles", "audits", "projects", "subscriptions", "assets", "tasks", "messages"]
}
```

### Option 3: Manual SQL Execution

If you have direct database access via AWS RDS Query Editor or psql:

```bash
psql -h $PGHOST -U $PGUSER -d $PGDATABASE < scripts/001-core-schema.sql
psql -h $PGHOST -U $PGUSER -d $PGDATABASE < scripts/002-seo-infrastructure.sql
```

## What Gets Created

The initialization creates these tables:
- **users** - User accounts
- **profiles** - User profiles with business info
- **audits** - Website audit submissions
- **projects** - Client projects
- **subscriptions** - Subscription plans
- **assets** - File uploads
- **tasks** - Project tasks
- **messages** - Client-admin messages
- **seo_keywords** - SEO keywords
- **seo_rankings** - SEO ranking history
- Plus 10+ indexes for performance

## After Initialization

Once the database is initialized:

1. ✅ Go to http://localhost:3000/auth/signup
2. ✅ Create a new account
3. ✅ You should now be able to sign up successfully!

## Troubleshooting

**Error: "Still says relation does not exist"**
- Run the init script again
- Check that all 3 files exist: `scripts/001-core-schema.sql`, `scripts/002-seo-infrastructure.sql`
- Verify your `PGHOST`, `PGDATABASE`, `PGUSER` are set correctly

**Error: "Connection refused"**
- Make sure your Aurora PostgreSQL is running
- Check your AWS security groups allow connections
- Verify IAM role has database permissions

**Error: "Permission denied"**
- The database user needs CREATE TABLE permission
- Check your IAM credentials are correct

## For Production (Vercel)

When deploying to Vercel:

1. Add all environment variables to Vercel project settings:
   - `PGHOST`, `PGDATABASE`, `PGUSER`, `AWS_REGION`, `AWS_ROLE_ARN`
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (if using Google OAuth)

2. After first deployment, call the initialization endpoint:
```bash
curl https://your-domain.vercel.app/api/db/init
```

3. Users can now sign up!

## Development vs Production

- **Local**: Tables are created via `/api/db/init` endpoint
- **Production**: Same endpoint can be called after deployment
- **Backup**: Always backup your database before running migrations
