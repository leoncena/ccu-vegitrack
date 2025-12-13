-- VegiTrack Database Cleanup Script
-- Run this BEFORE schema_v2.sql to drop all tables
-- WARNING: This will delete ALL data including users table data
-- Only run this if you want a completely fresh start

-- Drop tables in reverse dependency order to avoid foreign key violations

-- Drop dependent tables first
DROP TABLE IF EXISTS producer_products CASCADE;
DROP TABLE IF EXISTS producer_profiles CASCADE;
DROP TABLE IF EXISTS view_history CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS scan_history CASCADE;
DROP TABLE IF EXISTS alternative_products CASCADE;
DROP TABLE IF EXISTS sustainability_metrics CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS farmer_stories CASCADE;
DROP TABLE IF EXISTS farming_practices CASCADE;
DROP TABLE IF EXISTS certification_ledger CASCADE;
DROP TABLE IF EXISTS supply_chain_ledger CASCADE;
DROP TABLE IF EXISTS quality_indicators CASCADE;
DROP TABLE IF EXISTS product_labels CASCADE;
DROP TABLE IF EXISTS qr_codes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS farms CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Note: This does NOT drop auth.users (Supabase Auth table)
-- Only drops the public.users table that extends auth.users

