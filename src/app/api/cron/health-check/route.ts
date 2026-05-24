import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logDataSync, updateWebsiteStatus } from '@/lib/analytics';

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
    console.log('[v0] Website health check job started');
    
    // Get all active websites
    const websitesResult = await query(
      `SELECT id, url, last_health_check FROM websites 
       WHERE tracking_enabled = true AND status = 'active' 
       ORDER BY last_health_check ASC NULLS FIRST LIMIT 50`,
      []
    );

    const websites = websitesResult.rows;
    let healthy = 0;
    let failed = 0;
    let skipped = 0;

    for (const website of websites) {
      try {
        // Check if we already checked recently (within last 6 hours)
        const lastCheck = website.last_health_check ? new Date(website.last_health_check) : null;
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        
        if (lastCheck && lastCheck > sixHoursAgo) {
          skipped++;
          continue;
        }

        // Test website connectivity
        const startTime = Date.now();
        try {
          const response = await fetch(website.url, {
            method: 'HEAD',
            timeout: 10000,
            redirect: 'follow',
          });

          const duration = Date.now() - startTime;

          if (response.ok) {
            // Website is reachable
            await query(
              'UPDATE websites SET last_health_check = NOW() WHERE id = $1',
              [website.id]
            );

            await logDataSync(website.id, 'health_check', 'success', {
              triggered_by: 'scheduled',
              sync_duration_ms: duration,
            });

            healthy++;
          } else {
            // Website returned error status
            const errorMsg = `HTTP ${response.status}`;
            await updateWebsiteStatus(website.id, 'failed');

            await logDataSync(website.id, 'health_check', 'failed', {
              triggered_by: 'scheduled',
              error_message: errorMsg,
              sync_duration_ms: duration,
            });

            failed++;
          }
        } catch (fetchError) {
          const duration = Date.now() - startTime;
          const errorMsg = fetchError instanceof Error ? fetchError.message : 'Connection failed';
          
          await updateWebsiteStatus(website.id, 'failed');

          await logDataSync(website.id, 'health_check', 'failed', {
            triggered_by: 'scheduled',
            error_message: errorMsg,
            sync_duration_ms: duration,
          });

          failed++;
        }
      } catch (error) {
        console.error(`[v0] Error checking health for website ${website.id}:`, error);
        failed++;
      }
    }

    console.log(
      `[v0] Health check completed: ${healthy} healthy, ${failed} failed, ${skipped} skipped`
    );

    return NextResponse.json({
      status: 'success',
      message: 'Health check complete',
      healthy,
      failed,
      skipped,
    });
  } catch (error) {
    console.error('[v0] Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
