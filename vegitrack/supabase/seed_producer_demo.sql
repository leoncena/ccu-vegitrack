-- ============================================
-- Producer Profile and Demo Farm for Test User
-- User: leon.cena@tum.de (UUID: 48e20a60-7047-4708-8523-30b6f3bfe427)
-- 
-- Run this if you've already run the main seed.sql before
-- ============================================

-- Create producer profile if user exists
INSERT INTO producer_profiles (id, user_id, company_name, contact_email, contact_phone, country)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '48e20a60-7047-4708-8523-30b6f3bfe427',
  'Demo Farm Co.',
  'leon.cena@tum.de',
  '+351 912 345 678',
  'Portugal'
) ON CONFLICT (user_id) DO NOTHING;

-- Create demo farm for the producer
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, description)
VALUES (
  'b1c2d3e4-f5a6-7890-abcd-ef1234567890',
  'Demo Farm',
  'Rua do Demo 123, Lisboa',
  'Lisboa',
  'Portugal',
  POINT(-9.1393, 38.7223), -- lon, lat (Lisbon coordinates)
  0.0,
  'A demo farm for testing the admin interface. This farm can be edited through the admin dashboard.'
) ON CONFLICT DO NOTHING;

