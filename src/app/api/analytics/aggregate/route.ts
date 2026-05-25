import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { aggregateMetricsFromEvents, logDataSync, updateWebsiteStatus } from '@/lib/analytics';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const websiteId = data.website_id;
    const date = data.date || new Date().toISOString().split('T')[0];

    if (!websiteId) {
      return NextResponse.json(
        { status: 'error', message: 'website_id is required' },
        { status: 400 }
      );
    }

    // Verify user owns this website
    const userResult = await query(
      'SELECT w.id FROM websites w JOIN users u ON w.user_id = u.id WHERE w.id = $1 AND u.email = $2',
      [websiteId, session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Website not found or unauthorized' },
        { status: 404 }
      );
    }

    const startTime = Date.now();
    
    // Log sync start
    await logDataSync(websiteId, 'metrics', 'in_progress', {
      triggered_by: 'manual',
    });

    try {
      // Aggregate metrics for the day
      const metrics = await aggregateMetricsFromEvents(websiteId, date);

      // Update last sync time
      await query(
        'UPDATE websites SET last_metrics_sync = NOW(), metrics_collection_status = $1 WHERE id = $2',
        ['active', websiteId]
      );

      const duration = Date.now() - startTime;

      // Log success
      await logDataSync(websiteId, 'metrics', 'success', {
        triggered_by: 'manual',
        sync_duration_ms: duration,
        records_collected: 1,
      });

      return NextResponse.json({
        status: 'success',
        message: 'Metrics aggregated successfully',
        metrics,
        sync_duration_ms: duration,
      });
    } catch (syncError) {
      const duration = Date.now() - startTime;
      const errorMsg = syncError instanceof Error ? syncError.message : 'Unknown error';

      // Log failure
      await logDataSync(websiteId, 'metrics', 'failed', {
        triggered_by: 'manual',
        sync_duration_ms: duration,
        error_message: errorMsg,
      });

      // Update website status
      await updateWebsiteStatus(websiteId, 'failed');

      throw syncError;
    }
  } catch (error) {
    console.error('[v0] Metrics aggregation error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to aggregate metrics' },
      { status: 500 }
    );
  }
}
