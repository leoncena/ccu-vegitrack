-- VegiTrack Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Optional: enable PostGIS for better distance calculations (geography type)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- Table: farms
-- ============================================
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  full_address VARCHAR(500),
  region VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  coordinates POINT,
  distance_km DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: stores
-- ============================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  coordinates POINT,
  distance_m INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  variety VARCHAR(100),
  origin_country VARCHAR(100) NOT NULL,
  origin_region VARCHAR(100),
  farm_id UUID REFERENCES farms(id),
  harvest_date DATE,
  price_per_kg DECIMAL(10,2),
  transport_distance_km DECIMAL(10,2),
  emissions_co2e_per_kg DECIMAL(10,3),
  image_url VARCHAR(500),
  qr_code VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: qr_codes (JSON QR payload authority)
-- ============================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  batch_number VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_qr_code_id ON qr_codes(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_product_id ON qr_codes(product_id);

-- ============================================
-- Table: product_labels
-- ============================================
CREATE TABLE IF NOT EXISTS product_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label_name VARCHAR(100) NOT NULL,
  label_color VARCHAR(7),
  icon_type VARCHAR(50),
  blockchain_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: quality_indicators
-- ============================================
CREATE TABLE IF NOT EXISTS quality_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  indicator_type VARCHAR(50) NOT NULL,
  score INTEGER,
  max_score INTEGER DEFAULT 5,
  percentage DECIMAL(5,2),
  description TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: supply_chain_ledger (VegiChain)
-- ============================================
CREATE TABLE IF NOT EXISTS supply_chain_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  block_index INTEGER NOT NULL,
  block_hash VARCHAR(66) NOT NULL,
  previous_hash VARCHAR(66),
  event_type VARCHAR(50) NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  location_type VARCHAR(50),
  actor_name VARCHAR(255),
  coordinates POINT,
  distance_from_store_km DECIMAL(10,2),
  storage_type VARCHAR(50),
  transport_method VARCHAR(50),
  timestamp TIMESTAMPTZ NOT NULL,
  details JSONB DEFAULT '{}',
  blockchain_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supply_chain_product 
  ON supply_chain_ledger(product_id, block_index);

-- ============================================
-- Table: certification_ledger (VegiChain)
-- ============================================
CREATE TABLE IF NOT EXISTS certification_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  block_index INTEGER NOT NULL,
  block_hash VARCHAR(66) NOT NULL,
  previous_hash VARCHAR(66),
  cert_type VARCHAR(100) NOT NULL,
  cert_display_name VARCHAR(255),
  certifying_body VARCHAR(255),
  certifying_body_code VARCHAR(50),
  certificate_id VARCHAR(100),
  audit_date DATE,
  expiry_date DATE,
  auditor_name VARCHAR(255),
  audit_findings TEXT,
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  blockchain_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: farming_practices
-- ============================================
CREATE TABLE IF NOT EXISTS farming_practices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  category_display_name VARCHAR(255),
  icon_type VARCHAR(50),
  practices TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: farmer_stories
-- ============================================
CREATE TABLE IF NOT EXISTS farmer_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  farmer_name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  story_content TEXT,
  quote TEXT,
  image_url VARCHAR(500),
  years_farming INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: recipes
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cultural_origin VARCHAR(100),
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  ingredients JSONB,
  instructions TEXT[],
  image_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: sustainability_metrics (per product)
-- ============================================
CREATE TABLE IF NOT EXISTS sustainability_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  co2e_per_kg DECIMAL(10,3),
  water_usage_l_per_kg DECIMAL(10,2),
  land_use_m2_per_kg DECIMAL(10,2),
  energy_kwh_per_kg DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: alternative_products
-- ============================================
CREATE TABLE IF NOT EXISTS alternative_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  alternative_id UUID REFERENCES products(id) ON DELETE CASCADE,
  reason VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, alternative_id)
);

-- ============================================
-- Table: user_favorites (products)
-- ============================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- Table: view_history (product views)
-- ============================================
CREATE TABLE IF NOT EXISTS view_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_view_history_user ON view_history(user_id, viewed_at DESC);

-- ============================================
-- Producer / Admin Tables
-- ============================================
CREATE TABLE IF NOT EXISTS producer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  country VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS producer_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producer_id UUID REFERENCES producer_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(producer_id, product_id)
);

-- ============================================
-- Table: users (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name VARCHAR(255),
  preferred_store_id UUID REFERENCES stores(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: scan_history
-- ============================================
CREATE TABLE IF NOT EXISTS scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id),
  scanned_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scan_history_user 
  ON scan_history(user_id, scanned_at DESC);

-- ============================================
-- Table: bookmarks
-- ============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE farming_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternative_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_products ENABLE ROW LEVEL SECURITY;

-- Public read access for product-related tables
CREATE POLICY "Public read access" ON farms FOR SELECT USING (true);
CREATE POLICY "Public read access" ON stores FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_labels FOR SELECT USING (true);
CREATE POLICY "Public read access" ON quality_indicators FOR SELECT USING (true);
CREATE POLICY "Public read access" ON supply_chain_ledger FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certification_ledger FOR SELECT USING (true);
CREATE POLICY "Public read access" ON farming_practices FOR SELECT USING (true);
CREATE POLICY "Public read access" ON farmer_stories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON recipes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON alternative_products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON qr_codes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sustainability_metrics FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can read own profile" ON users 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users 
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own scan history" ON scan_history 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scan history" ON scan_history 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own bookmarks" ON bookmarks 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks 
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own favorites" ON user_favorites 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON user_favorites 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON user_favorites 
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own view history" ON view_history 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own view history" ON view_history 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Producers read own profile" ON producer_profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Producers upsert own profile" ON producer_profiles 
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Producers update own profile" ON producer_profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Producers read own product links" ON producer_products 
  FOR SELECT USING (producer_id IN (SELECT id FROM producer_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Producers insert own product links" ON producer_products 
  FOR INSERT WITH CHECK (producer_id IN (SELECT id FROM producer_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Producers delete own product links" ON producer_products 
  FOR DELETE USING (producer_id IN (SELECT id FROM producer_profiles WHERE user_id = auth.uid()));

-- ============================================
-- Function: Update timestamp trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

