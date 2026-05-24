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
    console.log('[v0] Hourly metrics aggregation job started');
    
    // Get all active websites
    const websitesResult = await query(
      "SELECT id FROM websites WHERE tracking_enabled = true AND status = 'active' ORDER BY id",
      []
    );

    const websites = websitesResult.rows;
    let processed = 0;
    let failed = 0;

    // Process each website
    for (const website of websites) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const currentHour = new Date().getHours();
        
        // Aggregate metrics for the current hour
        await aggregateMetricsFromEvents(website.id, today, currentHour - 1);
        
        // Log success
        await logDataSync(website.id, 'metrics', 'success', {
          triggered_by: 'scheduled',
          records_collected: 1,
        });

        processed++;
      } catch (error) {
        failed++;
        console.error(`[v0] Error aggregating metrics for website ${website.id}:`, error);
        
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        await logDataSync(website.id, 'metrics', 'failed', {
          triggered_by: 'scheduled',
          error_message: errorMsg,
        });
      }
    }

    console.log(`[v0] Hourly aggregation completed: ${processed} successful, ${failed} failed`);

    return NextResponse.json({
      status: 'success',
      message: 'Hourly aggregation complete',
      processed,
      failed,
    });
  } catch (error) {
    console.error('[v0] Hourly aggregation error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
