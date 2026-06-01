import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { getWebsiteMetrics, aggregateRecentDays } from '@/lib/analytics';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const websiteId = searchParams.get('website_id');
    const days = parseInt(searchParams.get('days') || '30');

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

    // Roll up any freshly received tracking events into daily metrics before
    // reading, so the dashboard always reflects the latest data. A failure here
    // should not block returning whatever is already aggregated.
    try {
      await aggregateRecentDays(websiteId, days);
    } catch (aggError) {
      console.error('[v0] Aggregate-on-read failed:', aggError);
    }

    const metrics = await getWebsiteMetrics(websiteId, days);

    return NextResponse.json({
      status: 'success',
      metrics,
      count: metrics.length,
    });
  } catch (error) {
    console.error('[v0] Get metrics error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
