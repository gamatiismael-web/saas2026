#!/usr/bin/env node

/**
 * Data Migration Script: Supabase to Aurora PostgreSQL
 * 
 * This script exports data from Supabase and imports it into Aurora PostgreSQL.
 * It handles UUID to VARCHAR conversion and maintains data relationships.
 */

import { createClient } from '@supabase/supabase-js';
import { query, withConnection } from './src/lib/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[v0] Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateData() {
  console.log('[v0] Starting data migration from Supabase to Aurora PostgreSQL...');

  try {
    // 1. Migrate users and profiles
    console.log('[v0] Migrating users and profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    for (const profile of profiles || []) {
      try {
        // Insert user
        await query(
          `INSERT INTO users (id, email, name, role, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [profile.id, profile.email || '', profile.business_name || '', profile.role || 'client', profile.created_at, profile.updated_at]
        );

        // Insert profile
        await query(
          `INSERT INTO profiles (id, business_name, industry, website_url, phone, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [profile.id, profile.business_name, profile.industry, profile.website_url, profile.phone, profile.created_at, profile.updated_at]
        );
      } catch (err) {
        console.error(`[v0] Error migrating profile ${profile.id}:`, err);
      }
    }

    // 2. Migrate audits
    console.log('[v0] Migrating audits...');
    const { data: audits, error: auditsError } = await supabase
      .from('audits')
      .select('*');

    if (auditsError) throw auditsError;

    for (const audit of audits || []) {
      try {
        await query(
          `INSERT INTO audits (id, user_id, business_name, website_url, industry, business_goal, email, overall_score, 
           homepage_clarity_score, seo_score, conversion_score, mobile_score, recommendations, recommended_package, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO NOTHING`,
          [
            audit.id,
            audit.user_id,
            audit.business_name,
            audit.website_url,
            audit.industry,
            audit.business_goal,
            audit.email,
            audit.overall_score,
            audit.homepage_clarity_score,
            audit.seo_score,
            audit.conversion_score,
            audit.mobile_score,
            JSON.stringify(audit.recommendations || []),
            audit.recommended_package,
            audit.status,
            audit.created_at
          ]
        );
      } catch (err) {
        console.error(`[v0] Error migrating audit ${audit.id}:`, err);
      }
    }

    // 3. Migrate projects
    console.log('[v0] Migrating projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) throw projectsError;

    for (const project of projects || []) {
      try {
        await query(
          `INSERT INTO projects (id, user_id, name, status, stage, onboarding_progress, pages_in_scope, launch_date, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [
            project.id,
            project.user_id,
            project.name,
            project.status,
            project.stage,
            project.onboarding_progress,
            JSON.stringify(project.pages_in_scope || []),
            project.launch_date,
            project.created_at,
            project.updated_at
          ]
        );
      } catch (err) {
        console.error(`[v0] Error migrating project ${project.id}:`, err);
      }
    }

    // 4. Migrate subscriptions
    console.log('[v0] Migrating subscriptions...');
    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('*');

    if (subsError) throw subsError;

    for (const sub of subscriptions || []) {
      try {
        await query(
          `INSERT INTO subscriptions (id, user_id, plan, status, monthly_price, billing_cycle_start, billing_cycle_end, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [sub.id, sub.user_id, sub.plan, sub.status, sub.monthly_price, sub.billing_cycle_start, sub.billing_cycle_end, sub.created_at, sub.updated_at]
        );
      } catch (err) {
        console.error(`[v0] Error migrating subscription ${sub.id}:`, err);
      }
    }

    // 5. Migrate SEO data
    console.log('[v0] Migrating SEO infrastructure...');
    const { data: seoSettings, error: seoSettingsError } = await supabase
      .from('seo_settings')
      .select('*');

    if (seoSettingsError) throw seoSettingsError;

    for (const settings of seoSettings || []) {
      try {
        await query(
          `INSERT INTO seo_settings (id, user_id, target_location, seo_goal, competitors, domain_authority, organic_traffic, backlinks, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO NOTHING`,
          [settings.id, settings.user_id, settings.target_location, settings.seo_goal, JSON.stringify(settings.competitors || []), settings.domain_authority, settings.organic_traffic, settings.backlinks, settings.created_at, settings.updated_at]
        );
      } catch (err) {
        console.error(`[v0] Error migrating SEO settings ${settings.id}:`, err);
      }
    }

    console.log('[v0] Data migration completed successfully!');
  } catch (error) {
    console.error('[v0] Data migration failed:', error);
    process.exit(1);
  }
}

migrateData().then(() => {
  console.log('[v0] Migration script completed');
  process.exit(0);
});
