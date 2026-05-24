import { NextRequest, NextResponse } from 'next/server';
import { recordTrackingEvent, logDataSync } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.tracking_script_id || !data.session_id || !data.event_type) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Record the tracking event
    await recordTrackingEvent(data);

    return NextResponse.json(
      { status: 'success', message: 'Event recorded' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Tracking event error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to record event' },
      { status: 500 }
    );
  }
}

// Allow CORS for tracking script
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Tracking-Script-ID',
    },
  });
}
