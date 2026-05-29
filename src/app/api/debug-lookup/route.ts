import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// TEMPORARY debug endpoint - delete after use.
export async function GET() {
  try {
    const email = 'gamati.ismael@gmail.com';
    const result = await query(
      `SELECT id, email, name,
              (password_hash IS NOT NULL) AS has_password,
              length(password_hash) AS hash_len,
              created_at
       FROM users
       WHERE lower(email) = lower($1)`,
      [email],
    );

    const total = await query('SELECT COUNT(*)::int AS n FROM users');

    return NextResponse.json({
      searchedEmail: email,
      found: result.rows.length > 0,
      match: result.rows,
      totalUsersInDb: total.rows[0].n,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
