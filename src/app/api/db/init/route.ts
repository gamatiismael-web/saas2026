import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    console.log('[v0] Database initialization started');

    // Read and execute migration files
    const migrationsDir = path.join(process.cwd(), 'scripts');
    const migrationFiles = [
      '001-core-schema.sql',
      '002-seo-infrastructure.sql',
    ].sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`[v0] Migration file not found: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(filePath, 'utf-8');
      
      try {
        // Execute each statement separately to handle multiple statements
        const statements = sql
          .split(';')
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        for (const statement of statements) {
          try {
            await query(statement);
          } catch (err: any) {
            // Ignore "already exists" errors
            if (err.code === '42P07' || err.message?.includes('already exists')) {
              console.log(`[v0] Table already exists: ${statement.substring(0, 50)}...`);
            } else {
              throw err;
            }
          }
        }
        
        console.log(`[v0] Executed migration: ${file}`);
      } catch (error) {
        console.error(`[v0] Error executing ${file}:`, error);
        throw error;
      }
    }

    // Verify tables exist
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const tableNames = result.rows.map((row: any) => row.table_name);
    console.log('[v0] Tables found:', tableNames);
    
    const requiredTables = ['users', 'profiles', 'audits', 'projects'];
    const allTablesExist = requiredTables.every((table) =>
      tableNames.includes(table)
    );

    if (!allTablesExist) {
      throw new Error(`Missing tables. Found: ${tableNames.join(', ')}`);
    }

    return {
      status: 'success',
      message: 'Database schema initialized successfully',
      tables: tableNames,
    };
  } catch (error) {
    console.error('[v0] Database initialization error:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const result = await initializeDatabase();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
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
  try {
    const result = await initializeDatabase();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
