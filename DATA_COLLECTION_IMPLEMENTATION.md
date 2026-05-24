# Data Collection & Live Analytics Implementation Guide

## Overview

This document outlines the data collection system for ValueConnection's website tracking dashboard. The system enables real-time analytics collection from user websites through a lightweight JavaScript tracking script, with aggregated metrics stored in Aurora PostgreSQL.

## Phase 1: Database Schema & Tracking Script ✅ COMPLETE

### Database Tables Created

1. **websites** - Core website tracking configuration
   - Stores user websites, tracking script IDs, GSC property IDs
   - Tracks last sync times and collection status
   - Flags for 7-day data requirement and AI recommendations

2. **website_metrics** - Aggregated metrics (hourly/daily)
   - Traffic metrics (visitors, pageviews, sessions)
   - Engagement metrics (bounce rate, session duration)
   - Traffic source breakdown (organic, direct, referral, social, paid)
   - Device distribution (desktop, mobile, tablet)

3. **tracking_events** - Individual visitor events
   - Page views, session start/end events
   - Device and browser information
   - Geographic data (country codes)
   - Session tracking for accurate metrics

4. **website_seo_keywords** - Keyword tracking for websites
   - Current rankings, search volume, difficulty scores
   - Rank history for trend analysis
   - Opportunity scoring for quick wins

5. **website_seo_rank_history** - Historical SEO data
   - Daily rank snapshots per keyword
   - Enables 7, 30, 90-day trend analysis
   - Tracks ranking changes over time

6. **data_sync_logs** - Collection monitoring
   - Tracks all data collection attempts (metrics, SEO, health checks)
   - Records errors, duration, and record counts
   - Supports debugging and audit trails

### JavaScript Tracking Script (public/vc-analytics.js)

Client-side script that users embed on their website. Features:
- Session management (sessionStorage + localStorage)
- Device and browser detection
- Page view, session start/end tracking
- Online/offline detection with event queuing
- Event batching for efficiency
- Support for custom conversion tracking
- Retry logic and failover handling

## Phase 2: Backend APIs & Services ✅ COMPLETE

### Core API Endpoints

#### 1. POST /api/tracking/events
Receives tracking events from client-side script
- Input: Tracking event payload (pageview, session, custom)
- Output: Success/error response
- Supports CORS for cross-origin tracking
- Rate limiting recommended for production

#### 2. POST /api/analytics/websites
Create new tracked website
- Auth: Requires NextAuth session
- Input: URL, name, description
- Output: Website object with tracking script ID
- Generates unique tracking script ID

#### 3. GET /api/analytics/websites
List all websites for logged-in user
- Auth: Requires NextAuth session
- Output: Array of website objects
- Includes tracking status and last sync times

#### 4. GET /api/analytics/metrics
Retrieve aggregated metrics for a website
- Auth: Requires NextAuth session
- Query params: website_id, days (default 30)
- Output: Array of daily metric snapshots
- Trends-ready format with historical data

#### 5. POST /api/analytics/aggregate
Manually trigger metrics aggregation
- Auth: Requires NextAuth session
- Aggregates events from tracking table into metrics table
- Updates website's last_sync timestamp
- Logs success/failure in data_sync_logs
- Manual refresh capability for users

### Analytics Library (src/lib/analytics.ts)

Utility functions for:
- **Website Management**: Create, list, update website status
- **Metrics Aggregation**: Aggregate tracking events into hourly/daily metrics
- **Event Recording**: Store individual tracking events
- **Data Sync Logging**: Track collection operations

## Phase 3: Frontend Integration & UI Flow 🚀 IN PROGRESS

### React Hooks (To be implemented)

1. **useWebsites()**
   - Fetches user's tracked websites
   - Returns: websites, loading, error, refetch
   - Used on dashboard to select website

2. **useWebsiteMetrics(websiteId, days)**
   - Fetches metrics for dashboard
   - Returns: metrics, loading, error, lastUpdated, refetch
   - Enables manual refresh UI button

3. **useSyncStatus(websiteId)**
   - Tracks data collection status
   - Returns: isSyncing, lastSync, errorMessage
   - Shows loading states during collection

### User Flow

1. **Add Website**
   - User enters website URL
   - System creates website record and generates tracking script ID
   - Display tracking script with copy-to-clipboard
   - Show installation instructions

2. **Install Tracking Script**
   - User adds script to their website head/body
   - Script sends test event immediately
   - Dashboard shows "Waiting for first event..." state
   - Once events received, metrics tab shows data

3. **Dashboard Display**
   - Website Metrics Tab: Shows traffic, engagement metrics with 30-day trends
   - SEO Rankings Tab: Disabled until GSC connected (future phase)
   - AI Recommendations Tab: Disabled until 7 days of data collected
   - Refresh Button: Allows manual metrics aggregation
   - Last Updated: Shows timestamp of last data sync

### UI Components

1. **AddWebsiteModal**
   - Form to enter website URL/name
   - Displays tracking script
   - Shows installation guide

2. **MetricsCard**
   - Displays individual metric with trend indicator
   - Sparkline chart for visual trend
   - Last updated timestamp

3. **WebsiteSelector**
   - Dropdown to switch between websites
   - Shows collection status per website

4. **SyncButton**
   - Manual refresh trigger
   - Shows loading state during sync
   - Displays last sync time

## Phase 4: SEO Rankings & Scheduling 📋 TODO

### Scheduled Jobs

1. **Hourly Metrics Aggregation** (0, 30 mins past hour)
   - Aggregates events from past hour
   - Creates hourly snapshots for 24-hour trends

2. **Daily Metrics Aggregation** (1:00 AM UTC)
   - Aggregates full day metrics
   - Cleans up old events (> 90 days)
   - Updates has_7_days_data flag

3. **6-Hour Website Health Check**
   - Verifies website is reachable
   - Tests tracking script installation
   - Updates metrics_collection_status

### SEO Ranking Collection

- Integration with Google Search Console API
- Pulls keyword rankings, impressions, clicks CTR
- Daily snapshot at 2:00 AM UTC
- Calculates opportunity scores (11-50 position keywords)

## Phase 5: Polish & Optimization 🎯 TODO

- Error state UI for failed collections
- Connection quality indicators
- Data export functionality (CSV/PDF)
- Mobile responsive dashboard
- Performance optimization for large datasets

## Testing Guide

### Manual Testing

1. Create website via /api/analytics/websites
2. Get tracking script ID from response
3. Embed script in test HTML page:
```html
<script>
window.vc_api_endpoint = 'http://localhost:3000';
</script>
<script src="http://localhost:3000/public/vc-analytics.js"></script>
```
4. Visit test page to generate events
5. Call POST /api/analytics/aggregate to process events
6. GET /api/analytics/metrics should return aggregated data

### Production Setup

1. Update vc-analytics.js with production API endpoint
2. Deploy to Vercel
3. Set up scheduled jobs (using AWS EventBridge or similar)
4. Configure rate limiting on tracking endpoint
5. Monitor data_sync_logs for collection failures

## Next Steps

1. **Phase 3**: Implement React hooks and UI components for website management
2. **Phase 4**: Set up scheduled data aggregation jobs
3. **Phase 5**: Add error handling, polish UX, optimize performance
