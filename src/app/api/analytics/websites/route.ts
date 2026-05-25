import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { createWebsite, getWebsitesByUser, getWebsite } from '@/lib/analytics';

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
    
    if (!data.url || !data.name) {
      return NextResponse.json(
        { status: 'error', message: 'URL and name are required' },
        { status: 400 }
      );
    }

    // Get user ID from email
    const { query } = await import('@/lib/db');
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;
    const website = await createWebsite(userId, data.url, data.name, data.description);

    return NextResponse.json({
      status: 'success',
      website,
    });
  } catch (error) {
    console.error('[v0] Website creation error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create website' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user ID from email
    const { query } = await import('@/lib/db');
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;
    const websites = await getWebsitesByUser(userId);

    return NextResponse.json({
      status: 'success',
      websites,
    });
  } catch (error) {
    console.error('[v0] Get websites error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}
