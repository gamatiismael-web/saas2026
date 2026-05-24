import { query } from '@/lib/db';

export interface Website {
  id: string;
  user_id: string;
  url: string;
  domain: string;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'failed';
  tracking_script_id: string;
  tracking_enabled: boolean;
  google_search_console_property_id: string | null;
  gsc_verified: boolean;
  last_metrics_sync: string | null;
  last_seo_sync: string | null;
  last_health_check: string | null;
  metrics_collection_status: 'pending' | 'active' | 'failed' | 'paused';
  has_7_days_data: boolean;
  ai_recommendations_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebsiteMetrics {
  id: string;
  website_id: string;
  metric_date: string;
  metric_hour: number | null;
  visitors: number;
  pageviews: number;
  sessions: number;
  avg_session_duration: number;
  bounce_rate: number;
  conversion_rate: number;
  organic_traffic: number;
  direct_traffic: number;
  referral_traffic: number;
  social_traffic: number;
  paid_traffic: number;
  desktop_traffic: number;
  mobile_traffic: number;
  tablet_traffic: number;
  top_countries: any[];
  created_at: string;
  updated_at: string;
}

// Website Management Functions
export async function createWebsite(
  userId: string,
  url: string,
  name: string,
  description?: string
): Promise<Website> {
  const domain = new URL(url).hostname;
  const trackingScriptId = `vc_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
  
  const result = await query(
    `INSERT INTO websites (user_id, url, domain, name, description, tracking_script_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, url, domain, name, description || '', trackingScriptId]
  );
  
  return result.rows[0];
}

export async function getWebsitesByUser(userId: string): Promise<Website[]> {
  const result = await query(
    'SELECT * FROM websites WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function getWebsite(websiteId: string): Promise<Website | null> {
  const result = await query(
    'SELECT * FROM websites WHERE id = $1',
    [websiteId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function updateWebsiteStatus(
  websiteId: string,
  status: 'active' | 'paused' | 'failed'
): Promise<Website> {
  const result = await query(
    `UPDATE websites SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, websiteId]
  );
  return result.rows[0];
}

// Metrics Collection Functions
export async function aggregateMetricsFromEvents(
  websiteId: string,
  date: string,
  hour?: number
): Promise<WebsiteMetrics> {
  let whereClause = "website_id = $1 AND DATE(created_at) = $2";
  let params: any[] = [websiteId, date];
  
  if (hour !== undefined) {
    whereClause += ` AND EXTRACT(HOUR FROM created_at) = $3`;
    params.push(hour);
  }
  
  // Aggregate events
  const eventsResult = await query(
    `SELECT 
       COUNT(DISTINCT session_id) as sessions,
       COUNT(*) as pageviews,
       COUNT(DISTINCT CASE WHEN device_type = 'desktop' THEN session_id END) as desktop_sessions,
       COUNT(DISTINCT CASE WHEN device_type = 'mobile' THEN session_id END) as mobile_sessions,
       COUNT(DISTINCT CASE WHEN device_type = 'tablet' THEN session_id END) as tablet_sessions,
       AVG(session_duration) as avg_session_duration
     FROM tracking_events
     WHERE ${whereClause}`,
    params
  );
  
  const aggData = eventsResult.rows[0] || {};
  
  // Insert or update metrics
  const metricsResult = await query(
    `INSERT INTO website_metrics 
     (website_id, metric_date, metric_hour, visitors, pageviews, sessions, avg_session_duration, 
      desktop_traffic, mobile_traffic, tablet_traffic, organic_traffic, direct_traffic, 
      referral_traffic, social_traffic, paid_traffic, bounce_rate, conversion_rate)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 0, 0)
     ON CONFLICT (website_id, metric_date, metric_hour) DO UPDATE SET
       visitors = EXCLUDED.visitors,
       pageviews = EXCLUDED.pageviews,
       sessions = EXCLUDED.sessions,
       avg_session_duration = EXCLUDED.avg_session_duration,
       desktop_traffic = EXCLUDED.desktop_traffic,
       mobile_traffic = EXCLUDED.mobile_traffic,
       tablet_traffic = EXCLUDED.tablet_traffic,
       updated_at = NOW()
     RETURNING *`,
    [
      websiteId,
      date,
      hour || null,
      aggData.sessions || 0,
      aggData.pageviews || 0,
      aggData.sessions || 0,
      aggData.avg_session_duration || 0,
      aggData.desktop_sessions || 0,
      aggData.mobile_sessions || 0,
      aggData.tablet_sessions || 0,
      0, // organic_traffic (will be calculated)
      0, // direct_traffic (will be calculated)
      0, // referral_traffic (will be calculated)
      0, // social_traffic (will be calculated)
      0, // paid_traffic (will be calculated)
    ]
  );
  
  return metricsResult.rows[0];
}

export async function getWebsiteMetrics(
  websiteId: string,
  days: number = 30
): Promise<WebsiteMetrics[]> {
  const result = await query(
    `SELECT * FROM website_metrics 
     WHERE website_id = $1 
     AND metric_date >= CURRENT_DATE - INTERVAL '${days} days'
     AND metric_hour IS NULL
     ORDER BY metric_date DESC`,
    [websiteId]
  );
  return result.rows;
}

// Tracking Events Functions
export async function recordTrackingEvent(data: {
  tracking_script_id: string;
  session_id: string;
  visitor_id?: string;
  event_type: string;
  page_url?: string;
  referrer?: string;
  device_type?: string;
  browser_name?: string;
  os_name?: string;
  country_code?: string;
  country_name?: string;
  session_duration?: number;
  pages_in_session?: number;
}): Promise<void> {
  // Find website by tracking script ID
  const websiteResult = await query(
    'SELECT id FROM websites WHERE tracking_script_id = $1',
    [data.tracking_script_id]
  );
  
  if (websiteResult.rows.length === 0) {
    throw new Error('Tracking script not found');
  }
  
  const websiteId = websiteResult.rows[0].id;
  
  await query(
    `INSERT INTO tracking_events 
     (website_id, tracking_script_id, session_id, visitor_id, event_type, page_url, 
      referrer, device_type, browser_name, os_name, country_code, country_name, 
      session_duration, pages_in_session)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      websiteId,
      data.tracking_script_id,
      data.session_id,
      data.visitor_id,
      data.event_type,
      data.page_url,
      data.referrer,
      data.device_type,
      data.browser_name,
      data.os_name,
      data.country_code,
      data.country_name,
      data.session_duration,
      data.pages_in_session,
    ]
  );
}

// Data Sync Logging
export async function logDataSync(
  websiteId: string,
  syncType: 'metrics' | 'seo' | 'health_check',
  status: 'pending' | 'in_progress' | 'success' | 'failed',
  data: {
    error_message?: string;
    error_code?: string;
    records_collected?: number;
    sync_duration_ms?: number;
    triggered_by?: 'manual' | 'scheduled' | 'webhook';
  }
): Promise<void> {
  await query(
    `INSERT INTO data_sync_logs 
     (website_id, sync_type, status, error_message, error_code, records_collected, 
      sync_duration_ms, triggered_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      websiteId,
      syncType,
      status,
      data.error_message,
      data.error_code,
      data.records_collected || 0,
      data.sync_duration_ms,
      data.triggered_by || 'manual',
    ]
  );
}
