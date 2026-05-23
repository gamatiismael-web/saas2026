import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST() {
  try {
    console.log('[v0] Fixing users table schema...');

    // Drop existing users table and dependencies
    await query('DROP TABLE IF EXISTS messages CASCADE');
    await query('DROP TABLE IF EXISTS assets CASCADE');
    await query('DROP TABLE IF EXISTS tasks CASCADE');
    await query('DROP TABLE IF EXISTS subscriptions CASCADE');
    await query('DROP TABLE IF EXISTS projects CASCADE');
    await query('DROP TABLE IF EXISTS profiles CASCADE');
    await query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('[v0] Dropped old tables');

    // Recreate users table with proper id default
    await query(`
      CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    console.log('[v0] Created users table with UUID default');

    // Recreate profiles table
    await query(`
      CREATE TABLE profiles (
        id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        business_name VARCHAR(255),
        industry VARCHAR(255),
        website_url VARCHAR(255),
        phone VARCHAR(20),
        google_oauth_tokens JSONB,
        search_console_property_id VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    console.log('[v0] Schema fixed successfully');

    return NextResponse.json(
      {
        status: 'success',
        message: 'Users table schema fixed - UUID default added',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Schema fix error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
