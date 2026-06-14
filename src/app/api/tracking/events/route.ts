import { NextRequest, NextResponse } from 'next/server';
import { recordTrackingEvent } from '@/lib/analytics';

// Tracking events are sent cross-origin from the customer's website, so every
// response (including the POST result) must carry CORS headers.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Tracking-Script-ID',
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.tracking_script_id || !data.session_id || !data.event_type) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Record the tracking event
    await recordTrackingEvent(data);

    return NextResponse.json(
      { status: 'success', message: 'Event recorded' },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[v0] Tracking event error:', errorMessage);
    console.error('[v0] Error details:', error);
    
    // Return a more helpful error response
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to record event',
        detail: errorMessage, // For debugging
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// Allow CORS for tracking script
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
