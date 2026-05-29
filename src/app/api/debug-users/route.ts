import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// TEMPORARY debug endpoint - lists user emails (no passwords). Delete after use.
export async function GET() {
  try {
    const result = await query(
      `SELECT email, name, created_at,
              (password_hash IS NOT NULL) AS has_password,
              length(password_hash) AS hash_len
       FROM users
       ORDER BY created_at DESC
       LIMIT 50`,
    );
    return NextResponse.json({ count: result.rows.length, users: result.rows });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown error' },
      { status: 500 },
    );
  }
}
