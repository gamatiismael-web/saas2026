# Deployment & Testing Checklist

## Pre-Deployment Checklist

### Database
- [ ] Aurora PostgreSQL instance created and accessible
- [ ] Database schema migrations applied (001, 002, 003)
- [ ] All tables created and indexes built
- [ ] Database user with appropriate permissions configured
- [ ] DATABASE_URL tested and working

### Environment Variables
- [ ] NEXTAUTH_URL set to production domain
- [ ] NEXTAUTH_SECRET generated and set (not committed to git)
- [ ] CRON_SECRET generated and set for scheduled jobs
- [ ] All required env vars in Vercel dashboard
- [ ] No sensitive values in public files or comments

### Authentication
- [ ] NextAuth configured and working locally
- [ ] Session management tested
- [ ] User creation/login tested
- [ ] CORS configured for tracking script

### Tracking Script
- [ ] vc-analytics.js deployed to public folder
- [ ] Script accepts tracking_script_id via URL params
- [ ] Cross-origin requests properly configured
- [ ] Test page created to verify script loading

### APIs
- [ ] POST /api/tracking/events - receiving events
- [ ] POST /api/analytics/websites - creating websites
- [ ] GET /api/analytics/websites - listing websites
- [ ] GET /api/analytics/metrics - retrieving metrics
- [ ] POST /api/analytics/aggregate - triggering aggregation
- [ ] All endpoints return proper error responses

### Scheduled Jobs
- [ ] Cron endpoints configured in vercel.json
- [ ] CRON_SECRET properly secured
- [ ] POST /api/cron/aggregate-hourly - tested
- [ ] POST /api/cron/aggregate-daily - tested
- [ ] POST /api/cron/health-check - tested
- [ ] Cron jobs can access database

### Frontend
- [ ] Analytics dashboard page loads
- [ ] useWebsites hook fetches websites
- [ ] useWebsiteMetrics hook fetches metrics
- [ ] AddWebsiteModal displays tracking script
- [ ] MetricsDisplay shows data correctly
- [ ] Responsive design tested on mobile/tablet

### Security
- [ ] No API keys in frontend code
- [ ] Tracking endpoint validates script IDs
- [ ] Admin endpoints require authentication
- [ ] Rate limiting implemented
- [ ] SQL injection protection (parameterized queries)
- [ ] CSRF protection enabled

## Local Testing Guide

### 1. Database Setup
```bash
# Create test database
createdb webpilot_test

# Set DATABASE_URL
export DATABASE_URL="postgresql://localhost:5432/webpilot_test"

# Run migrations
curl http://localhost:3000/api/db/init
curl http://localhost:3000/api/db/migrate-analytics
```

### 2. Create Test Website
```bash
# Create a website via API
curl -X POST http://localhost:3000/api/analytics/websites \
  -H "Content-Type: application/json" \
  -b "sessionId=test_session" \
  -d '{
    "url": "https://example.com",
    "name": "Test Website"
  }'

# Save the tracking_script_id from response
```

### 3. Test Tracking Script
```html
<!-- Create test.html -->
<script>
  window.vc_api_endpoint = 'http://localhost:3000';
</script>
<script src="http://localhost:3000/vc-analytics.js?id=YOUR_TRACKING_ID"></script>
<h1>Test Page</h1>
<p>Open console - should see tracking events being sent</p>
```

### 4. Generate Test Events
```bash
# Visit test.html multiple times, then check if events were recorded
curl http://localhost:3000/api/analytics/metrics?website_id=WEBSITE_ID

# Manually trigger aggregation
curl -X POST http://localhost:3000/api/analytics/aggregate \
  -H "Content-Type: application/json" \
  -d '{"website_id": "WEBSITE_ID"}'
```

### 5. Test Scheduled Jobs
```bash
# Test hourly aggregation
curl -X POST http://localhost:3000/api/cron/aggregate-hourly \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test daily aggregation
curl -X POST http://localhost:3000/api/cron/aggregate-daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test health check
curl -X POST http://localhost:3000/api/cron/health-check \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Production Testing Guide

### 1. Post-Deployment Verification
```bash
# Check API endpoints
curl https://your-app.vercel.app/api/analytics/websites

# Check tracking script is accessible
curl https://your-app.vercel.app/vc-analytics.js

