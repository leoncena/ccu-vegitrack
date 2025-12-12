-- ============================================
-- Migration: Add Producer / Admin Tables
-- Run this if producer_profiles table doesn't exist
-- ============================================

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

-- Enable RLS
ALTER TABLE producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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


