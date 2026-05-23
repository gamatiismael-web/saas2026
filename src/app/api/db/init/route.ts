import { NextResponse } from 'next/server';
import { query, withConnection } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
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
          await query(statement);
        }
        
        console.log(`[v0] Executed migration: ${file}`);
      } catch (error) {
        console.error(`[v0] Error executing ${file}:`, error);
        // Continue with next migration even if one fails
      }
    }

    // Verify tables exist
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const tableNames = result.rows.map((row: any) => row.table_name);
    const requiredTables = ['users', 'profiles', 'audits', 'projects'];
    const allTablesExist = requiredTables.every((table) =>
      tableNames.includes(table)
    );

    if (!allTablesExist) {
      return NextResponse.json(
        {
          status: 'partial',
          message: 'Some tables created, but not all required tables exist',
          tables: tableNames,
        },
        { status: 207 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Database schema initialized successfully',
        tables: tableNames,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Database initialization error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
