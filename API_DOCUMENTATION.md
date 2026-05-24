# Analytics API Documentation

## Tracking Script API

### Installation

Users embed a simple script in their website's HTML (in the `<head>` or before `</body>`):

```html
<script>
  window.vc_api_endpoint = 'https://your-app.vercel.app';
</script>
<script src="https://your-app.vercel.app/vc-analytics.js?id=YOUR_TRACKING_ID"></script>
```

### Script Features

- **Automatic Page Tracking**: Tracks every page view automatically
- **Session Management**: Creates unique session IDs and visitor IDs
- **Device Detection**: Captures device type, browser, OS info
- **Offline Support**: Queues events when offline, sends when back online
- **Custom Events**: Supports custom conversion and event tracking

### Custom Event Tracking

Users can track custom events using the global `vc_analytics` object:

```javascript
// Track a conversion
vc_analytics.trackConversion('purchase', 99.99);

// Track a custom event
vc_analytics.trackCustomEvent('button_click', { button_name: 'signup' });
```

## REST API Endpoints

### 1. POST /api/tracking/events

Receives tracking events from the client-side script.

**Authentication**: None (public endpoint for tracking)

**Request Body**:
```json
{
  "tracking_script_id": "vc_abc123_1234567890",
  "session_id": "vc_xyz789_1234567890",
  "visitor_id": "vc_def456_1234567890",
  "event_type": "pageview|session_start|session_end|conversion|custom",
  "page_url": "https://example.com/page",
  "referrer": "https://google.com",
  "device_type": "desktop|mobile|tablet",
  "browser_name": "Chrome|Safari|Firefox|Edge",
  "os_name": "Windows|macOS|Linux|Android|iOS",
  "country_code": "US",
  "country_name": "United States",
  "session_duration": 300,
  "pages_in_session": 1
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Event recorded"
}
```

**CORS**: Enabled for cross-origin tracking

---

### 2. POST /api/analytics/websites

Create a new tracked website.

**Authentication**: NextAuth session required

**Request Body**:
```json
{
  "url": "https://example.com",
  "name": "My Website",
  "description": "Optional website description"
}
```

