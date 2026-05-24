import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { aggregateMetricsFromEvents, logDataSync } from '@/lib/analytics';

// Rate limit check - ensure this is called from Vercel Cron
const validateCronSecret = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    console.warn('[v0] CRON_SECRET not configured');
    return false;
  }
  
  return authHeader === `Bearer ${cronSecret}`;
};

export async function POST(request: NextRequest) {
  // Validate request is from Vercel Cron
  if (!validateCronSecret(request)) {
    return NextResponse.json(
      { status: 'error', message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('[v0] Daily metrics aggregation job started');
    
    // Get all active websites
    const websitesResult = await query(
      "SELECT id, created_at FROM websites WHERE tracking_enabled = true AND status = 'active' ORDER BY id",
      []
    );

    const websites = websitesResult.rows;
    let processed = 0;
    let failed = 0;
    let dataPoints = 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    // Process each website
    for (const website of websites) {
      try {
        // Check if website existed on this date
        const createdDate = new Date(website.created_at);
        if (createdDate > yesterday) {
          console.log(`[v0] Skipping website ${website.id} - created after ${dateStr}`);
          continue;
        }

        // Aggregate full day metrics
        await aggregateMetricsFromEvents(website.id, dateStr);
        
        // Check if we've reached 7 days of data
        const metricsResult = await query(
          `SELECT COUNT(DISTINCT metric_date) as day_count 
           FROM website_metrics 
           WHERE website_id = $1 AND metric_hour IS NULL`,
          [website.id]
        );

        const dayCount = metricsResult.rows[0]?.day_count || 0;
        
        if (dayCount >= 7 && !website.has_7_days_data) {
          // Enable AI recommendations
          await query(
            'UPDATE websites SET has_7_days_data = true, ai_recommendations_enabled = true WHERE id = $1',
            [website.id]
          );
          console.log(`[v0] Website ${website.id} now has 7+ days of data`);
        }

        // Clean up old events (> 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];

        await query(
          `DELETE FROM tracking_events 
           WHERE website_id = $1 AND DATE(created_at) < $2`,
          [website.id, cutoffDate]
        );

        // Log success
        await logDataSync(website.id, 'metrics', 'success', {
          triggered_by: 'scheduled',
          records_collected: 1,
        });

        processed++;
        dataPoints++;
      } catch (error) {
        failed++;
        console.error(`[v0] Error aggregating daily metrics for website ${website.id}:`, error);
        
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        await logDataSync(website.id, 'metrics', 'failed', {
          triggered_by: 'scheduled',
          error_message: errorMsg,
        });
      }
    }

    // Update websites collection status
    try {
      await query(
        `UPDATE websites 
         SET metrics_collection_status = 'active', last_metrics_sync = NOW()
         WHERE tracking_enabled = true AND status = 'active' AND last_metrics_sync IS NOT NULL`,
        []
      );
    } catch (err) {
      console.error('[v0] Error updating collection status:', err);
    }

    console.log(
      `[v0] Daily aggregation completed: ${processed} websites processed, ${dataPoints} data points created, ${failed} failures`
    );

    return NextResponse.json({
      status: 'success',
      message: 'Daily aggregation complete',
      processed,
      dataPoints,
      failed,
    });
  } catch (error) {
    console.error('[v0] Daily aggregation error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