# Check database connection
# (See query in server logs)
```

### 2. Test Full User Flow
1. Deploy to Vercel production
2. Login to dashboard
3. Add a test website
4. Copy tracking script
5. Create a test HTML page with script
6. Visit test page multiple times
7. Wait 2-5 minutes for aggregation
8. Check dashboard - metrics should appear

### 3. Monitor Scheduled Jobs
```bash
# Check Vercel Deployments
# https://vercel.com/dashboard -> select project
# Look for successful cron job runs in logs

# Check data_sync_logs table
SELECT * FROM data_sync_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### 4. Performance Testing
- Load dashboard with 100+ websites
- Add website with 1000+ daily events
- Verify metrics load within 2 seconds
- Check database query times

## Error Scenarios to Test

### Database Failures
- [ ] Database connection lost → graceful error message
- [ ] Query timeout → retry mechanism works
- [ ] Migration fails → clear error in logs

### Tracking Failures
- [ ] Invalid tracking script ID → returns 400
- [ ] Missing required fields → returns 400
- [ ] Large payload → accepted or rejected with clear error

### Authentication Failures
- [ ] No session → redirected to login
- [ ] Expired session → prompts re-login
- [ ] Wrong website ownership → 404 response

### Cron Job Failures
- [ ] Missing CRON_SECRET → 401 response
- [ ] Database unavailable → logged and retried
- [ ] Partial failure → continues with other websites

## Performance Monitoring

### Key Metrics to Monitor
1. **API Response Times**
   - Tracking endpoint: < 100ms
   - Metrics retrieval: < 500ms
   - Aggregation: < 5s

2. **Database Performance**
   - Query execution: < 100ms
   - Slow query log: enabled
   - Index usage: verified

3. **Scheduled Job Health**
   - Success rate: > 99%
   - Average duration: < 2 minutes
   - Failed websites < 1%

### Vercel Analytics
- Check dashboard for API response times
- Monitor function duration
- Check error rates

### Database Monitoring
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname, 
  tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Rollback Procedures

### Quick Rollback (if critical issues)
```bash
# Revert to previous deployment
vercel rollback

# Or manually redeploy from git
git revert <commit-hash>
git push
```

### Database Rollback
```bash
# Keep backups of prod database
# Contact your database provider for point-in-time restore

# Or manually restore from backup
pg_restore -d webpilot backup.sql
```

### Feature Flags (for safer releases)
```typescript
// Use environment variables to disable features
if (process.env.ENABLE_NEW_AGGREGATION === 'true') {
  // Use new aggregation logic
} else {
  // Use old logic
}
```

## Maintenance Tasks

### Daily
- [ ] Check error logs in Vercel
- [ ] Monitor data_sync_logs for failures
- [ ] Verify cron jobs ran successfully

### Weekly
- [ ] Review slow query logs
- [ ] Check database size and growth
- [ ] Test manual website refresh

### Monthly
- [ ] Analyze performance trends
- [ ] Clean up old logs/debugging info
- [ ] Update dependencies
- [ ] Review security audit logs

### Quarterly
- [ ] Performance optimization review
- [ ] Database maintenance (VACUUM ANALYZE)
- [ ] Update documentation
- [ ] Security audit

## Support & Debugging

### Common Issues & Solutions

**Metrics not appearing**
1. Check tracking script is installed correctly
2. Verify tracking_script_id is correct
3. Check browser console for JavaScript errors
4. Manually trigger aggregation: POST /api/analytics/aggregate

**Cron jobs not running**
1. Verify CRON_SECRET is set in Vercel
2. Check vercel.json has correct schedule
3. Verify endpoints return 200 status
4. Check Vercel logs for error messages

**Database connection fails**
1. Verify DATABASE_URL is correct
2. Check database server is running
3. Verify firewall allows connection
4. Test with: `psql $DATABASE_URL`

**High API latency**
1. Check database indexes are created
2. Monitor database CPU/memory
3. Check for slow queries
4. Consider caching layer

## Deployment Success Criteria

- [ ] All environment variables configured
- [ ] Database schema created successfully
- [ ] Tracking script deployed and accessible
- [ ] API endpoints responding correctly
- [ ] Authentication working
- [ ] Dashboard loading metrics
- [ ] Cron jobs executing successfully
- [ ] No error logs in Vercel console
- [ ] Response times under acceptable limits
- [ ] User can complete full flow (add website → see metrics)
