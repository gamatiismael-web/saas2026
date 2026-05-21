import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    // Check if users table exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        website_url VARCHAR(255),
        google_property_id VARCHAR(255),
        search_console_property VARCHAR(255),
        google_oauth_tokens JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS audits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        website_url VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        performance_score INTEGER,
        accessibility_score INTEGER,
        seo_score INTEGER,
        best_practices_score INTEGER,
        results JSONB,
        recommendations JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS audit_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        description TEXT,
        findings JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('[v0] Database schema initialized successfully');
  } catch (error) {
    if ((error as any)?.message?.includes('already exists')) {
      console.log('[v0] Database tables already exist');
    } else {
      console.error('[v0] Database initialization error:', error);
      throw error;
    }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Error fetching user:', error);
    throw error;
  }
}

export async function createUser(email: string, name: string, passwordHash: string) {
  try {
    const result = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${passwordHash})
      RETURNING id, email, name, created_at
    `;
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error creating user:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM profiles WHERE user_id = ${userId}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Error fetching profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, profileData: Record<string, any>) {
  try {
    const setClause = Object.keys(profileData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(profileData);
    
    const result = await sql`
      UPDATE profiles 
      SET ${sql(setClause)}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error updating profile:', error);
    throw error;
  }
}

export async function getUserAudits(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM audits WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('[v0] Error fetching audits:', error);
    throw error;
  }
}

export async function getAuditById(auditId: string) {
  try {
    const result = await sql`
      SELECT * FROM audits WHERE id = ${auditId}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('[v0] Error fetching audit:', error);
    throw error;
  }
}

export async function createAudit(userId: string | null, websiteUrl: string) {
  try {
    const result = await sql`
      INSERT INTO audits (user_id, website_url, status)
      VALUES (${userId}, ${websiteUrl}, 'pending')
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error creating audit:', error);
    throw error;
  }
}

export async function updateAudit(auditId: string, auditData: Record<string, any>) {
  try {
    const setClause = Object.keys(auditData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(auditData);
    
    const result = await sql`
      UPDATE audits 
      SET ${sql(setClause)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${auditId}
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('[v0] Error updating audit:', error);
    throw error;
  }
}
