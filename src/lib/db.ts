import { Pool, ClientBase } from 'pg'
import { Signer } from '@aws-sdk/rds-signer'
import { awsCredentialsProvider } from '@vercel/functions/oidc'
import { attachDatabasePool } from '@vercel/functions'

const signer = new Signer({
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN!,
    clientConfig: { region: process.env.AWS_REGION! },
  }),
  region: process.env.AWS_REGION!,
  hostname: process.env.PGHOST!,
  username: process.env.PGUSER || 'postgres',
  port: 5432,
})

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || 'postgres',
  port: 5432,
  user: process.env.PGUSER || 'postgres',
  password: () => signer.getAuthToken(),
  ssl: { rejectUnauthorized: false },
  max: 20,
})

attachDatabasePool(pool)

// Single query transactions
export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params)
}

// Use for multi-query transactions
export async function withConnection<T>(
  fn: (client: ClientBase) => Promise<T>,
): Promise<T> {
  const client = await pool.connect()
  try {
    return await fn(client)
  } finally {
    client.release()
  }
}

// Helper function to initialize database schema
export async function initializeDatabase() {
  try {
    // All tables should already be created by the migration scripts
    // This is just a connection health check
    await query('SELECT 1')
    console.log('[v0] Database connection verified')
  } catch (error) {
    console.error('[v0] Database connection error:', error)
    throw error
  }
}

// User operations
export async function getUserByEmail(email: string) {
  try {
    const result = await query(
      'SELECT id, email, name, password_hash, role, created_at FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('[v0] Error fetching user:', error)
    throw error
  }
}

export async function getUserById(id: string) {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('[v0] Error fetching user by ID:', error)
    throw error
  }
}

export async function createUser(email: string, name: string, passwordHash: string) {
  try {
    const result = await query(
      'INSERT INTO users (id, email, name, password_hash, role) VALUES (gen_random_uuid()::text, $1, $2, $3, $4) RETURNING id, email, name, created_at',
      [email, name, passwordHash, 'client']
    )
    return result.rows[0]
  } catch (error) {
    console.error('[v0] Error creating user:', error)
    throw error
  }
}

// Profile operations
export async function getUserProfile(userId: string) {
  try {
    const result = await query(
      'SELECT * FROM profiles WHERE id = $1',
      [userId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('[v0] Error fetching profile:', error)
    throw error
  }
}

export async function createUserProfile(userId: string, businessName?: string, industry?: string, websiteUrl?: string) {
  try {
    const result = await query(
      'INSERT INTO profiles (id, business_name, industry, website_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, businessName || null, industry || null, websiteUrl || null]
    )
    return result.rows[0]
  } catch (error) {
    console.error('[v0] Error creating profile:', error)
    throw error
  }
}

export async function updateUserProfile(userId: string, profileData: Record<string, any>) {
  try {
    const updates: string[] = []
    const values: any[] = [userId]
    let paramIndex = 2

    for (const [key, value] of Object.entries(profileData)) {
      updates.push(`${key} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }

    updates.push(`updated_at = now()`)

    const result = await query(
      `UPDATE profiles SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  } catch (error) {
    console.error('[v0] Error updating profile:', error)
    throw error
  }
}

// Audit operations
export async function getAuditById(auditId: string) {
  try {
    const result = await query(
      'SELECT * FROM audits WHERE id = $1',
      [auditId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('[v0] Error fetching audit:', error)
    throw error
  }
}

export async function getUserAudits(userId: string) {
  try {
    const result = await query(
      'SELECT * FROM audits WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    )
    return result.rows
  } catch (error) {
    console.error('[v0] Error fetching user audits:', error)
    throw error
  }
}

export async function createAudit(
  userId: string | null,
  businessName: string,
  websiteUrl: string,
  industry: string,
  businessGoal: string,
  email: string
) {
  try {
    const result = await query(
      `INSERT INTO audits (user_id, business_name, website_url, industry, business_goal, email, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, businessName, websiteUrl, industry, businessGoal, email, 'pending']
    )
    return result.rows[0]
  } catch (error) {
    console.error('[v0] Error creating audit:', error)
    throw error
  }
}

export async function updateAudit(auditId: string, auditData: Record<string, any>) {
  try {
    const updates: string[] = []
    const values: any[] = [auditId]
    let paramIndex = 2

    for (const [key, value] of Object.entries(auditData)) {
      updates.push(`${key} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }

    const result = await query(
      `UPDATE audits SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      values
    )
    return result.rows[0]
  } catch (error) {
    console.error('[v0] Error updating audit:', error)
    throw error
  }
}
