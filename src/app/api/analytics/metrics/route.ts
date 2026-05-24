import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getWebsiteMetrics } from '@/lib/analytics';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
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
