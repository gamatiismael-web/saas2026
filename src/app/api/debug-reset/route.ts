import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

// TEMPORARY debug endpoint - resets the password for a single known account.
// Deleted immediately after use.
export async function GET() {
  const email = 'gamati.ismael@gmail.com';
  const newPassword = 'WebPilot2026!';

  const hash = await bcrypt.hash(newPassword, 12);
  const result = await query(
    'UPDATE users SET password_hash = $1 WHERE LOWER(email) = LOWER($2) RETURNING id, email, name',
    [hash, email],
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ ok: false, message: 'No matching user' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: result.rows[0] });
}
