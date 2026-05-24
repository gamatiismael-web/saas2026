import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('[v0] Analytics schema migration started');

    // Read analytics migration file
    const filePath = path.join(process.cwd(), 'scripts', '003-analytics-schema.sql');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { status: 'error', message: 'Migration file not found' },
        { status: 404 }
      );
    }

    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Execute each statement separately
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    let created = 0;
    for (const statement of statements) {
      try {
        await query(statement);
        created++;
      } catch (err: any) {
        // Ignore "already exists" errors
        if (err.code === '42P07' || err.message?.includes('already exists')) {
          console.log(`[v0] Already exists: ${statement.substring(0, 50)}...`);
        } else {
          console.error(`[v0] Error executing statement:`, err);
          throw err;
        }
      }
    }

    console.log(`[v0] Analytics schema migration completed: ${created} statements executed`);

    return NextResponse.json({
      status: 'success',
      message: 'Analytics schema created successfully',
      statements_executed: created,
    });
  } catch (error) {
    console.error('[v0] Analytics migration error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
