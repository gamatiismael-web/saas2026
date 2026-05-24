# Environment Variables Setup Guide

## Required Environment Variables

### Database Configuration

**DATABASE_URL**
- PostgreSQL connection string for Aurora PostgreSQL
- Format: `postgresql://user:password@host:port/database`
- Example: `postgresql://admin:password123@db.example.com:5432/webpilot`

### NextAuth Configuration

**NEXTAUTH_URL**
- Your application's public URL
- Example: `https://your-app.vercel.app`
- For local development: `http://localhost:3000`

**NEXTAUTH_SECRET**
- Secret key for encrypting sessions
- Generate: `openssl rand -base64 32`
- Keep this secure and never commit to git

### Scheduled Jobs

**CRON_SECRET**
- Secret token for securing cron endpoints
- Generate: `openssl rand -base64 32`
- Used to validate requests from Vercel Cron
- Configure in Vercel project settings

## Optional Environment Variables

### API Rate Limiting

**TRACKING_API_RATE_LIMIT**
- Maximum requests per minute to tracking endpoint
- Default: 1000
- Recommended for production: 5000-10000

**METRICS_API_RATE_LIMIT**
- Maximum requests per minute to metrics endpoints
- Default: 100
- Recommended for production: 500

### Analytics Configuration

**ANALYTICS_RETENTION_DAYS**
- How many days to retain raw tracking events
- Default: 90
- Events older than this are automatically deleted

**METRICS_AGGREGATION_BATCH_SIZE**
- Number of websites to process in each cron job
- Default: 50
- Increase if you have many websites

### Google Search Console (Future)

**GSC_CLIENT_ID**
- Google OAuth 2.0 Client ID
- Create at: https://console.cloud.google.com/

**GSC_CLIENT_SECRET**
- Google OAuth 2.0 Client Secret
- Keep this secure

## Setting Up Environment Variables

### Local Development

Create a `.env.local` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/webpilot

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Cron Jobs
CRON_SECRET=your-cron-secret-here

# Optional
TRACKING_API_RATE_LIMIT=1000
ANALYTICS_RETENTION_DAYS=90
```

**Never commit `.env.local` to git!**

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - Name: `VARIABLE_NAME`
   - Value: `variable_value`
   - Select environments: `Production`, `Preview`, `Development`

Example process:
```bash
# In your terminal
vercel env add DATABASE_URL
# Paste your production database URL

vercel env add NEXTAUTH_SECRET
# Paste your NextAuth secret

vercel env add NEXTAUTH_URL
# Paste https://your-production-url.vercel.app

vercel env add CRON_SECRET
# Paste your cron secret
```

4. Redeploy your project for changes to take effect:
```bash
vercel deploy --prod
```

### Reading Environment Variables in Code

**Server-side (Node.js/Next.js API routes)**:
```typescript
const dbUrl = process.env.DATABASE_URL;
const cronSecret = process.env.CRON_SECRET;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not set');
}
```

**Client-side (Browser)**:
```typescript
// Only public variables prefixed with NEXT_PUBLIC_
const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
```

## Verifying Environment Variables

### Check Local Variables
```bash
# View all local env vars
cat .env.local

# Test if a specific var is set
echo $DATABASE_URL
```

### Check Production Variables (Vercel)
```bash
# List all production env vars
vercel env ls --prod

# Pull production variables for local testing
vercel env pull
```

## Security Best Practices

1. **Never commit secrets to git**
   - Use `.env.local` which is in `.gitignore`
   - Use `.env.example` for template variables

2. **Rotate secrets regularly**
   - Update CRON_SECRET every 6 months
   - Rotate NEXTAUTH_SECRET if compromised

3. **Use different secrets per environment**
   - Development: Local/test values
   - Staging: Staging-specific credentials
   - Production: Production-only secrets

4. **Limit secret access**
   - Only share production secrets with team members who need them
   - Use Vercel's role-based access control

5. **Monitor secret usage**
   - Check logs for unusual access patterns
   - Review who has access to production secrets

## Troubleshooting

### Database Connection Failed
```
Error: connection refused
```
- Verify DATABASE_URL is correct
- Check if database server is running
- Test with: `psql $DATABASE_URL`

### Cron Jobs Not Running
```
Error: CRON_SECRET not configured
```
- Ensure CRON_SECRET is set in Vercel
- Verify cron endpoints are accessible
- Check Vercel project logs

### NextAuth Errors
```
Error: NEXTAUTH_SECRET is not set
```
- Set NEXTAUTH_SECRET in environment variables
- Regenerate if compromised: `openssl rand -base64 32`

### Session Not Persisting
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and cache
- Check database connectivity

## Example .env.example

```bash
# Database Configuration
# Get this from your database provider (Aurora PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth Configuration
# Your application's public URL
NEXTAUTH_URL=https://your-app.vercel.app

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Scheduled Jobs Configuration
# Generate with: openssl rand -base64 32
CRON_SECRET=your-generated-cron-secret-here

# Optional: API Rate Limiting
TRACKING_API_RATE_LIMIT=1000
METRICS_API_RATE_LIMIT=100

# Optional: Data Retention
ANALYTICS_RETENTION_DAYS=90
METRICS_AGGREGATION_BATCH_SIZE=50

# Optional: Google Search Console (Future)
# GSC_CLIENT_ID=your-gsc-client-id
# GSC_CLIENT_SECRET=your-gsc-client-secret
```

## Quick Start for New Developers

1. Clone the repository
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Ask a team lead for values and fill in `.env.local`
4. Run the application:
   ```bash
   npm run dev
   ```
5. Never commit `.env.local` to git

## Reference Links

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)