**Response**:
```json
{
  "status": "success",
  "website": {
    "id": "website_123",
    "user_id": "user_456",
    "url": "https://example.com",
    "domain": "example.com",
    "name": "My Website",
    "description": "Optional website description",
    "tracking_script_id": "vc_abc123_1234567890",
    "tracking_enabled": true,
    "metrics_collection_status": "pending",
    "has_7_days_data": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. GET /api/analytics/websites

List all websites for the authenticated user.

**Authentication**: NextAuth session required

**Query Parameters**: None

**Response**:
```json
{
  "status": "success",
  "websites": [
    {
      "id": "website_123",
      "name": "My Website",
      "domain": "example.com",
      "tracking_enabled": true,
      "metrics_collection_status": "active",
      "has_7_days_data": true,
      "last_metrics_sync": "2024-01-15T15:30:00Z",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 4. GET /api/analytics/metrics

Retrieve aggregated metrics for a website.

**Authentication**: NextAuth session required

**Query Parameters**:
- `website_id` (required): The website ID
- `days` (optional, default: 30): Number of days to retrieve

**Response**:
```json
{
  "status": "success",
  "metrics": [
    {
      "id": "metric_789",
      "website_id": "website_123",
      "metric_date": "2024-01-15",
      "metric_hour": null,
      "visitors": 150,
      "pageviews": 450,
      "sessions": 120,
      "avg_session_duration": 245.5,
      "bounce_rate": 35.2,
      "organic_traffic": 100,
      "direct_traffic": 30,
      "referral_traffic": 20,
      "desktop_traffic": 90,
      "mobile_traffic": 55,
      "tablet_traffic": 5
    }
  ],
  "count": 30
}
```

---

### 5. POST /api/analytics/aggregate

Manually trigger metrics aggregation for a website.

**Authentication**: NextAuth session required

**Request Body**:
```json
{
  "website_id": "website_123",
  "date": "2024-01-15"  // optional, defaults to today
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Metrics aggregated successfully",
  "metrics": {
    "id": "metric_789",
    "website_id": "website_123",
    "visitors": 150,
    "pageviews": 450,
    "sessions": 120
  },
  "sync_duration_ms": 234
}
```

---

## Scheduled Jobs (Vercel Cron)

### Hourly Aggregation

**Endpoint**: POST /api/cron/aggregate-hourly

**Schedule**: Every 30 minutes (`0,30 * * * *`)

**Purpose**: Aggregates tracking events into hourly metrics for real-time dashboards

**Auth**: Requires `CRON_SECRET` environment variable

**Response**:
```json
{
  "status": "success",
  "message": "Hourly aggregation complete",
  "processed": 45,
  "failed": 2
}
```

---

### Daily Aggregation

**Endpoint**: POST /api/cron/aggregate-daily

**Schedule**: 1:00 AM UTC (`0 1 * * *`)

**Purpose**:
- Aggregates full-day metrics
- Checks 7-day data requirement for AI insights
- Cleans up events older than 90 days
- Updates collection status flags

**Auth**: Requires `CRON_SECRET` environment variable

**Response**:
```json
{
  "status": "success",
  "message": "Daily aggregation complete",
  "processed": 45,
  "dataPoints": 45,
  "failed": 0
}
```

---

### Health Check

**Endpoint**: POST /api/cron/health-check

**Schedule**: Every 6 hours (`0 */6 * * *`)

**Purpose**:
- Tests website connectivity
- Updates collection status
- Marks unreachable sites as failed

**Auth**: Requires `CRON_SECRET` environment variable

**Response**:
```json
{
  "status": "success",
  "message": "Health check complete",
  "healthy": 42,
  "failed": 3,
  "skipped": 5
}
```

---

## Database Schema

### websites
Stores tracked website configurations
- Tracking script ID
- Last sync timestamps
- Collection status flags
- GSC property ID for SEO integration

### website_metrics
Aggregated metrics data (hourly/daily snapshots)
- Traffic metrics (visitors, pageviews, sessions)
- Engagement (bounce rate, session duration)
- Traffic sources breakdown
- Device distribution

### tracking_events
Individual visitor events from the tracking script
- Pageviews, session starts/ends
- Device/browser information
- Geographic data
- Session tracking for metrics calculation

### website_seo_keywords
Tracks keywords and rankings per website
- Current rank
- Search volume and difficulty score
- Rank change trends

### website_seo_rank_history
Historical SEO ranking data for trend analysis
- Daily rank snapshots
- Enables 7/30/90-day trend views

### data_sync_logs
Audit trail for all data collection operations
- Success/failure status
- Error messages and codes
- Duration and record counts
- Triggered by (manual/scheduled/webhook)

---

## Environment Variables

```env
# Database
DATABASE_URL=your-postgres-connection-string

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret

# Scheduled Jobs
CRON_SECRET=your-cron-secret

# Optional: API Rate Limiting
TRACKING_API_RATE_LIMIT=1000  # requests per minute
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

**Common Status Codes**:
- 200: Success
- 400: Bad request (missing/invalid parameters)
- 401: Unauthorized (missing auth or invalid credentials)
- 404: Not found (website/resource doesn't exist)
- 429: Too many requests (rate limited)
- 500: Server error

---

## Best Practices

1. **Tracking Script Performance**
   - Script is optimized and non-blocking
   - Uses `defer` attribute for non-critical loading
   - Events are batched before sending

2. **Data Aggregation**
   - Hourly aggregation runs every 30 minutes for near real-time updates
   - Daily aggregation runs at 1:00 AM UTC for comprehensive stats
   - Old events (>90 days) are automatically cleaned up

3. **Security**
   - Tracking endpoint is public but validates tracking script ID
   - Admin endpoints require NextAuth authentication
   - Cron jobs require secret token
   - No sensitive data is stored in events

4. **Scalability**
   - Metrics are pre-aggregated for fast dashboard loads
   - Indexes on common query patterns
   - Old events are automatically purged to maintain performance

---

## Example Implementation

### Adding Website to Dashboard

```typescript
const { createWebsite } = useCreateWebsite();

const website = await createWebsite(
  'https://example.com',
  'My Website',
  'Description'
);

// Copy the tracking script ID and provide installation instructions
console.log('Tracking ID:', website.tracking_script_id);
```

### Fetching Metrics

```typescript
const { metrics, loading, lastUpdated, refetch } = useWebsiteMetrics('website_123', 30);

// Manually refresh
await refetch();

// Or trigger server aggregation
const { aggregate } = useMetricsAggregation('website_123');
await aggregate();
```

### Implementing Manual Refresh

```typescript
<Button onClick={handleRefresh} disabled={isSyncing}>
  {isSyncing ? 'Syncing...' : 'Refresh'}
</Button>
```
