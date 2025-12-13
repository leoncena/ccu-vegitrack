-- VegiTrack Seed Data V2
-- Run this AFTER schema_v2.sql to populate sample data
-- This version includes:
-- - All 4 test farms assigned to leon.cena@tum.de
-- - Expanded product catalog with tomatoes, asparagus, avocados, apples, mangoes, lychee, and dragonfruit
-- - Complete supply chains, certifications, recipes, and sustainability data
--
-- NOTE: Run cleanup.sql and schema_v2.sql first to set up the database structure

-- ============================================
-- STEP 1: Create Stores (Continente - Project Sponsor)
-- ============================================
INSERT INTO stores (id, name, address, coordinates, distance_m)
VALUES 
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Continente - Alameda',
    'Alameda Dom Afonso Henriques, 1900-223 Lisboa, Portugal',
    POINT(-9.1333, 38.7350),
    1200
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Continente - Anjos',
    'Rua dos Anjos, 1150-030 Lisboa, Portugal',
    POINT(-9.1389, 38.7208),
    800
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-034567890123',
    'Continente - Arroios',
    'Rua de Arroios, 1150-053 Lisboa, Portugal',
    POINT(-9.1361, 38.7286),
    1000
  ),
  (
    'd4e5f6a7-b8c9-0123-def4-456789012345',
    'Continente - Baixa-Chiado',
    'Rua do Carmo, 1200-093 Lisboa, Portugal',
    POINT(-9.1414, 38.7108),
    600
  );

-- ============================================
-- STEP 2: Create Producer Profile for leon.cena@tum.de
-- User UUID: 48e20a60-7047-4708-8523-30b6f3bfe427
-- ============================================
INSERT INTO producer_profiles (id, user_id, company_name, contact_email, contact_phone, country)
VALUES (
  'a1a2b3c4-d5e6-7890-abcd-ef1234567890',
  '48e20a60-7047-4708-8523-30b6f3bfe427',
  'VegiTrack Demo Farms',
  'leon.cena@tum.de',
  '+351 912 345 678',
  'Portugal'
) ON CONFLICT (user_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  country = EXCLUDED.country;

-- ============================================
-- STEP 3: Create All 4 Test Farms
-- All assigned to leon.cena@tum.de
-- ============================================

-- Farm 1: Quinta do Sol (Portugal - Algarve)
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, our_story, what_drives_us, life_on_farm, looking_ahead, image_url)
VALUES (
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'Quinta do Sol',
  'Estrada Nacional 125, Algarve',
  'Algarve',
  'Portugal',
  POINT(-7.5370, 37.1342),
  230.0,
  'Three generations of the Silva family have tended these sun-drenched fields. What started as a small vegetable plot in 1962 has grown into a thriving 50-hectare organic farm. Our commitment to sustainable farming goes beyond certification—it''s a philosophy that touches every aspect of our operation.',
  ARRAY['Preserving traditional farming methods', 'Protecting biodiversity', 'Supporting local communities', 'Reducing carbon footprint'],
  'Life on Quinta do Sol follows the rhythm of the seasons. Our team of 15 dedicated workers lives on-site during harvest season, sharing meals and stories. We maintain native hedgerows, pollinator-friendly flower strips, and wildlife corridors that make our farm a haven for local biodiversity.',
  'We''re investing in solar panels to become carbon-neutral by 2026. Our next generation is already learning the trade, ensuring these practices continue for years to come.',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
);

-- Farm 2: GreenHouse Westland (Netherlands)
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, our_story, what_drives_us, life_on_farm, looking_ahead, image_url)
VALUES (
  'f2b3c4d5-e6f7-8901-bcde-f23456789012',
  'GreenHouse Westland',
  'Middel Broekweg 29, Naaldwijk',
  'Westland',
  'Netherlands',
  POINT(4.2056, 51.9943),
  65.0,
  'Founded in 1995, GreenHouse Westland represents the cutting edge of sustainable agriculture. We combine Dutch engineering excellence with environmental responsibility, using geothermal energy and closed-loop water systems to minimize our impact.',
  ARRAY['Innovation in sustainable technology', 'Year-round local production', 'Zero-waste operations', 'Energy efficiency'],
  'Our 12-hectare greenhouse complex operates 24/7 with automated climate control. Our team of 25 technicians and growers monitors every aspect of plant health using AI-powered sensors. We recycle 100% of our water and use beneficial insects for pest control.',
  'We''re expanding our geothermal capacity and exploring vertical farming techniques to increase yield per square meter while reducing our footprint even further.',
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800'
);

-- Farm 3: Sole di Campania (Italy)
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, our_story, what_drives_us, life_on_farm, looking_ahead, image_url)
VALUES (
  'f3c4d5e6-f7a8-9012-cdef-034567890123',
  'Sole di Campania',
  'Via Domitiana, Castel Volturno',
  'Campania',
  'Italy',
  POINT(14.0595, 40.9459),
  1450.0,
  'For over 60 years, the Rossi family has cultivated these volcanic soils blessed by Mount Vesuvius. Our San Marzano tomatoes are grown using time-honored techniques passed down through generations, combined with modern organic certification.',
  ARRAY['Preserving Italian culinary heritage', 'Volcanic soil terroir', 'Traditional methods', 'Family legacy'],
  'Life here follows ancient rhythms. Our 20-person team includes three generations working side by side. We celebrate harvest with traditional festivals, and our farmhouse kitchen is always open, filled with the aroma of fresh tomatoes being transformed into passata.',
  'We''re working with local universities to document and preserve traditional growing methods while improving our water efficiency. Our goal is to maintain our heritage while ensuring sustainability for future generations.',
  'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=800'
);

-- Farm 4: Tropical Paradise Farms (Thailand - for exotic fruits)
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, our_story, what_drives_us, life_on_farm, looking_ahead, image_url)
VALUES (
  'f4d5e6f7-a8b9-0123-cdef-145678901234',
  'Tropical Paradise Farms',
  'Chiang Mai Province, Northern Thailand',
  'Chiang Mai',
  'Thailand',
  POINT(98.9853, 18.7883),
  8900.0,
  'Founded in 1985 by the Srisawat family, our farm combines traditional Thai agricultural wisdom with modern organic practices. We''re located in the foothills of Doi Suthep, where the cool mountain air and rich soil create perfect conditions for tropical fruits.',
  ARRAY['Agroforestry and biodiversity', 'Fair trade practices', 'Community empowerment', 'Preserving traditional varieties'],
  'Our farm is a living ecosystem where fruit trees grow alongside native forest. Our 30-person team includes local hill tribe members who bring generations of knowledge. We practice intercropping, using natural mulches, and maintaining forest corridors for wildlife.',
  'We''re expanding our organic certification and working with local schools to teach sustainable farming. Our dream is to create a model farm that others in the region can learn from.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
);

-- ============================================
-- STEP 4: Create Products
-- ============================================

-- ============================================
-- TOMATOES (3 existing types)
-- ============================================

-- Cluster Tomatoes
INSERT INTO products (
  id, display_id, name, scientific_name, variety, 
  origin_country, origin_region, farm_id, harvest_date, 
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  '3345667',
  'Cluster Tomatoes',
  'Solanum lycopersicum',
  'Trust',
  'Portugal',
  'Algarve',
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  '2025-01-15',
  2.99,
  1842.5,
  1.8,
  'https://static.tegut.com/fileadmin/_processed_/5/c/csm_Tomate_Header_2_01_f1bde0a618.jpg',
  'VT-3345667'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-3345667', '11111111-2222-3333-4444-555555555555', 'BATCH-2025-001', true);

-- Cherry Tomatoes
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  '22222222-3333-4444-5555-666666666666',
  '3345668',
  'Cherry Tomatoes',
  'Solanum lycopersicum var. cerasiforme',
  'Sweet Million',
  'Netherlands',
  'Westland',
  'f2b3c4d5-e6f7-8901-bcde-f23456789012',
  '2025-01-18',
  4.49,
  65,
  0.9,
  'https://foodbutlers.de/wp-content/uploads/2020/12/Food-Butlers-Tomate-980x634.jpg',
  'VT-3345668'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-3345668', '22222222-3333-4444-5555-666666666666', 'BATCH-2025-002', true);

-- Roma Tomatoes
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  '33333333-4444-5555-6666-777777777777',
  '3345669',
  'Roma Tomatoes',
  'Solanum lycopersicum',
  'San Marzano',
  'Italy',
  'Campania',
  'f3c4d5e6-f7a8-9012-cdef-034567890123',
  '2025-01-12',
  3.29,
  1450,
  2.1,
  'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800',
  'VT-3345669'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-3345669', '33333333-4444-5555-6666-777777777777', 'BATCH-2025-003', true);

-- ============================================
-- ASPARAGUS (3 types)
-- ============================================

-- Green Asparagus
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'a1a1a1a1-2222-3333-4444-555555555555',
  'ASP001',
  'Green Asparagus',
  'Asparagus officinalis',
  'Gijnlim',
  'Netherlands',
  'Westland',
  'f2b3c4d5-e6f7-8901-bcde-f23456789012',
  '2025-01-20',
  8.99,
  65,
  0.8,
  'https://www.spargel-gaenger.de/fileadmin/_processed_/f/3/csm_spargel_aa87db7ed6.jpg',
  'VT-ASP001'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-ASP001', 'a1a1a1a1-2222-3333-4444-555555555555', 'BATCH-2025-004', true);

-- White Asparagus
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'a2a2a2a2-2222-3333-4444-555555555555',
  'ASP002',
  'White Asparagus',
  'Asparagus officinalis',
  'Grolim',
  'Netherlands',
  'Westland',
  'f2b3c4d5-e6f7-8901-bcde-f23456789012',
  '2025-01-19',
  12.99,
  65,
  0.8,
  'https://www.thiermannspargel.de/wp-content/uploads/2022/04/spargel.jpg.pagespeed.ce.6xbDae8rVK.jpg',
  'VT-ASP002'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-ASP002', 'a2a2a2a2-2222-3333-4444-555555555555', 'BATCH-2025-005', true);

-- Purple Asparagus
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'a3a3a3a3-2222-3333-4444-555555555555',
  'ASP003',
  'Purple Asparagus',
  'Asparagus officinalis',
  'Purple Passion',
  'Netherlands',
  'Westland',
  'f2b3c4d5-e6f7-8901-bcde-f23456789012',
  '2025-01-21',
  14.99,
  65,
  0.8,
  'https://www.organicindiaseeds.com/cdn/shop/files/purple-asparagus-seeds.webp?v=1761558589&width=1000',
  'VT-ASP003'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-ASP003', 'a3a3a3a3-2222-3333-4444-555555555555', 'BATCH-2025-006', true);

-- ============================================
-- AVOCADOS (3 types)
-- ============================================

-- Hass Avocado
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'b1b1b1b1-2222-3333-4444-555555555555',
  'AVO001',
  'Hass Avocado',
  'Persea americana',
  'Hass',
  'Portugal',
  'Algarve',
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  '2025-01-16',
  6.99,
  230,
  1.2,
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800',
  'VT-AVO001'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-AVO001', 'b1b1b1b1-2222-3333-4444-555555555555', 'BATCH-2025-007', true);

-- Fuerte Avocado
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'b2b2b2b2-2222-3333-4444-555555555555',
  'AVO002',
  'Fuerte Avocado',
  'Persea americana',
  'Fuerte',
  'Portugal',
  'Algarve',
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  '2025-01-17',
  7.49,
  230,
  1.2,
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800',
  'VT-AVO002'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-AVO002', 'b2b2b2b2-2222-3333-4444-555555555555', 'BATCH-2025-008', true);

-- Bacon Avocado
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'b3b3b3b3-2222-3333-4444-555555555555',
  'AVO003',
  'Bacon Avocado',
  'Persea americana',
  'Bacon',
  'Portugal',
  'Algarve',
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  '2025-01-18',
  6.49,
  230,
  1.2,
  'https://www.blifesrl.it/wp-content/uploads/2021/02/6658.png',
  'VT-AVO003'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-AVO003', 'b3b3b3b3-2222-3333-4444-555555555555', 'BATCH-2025-009', true);

-- ============================================
-- APPLES (3 types)
-- ============================================

-- Gala Apple
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'c1c1c1c1-2222-3333-4444-555555555555',
  'APP001',
  'Gala Apple',
  'Malus domestica',
  'Gala',
  'Italy',
  'Campania',
  'f3c4d5e6-f7a8-9012-cdef-034567890123',
  '2025-01-10',
  3.99,
  1450,
  0.6,
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
  'VT-APP001'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-APP001', 'c1c1c1c1-2222-3333-4444-555555555555', 'BATCH-2025-010', true);

-- Granny Smith Apple
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'c2c2c2c2-2222-3333-4444-555555555555',
  'APP002',
  'Granny Smith Apple',
  'Malus domestica',
  'Granny Smith',
  'Italy',
  'Campania',
  'f3c4d5e6-f7a8-9012-cdef-034567890123',
  '2025-01-11',
  4.29,
  1450,
  0.6,
  'https://upload.wikimedia.org/wikipedia/commons/d/d7/Granny_smith_and_cross_section.jpg',
  'VT-APP002'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-APP002', 'c2c2c2c2-2222-3333-4444-555555555555', 'BATCH-2025-011', true);

-- Fuji Apple
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'c3c3c3c3-2222-3333-4444-555555555555',
  'APP003',
  'Fuji Apple',
  'Malus domestica',
  'Fuji',
  'Italy',
  'Campania',
  'f3c4d5e6-f7a8-9012-cdef-034567890123',
  '2025-01-12',
  4.49,
  1450,
  0.6,
  'https://www.organicindiaseeds.com/cdn/shop/files/heirloom-fuji-apple-seedlings-growing.jpg?v=1762257296&width=1000',
  'VT-APP003'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-APP003', 'c3c3c3c3-2222-3333-4444-555555555555', 'BATCH-2025-012', true);

-- ============================================
-- MANGOES (3 types)
-- ============================================

-- Ataulfo Mango
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'd1d1d1d1-2222-3333-4444-555555555555',
  'MAN001',
  'Ataulfo Mango',
  'Mangifera indica',
  'Ataulfo',
  'Thailand',
  'Chiang Mai',
  'f4d5e6f7-a8b9-0123-cdef-145678901234',
  '2025-01-08',
  5.99,
  8900,
  3.2,
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Yay%2C_the_Ataulfos_Have_Arrived.jpg/500px-Yay%2C_the_Ataulfos_Have_Arrived.jpg',
  'VT-MAN001'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-MAN001', 'd1d1d1d1-2222-3333-4444-555555555555', 'BATCH-2025-013', true);

-- Tommy Atkins Mango
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'd2d2d2d2-2222-3333-4444-555555555555',
  'MAN002',
  'Tommy Atkins Mango',
  'Mangifera indica',
  'Tommy Atkins',
  'Thailand',
  'Chiang Mai',
  'f4d5e6f7-a8b9-0123-cdef-145678901234',
  '2025-01-09',
  5.49,
  8900,
  3.2,
  'https://www.pickmenursery.co.za/wp-content/uploads/Tommy-atkins-Mango.jpeg',
  'VT-MAN002'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-MAN002', 'd2d2d2d2-2222-3333-4444-555555555555', 'BATCH-2025-014', true);

-- Keitt Mango
INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'd3d3d3d3-2222-3333-4444-555555555555',
  'MAN003',
  'Keitt Mango',
  'Mangifera indica',
  'Keitt',
  'Thailand',
  'Chiang Mai',
  'f4d5e6f7-a8b9-0123-cdef-145678901234',
  '2025-01-10',
  6.29,
  8900,
  3.2,
  'https://www.truebenecker.de/cdn/shop/files/mango_keitt_bio_kaufen.jpg?v=1761757779',
  'VT-MAN003'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-MAN003', 'd3d3d3d3-2222-3333-4444-555555555555', 'BATCH-2025-015', true);

-- ============================================
-- LYCHEE (1 type)
-- ============================================

INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'e1e1e1e1-2222-3333-4444-555555555555',
  'LYC001',
  'Lychee',
  'Litchi chinensis',
  'Brewster',
  'Thailand',
  'Chiang Mai',
  'f4d5e6f7-a8b9-0123-cdef-145678901234',
  '2025-01-07',
  9.99,
  8900,
  3.5,
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lychee.jpg/2560px-Lychee.jpg',
  'VT-LYC001'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-LYC001', 'e1e1e1e1-2222-3333-4444-555555555555', 'BATCH-2025-016', true);

-- ============================================
-- DRAGONFRUIT (1 type)
-- ============================================

INSERT INTO products (
  id, display_id, name, scientific_name, variety,
  origin_country, origin_region, farm_id, harvest_date,
  price_per_kg, transport_distance_km, emissions_co2e_per_kg,
  image_url, qr_code
)
VALUES (
  'f1f1f1f1-2222-3333-4444-555555555555',
  'DRG001',
  'Dragonfruit',
  'Hylocereus undatus',
  'White Flesh',
  'Thailand',
  'Chiang Mai',
  'f4d5e6f7-a8b9-0123-cdef-145678901234',
  '2025-01-06',
  12.99,
  8900,
  3.8,
  'https://upload.wikimedia.org/wikipedia/commons/9/9f/Dragonfruit_Chiayi_market.jpg',
  'VT-DRG001'
);

INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-DRG001', 'f1f1f1f1-2222-3333-4444-555555555555', 'BATCH-2025-017', true);

-- ============================================
-- STEP 5: Link Products to Producer
-- ============================================
-- Link all products to the producer profile
INSERT INTO producer_products (producer_id, product_id)
SELECT 
  'a1a2b3c4-d5e6-7890-abcd-ef1234567890',
  id
FROM products
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 6: Add Product Labels
-- ============================================
-- Tomatoes
INSERT INTO product_labels (product_id, label_name, blockchain_verified) VALUES
('11111111-2222-3333-4444-555555555555', 'Organic', true),
('11111111-2222-3333-4444-555555555555', 'Pesticide-Free', true),
('11111111-2222-3333-4444-555555555555', 'Low Carbon', true),
('22222222-3333-4444-5555-666666666666', 'Local', true),
('22222222-3333-4444-5555-666666666666', 'Greenhouse', true),
('33333333-4444-5555-6666-777777777777', 'Organic', true),
('33333333-4444-5555-6666-777777777777', 'Premium', true);

-- Asparagus
INSERT INTO product_labels (product_id, label_name, blockchain_verified) VALUES
('a1a1a1a1-2222-3333-4444-555555555555', 'Local', true),
('a1a1a1a1-2222-3333-4444-555555555555', 'Fresh', true),
('a2a2a2a2-2222-3333-4444-555555555555', 'Premium', true),
('a2a2a2a2-2222-3333-4444-555555555555', 'Local', true),
('a3a3a3a3-2222-3333-4444-555555555555', 'Rare Variety', true),
('a3a3a3a3-2222-3333-4444-555555555555', 'Local', true);

-- Avocados
INSERT INTO product_labels (product_id, label_name, blockchain_verified) VALUES
('b1b1b1b1-2222-3333-4444-555555555555', 'Organic', true),
('b1b1b1b1-2222-3333-4444-555555555555', 'Ripe', true),
('b2b2b2b2-2222-3333-4444-555555555555', 'Organic', true),
('b2b2b2b2-2222-3333-4444-555555555555', 'Fresh', true),
('b3b3b3b3-2222-3333-4444-555555555555', 'Organic', true),
('b3b3b3b3-2222-3333-4444-555555555555', 'Premium', true);

-- Apples
INSERT INTO product_labels (product_id, label_name, blockchain_verified) VALUES
('c1c1c1c1-2222-3333-4444-555555555555', 'Organic', true),
('c1c1c1c1-2222-3333-4444-555555555555', 'Crisp', true),
('c2c2c2c2-2222-3333-4444-555555555555', 'Organic', true),
('c2c2c2c2-2222-3333-4444-555555555555', 'Tart', true),
('c3c3c3c3-2222-3333-4444-555555555555', 'Organic', true),
('c3c3c3c3-2222-3333-4444-555555555555', 'Sweet', true);

-- Mangoes
INSERT INTO product_labels (product_id, label_name, blockchain_verified) VALUES
('d1d1d1d1-2222-3333-4444-555555555555', 'Tropical', true),
('d1d1d1d1-2222-3333-4444-555555555555', 'Sweet', true),
('d2d2d2d2-2222-3333-4444-555555555555', 'Tropical', true),
('d2d2d2d2-2222-3333-4444-555555555555', 'Juicy', true),
('d3d3d3d3-2222-3333-4444-555555555555', 'Tropical', true),
('d3d3d3d3-2222-3333-4444-555555555555', 'Premium', true);

-- Lychee
INSERT INTO product_labels (product_id, label_name, blockchain_verified) VALUES
('e1e1e1e1-2222-3333-4444-555555555555', 'Exotic', true),
('e1e1e1e1-2222-3333-4444-555555555555', 'Sweet', true),
('e1e1e1e1-2222-3333-4444-555555555555', 'Fresh', true);

-- Dragonfruit
INSERT INTO product_labels (product_id, label_name, blockchain_verified) VALUES
('f1f1f1f1-2222-3333-4444-555555555555', 'Exotic', true),
('f1f1f1f1-2222-3333-4444-555555555555', 'Rare', true),
('f1f1f1f1-2222-3333-4444-555555555555', 'Premium', true);

-- ============================================
-- STEP 7: Add Quality Indicators
-- ============================================
-- Add quality indicators for all products
INSERT INTO quality_indicators (product_id, indicator_type, score, max_score, percentage, description, shelf_life_remaining_days) VALUES
('11111111-2222-3333-4444-555555555555', 'freshness', 4, 5, NULL, 'Harvested 3 days ago', 5),
('11111111-2222-3333-4444-555555555555', 'ripeness', 4, 5, NULL, 'Perfectly ripe', NULL),
('11111111-2222-3333-4444-555555555555', 'shelf_life', NULL, NULL, 80, '~5 days remaining', 5),
('22222222-3333-4444-5555-666666666666', 'freshness', 5, 5, NULL, 'Harvested today', 7),
('22222222-3333-4444-5555-666666666666', 'ripeness', 5, 5, NULL, 'Perfectly ripe', NULL),
('33333333-4444-5555-6666-777777777777', 'freshness', 4, 5, NULL, 'Harvested 2 days ago', 6),
('33333333-4444-5555-6666-777777777777', 'ripeness', 4, 5, NULL, 'Perfectly ripe', NULL),
('a1a1a1a1-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested today', 3),
('a1a1a1a1-2222-3333-4444-555555555555', 'ripeness', 5, 5, NULL, 'Perfectly fresh', NULL),
('a2a2a2a2-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested today', 3),
('a3a3a3a3-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested today', 3),
('b1b1b1b1-2222-3333-4444-555555555555', 'freshness', 4, 5, NULL, 'Harvested 5 days ago', 4),
('b1b1b1b1-2222-3333-4444-555555555555', 'ripeness', 3, 5, NULL, 'Ready in 2-3 days', NULL),
('b2b2b2b2-2222-3333-4444-555555555555', 'freshness', 4, 5, NULL, 'Harvested 4 days ago', 5),
('b2b2b2b2-2222-3333-4444-555555555555', 'ripeness', 4, 5, NULL, 'Almost ready', NULL),
('b3b3b3b3-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested 3 days ago', 6),
('b3b3b3b3-2222-3333-4444-555555555555', 'ripeness', 4, 5, NULL, 'Ready to eat', NULL),
('c1c1c1c1-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested 10 days ago', 60),
('c1c1c1c1-2222-3333-4444-555555555555', 'ripeness', 5, 5, NULL, 'Perfectly crisp', NULL),
('c2c2c2c2-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested 9 days ago', 60),
('c2c2c2c2-2222-3333-4444-555555555555', 'ripeness', 5, 5, NULL, 'Perfectly tart', NULL),
('c3c3c3c3-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested 8 days ago', 60),
('c3c3c3c3-2222-3333-4444-555555555555', 'ripeness', 5, 5, NULL, 'Perfectly sweet', NULL),
('d1d1d1d1-2222-3333-4444-555555555555', 'freshness', 4, 5, NULL, 'Harvested 7 days ago', 5),
('d1d1d1d1-2222-3333-4444-555555555555', 'ripeness', 4, 5, NULL, 'Perfectly ripe', NULL),
('d2d2d2d2-2222-3333-4444-555555555555', 'freshness', 4, 5, NULL, 'Harvested 6 days ago', 6),
('d2d2d2d2-2222-3333-4444-555555555555', 'ripeness', 5, 5, NULL, 'Perfectly ripe', NULL),
('d3d3d3d3-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested 5 days ago', 7),
('d3d3d3d3-2222-3333-4444-555555555555', 'ripeness', 4, 5, NULL, 'Almost ready', NULL),
('e1e1e1e1-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested 4 days ago', 4),
('e1e1e1e1-2222-3333-4444-555555555555', 'ripeness', 5, 5, NULL, 'Perfectly sweet', NULL),
('f1f1f1f1-2222-3333-4444-555555555555', 'freshness', 5, 5, NULL, 'Harvested 3 days ago', 5),
('f1f1f1f1-2222-3333-4444-555555555555', 'ripeness', 5, 5, NULL, 'Perfectly ripe', NULL);

-- ============================================
-- STEP 8: Add Supply Chain Ledger (All Products)
-- ============================================
INSERT INTO supply_chain_ledger (
  product_id, block_index, block_hash, previous_hash,
  event_type, location_name, location_type, actor_name,
  coordinates, distance_from_store_km, storage_type, transport_method, timestamp, details
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  0,
  '0x7f3a8b2c9d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
  NULL,
  'harvest',
  'Quinta do Sol',
  'farm',
  'João Silva',
  POINT(-7.5370, 37.1342),
  230.0,
  'ambient',
  NULL,
  '2025-01-15T06:30:00Z',
  '{"temperature_c": 18, "humidity_percent": 65, "batch_size_kg": 500}'
),
(
  '11111111-2222-3333-4444-555555555555',
  1,
  '0x2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c',
  '0x7f3a8b2c9d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
  'package',
  'Packaging Center',
  'packaging_center',
  'Maria Santos',
  POINT(-7.9090, 36.9975),
  157.0,
  'refrigerated',
  NULL,
  '2025-01-15T10:15:00Z',
  '{"package_type": "cluster_tray", "weight_kg": 0.5, "quality_grade": "A"}'
),
(
  '11111111-2222-3333-4444-555555555555',
  2,
  '0x9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d',
  '0x2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c',
  'distribution',
  'Distribution Center',
  'distribution_center',
  'TransEuro Logistics',
  POINT(-8.6291, 37.1390),
  80.0,
  'refrigerated',
  'refrigerated_truck',
  '2025-01-17T14:30:00Z',
  '{"vehicle_id": "TE-7823", "temperature_maintained_c": 4, "route": "Algarve → Lisbon"}'
),
(
  '11111111-2222-3333-4444-555555555555',
  3,
  '0x4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f',
  '0x9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d',
  'store_arrival',
  'Continente - Anjos',
  'store',
  'Store Team',
  POINT(-9.1389, 38.7208),
  0,
  'refrigerated',
  'refrigerated_truck',
  '2025-01-18T05:45:00Z',
  '{"receiving_dock": "B2", "quality_check_passed": true, "shelf_location": "Produce Aisle 3"}'
),
-- Cherry Tomatoes (Netherlands → Lisbon)
('22222222-3333-4444-5555-666666666666', 0, '0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', NULL, 'harvest', 'GreenHouse Westland', 'farm', 'Pieter van der Berg', POINT(4.2056, 51.9943), 65.0, 'ambient', NULL, '2025-01-18T05:00:00Z', '{"temperature_c": 16, "humidity_percent": 70, "batch_size_kg": 300}'),
('22222222-3333-4444-5555-666666666666', 1, '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', '0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', 'package', 'Packaging Center Westland', 'packaging_center', 'Sophie de Vries', POINT(4.2100, 51.9900), 60.0, 'refrigerated', NULL, '2025-01-18T08:30:00Z', '{"package_type": "punnets", "weight_kg": 0.25, "quality_grade": "A"}'),
('22222222-3333-4444-5555-666666666666', 2, '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', 'distribution', 'Distribution Center Rotterdam', 'distribution_center', 'EuroFresh Logistics', POINT(4.4777, 51.9225), 50.0, 'refrigerated', 'refrigerated_truck', '2025-01-19T10:00:00Z', '{"vehicle_id": "EF-4521", "temperature_maintained_c": 2, "route": "Netherlands → Portugal"}'),
('22222222-3333-4444-5555-666666666666', 3, '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', 'store_arrival', 'Continente - Alameda', 'store', 'Store Team', POINT(-9.1333, 38.7350), 0, 'refrigerated', 'refrigerated_truck', '2025-01-20T06:00:00Z', '{"receiving_dock": "A1", "quality_check_passed": true, "shelf_location": "Produce Aisle 2"}'),
-- Roma Tomatoes (Italy → Lisbon)
('33333333-4444-5555-6666-777777777777', 0, '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7', NULL, 'harvest', 'Sole di Campania', 'farm', 'Marco Rossi', POINT(14.0595, 40.9459), 1450.0, 'ambient', NULL, '2025-01-12T07:00:00Z', '{"temperature_c": 20, "humidity_percent": 60, "batch_size_kg": 600}'),
('33333333-4444-5555-6666-777777777777', 1, '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8', '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7', 'package', 'Packaging Center Campania', 'packaging_center', 'Giuseppe Romano', POINT(14.0500, 40.9500), 1445.0, 'refrigerated', NULL, '2025-01-12T11:00:00Z', '{"package_type": "crate", "weight_kg": 10, "quality_grade": "A"}'),
('33333333-4444-5555-6666-777777777777', 2, '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9', '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8', 'distribution', 'Distribution Center Naples', 'distribution_center', 'Mediterranean Transport', POINT(14.2681, 40.8518), 1440.0, 'refrigerated', 'refrigerated_truck', '2025-01-13T14:00:00Z', '{"vehicle_id": "MT-8934", "temperature_maintained_c": 4, "route": "Italy → Portugal"}'),
('33333333-4444-5555-6666-777777777777', 3, '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0', '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9', 'store_arrival', 'Continente - Arroios', 'store', 'Store Team', POINT(-9.1361, 38.7286), 0, 'refrigerated', 'refrigerated_truck', '2025-01-15T08:00:00Z', '{"receiving_dock": "C3", "quality_check_passed": true, "shelf_location": "Produce Aisle 4"}'),
-- Green Asparagus (Netherlands → Lisbon)
('a1a1a1a1-2222-3333-4444-555555555555', 0, '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1', NULL, 'harvest', 'GreenHouse Westland', 'farm', 'Pieter van der Berg', POINT(4.2056, 51.9943), 65.0, 'ambient', NULL, '2025-01-20T04:00:00Z', '{"temperature_c": 15, "humidity_percent": 75, "batch_size_kg": 200}'),
('a1a1a1a1-2222-3333-4444-555555555555', 1, '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2', '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1', 'package', 'Packaging Center Westland', 'packaging_center', 'Sophie de Vries', POINT(4.2100, 51.9900), 60.0, 'refrigerated', NULL, '2025-01-20T06:00:00Z', '{"package_type": "bunches", "weight_kg": 0.5, "quality_grade": "A"}'),
('a1a1a1a1-2222-3333-4444-555555555555', 2, '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3', '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2', 'distribution', 'Distribution Center Rotterdam', 'distribution_center', 'EuroFresh Logistics', POINT(4.4777, 51.9225), 50.0, 'refrigerated', 'refrigerated_truck', '2025-01-20T12:00:00Z', '{"vehicle_id": "EF-4522", "temperature_maintained_c": 2, "route": "Netherlands → Portugal"}'),
('a1a1a1a1-2222-3333-4444-555555555555', 3, '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4', '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3', 'store_arrival', 'Continente - Baixa-Chiado', 'store', 'Store Team', POINT(-9.1414, 38.7108), 0, 'refrigerated', 'refrigerated_truck', '2025-01-21T05:00:00Z', '{"receiving_dock": "B1", "quality_check_passed": true, "shelf_location": "Produce Aisle 1"}'),
-- White Asparagus (Netherlands → Lisbon)
('a2a2a2a2-2222-3333-4444-555555555555', 0, '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5', NULL, 'harvest', 'GreenHouse Westland', 'farm', 'Pieter van der Berg', POINT(4.2056, 51.9943), 65.0, 'ambient', NULL, '2025-01-19T04:00:00Z', '{"temperature_c": 15, "humidity_percent": 75, "batch_size_kg": 150}'),
('a2a2a2a2-2222-3333-4444-555555555555', 1, '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6', '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5', 'package', 'Packaging Center Westland', 'packaging_center', 'Sophie de Vries', POINT(4.2100, 51.9900), 60.0, 'refrigerated', NULL, '2025-01-19T06:00:00Z', '{"package_type": "bunches", "weight_kg": 0.5, "quality_grade": "A"}'),
('a2a2a2a2-2222-3333-4444-555555555555', 2, '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7', '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6', 'distribution', 'Distribution Center Rotterdam', 'distribution_center', 'EuroFresh Logistics', POINT(4.4777, 51.9225), 50.0, 'refrigerated', 'refrigerated_truck', '2025-01-19T12:00:00Z', '{"vehicle_id": "EF-4523", "temperature_maintained_c": 2, "route": "Netherlands → Portugal"}'),
('a2a2a2a2-2222-3333-4444-555555555555', 3, '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7', 'store_arrival', 'Continente - Alameda', 'store', 'Store Team', POINT(-9.1333, 38.7350), 0, 'refrigerated', 'refrigerated_truck', '2025-01-20T05:00:00Z', '{"receiving_dock": "A2", "quality_check_passed": true, "shelf_location": "Produce Aisle 1"}'),
-- Purple Asparagus (Netherlands → Lisbon)
('a3a3a3a3-2222-3333-4444-555555555555', 0, '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', NULL, 'harvest', 'GreenHouse Westland', 'farm', 'Pieter van der Berg', POINT(4.2056, 51.9943), 65.0, 'ambient', NULL, '2025-01-21T04:00:00Z', '{"temperature_c": 15, "humidity_percent": 75, "batch_size_kg": 100}'),
('a3a3a3a3-2222-3333-4444-555555555555', 1, '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', 'package', 'Packaging Center Westland', 'packaging_center', 'Sophie de Vries', POINT(4.2100, 51.9900), 60.0, 'refrigerated', NULL, '2025-01-21T06:00:00Z', '{"package_type": "bunches", "weight_kg": 0.5, "quality_grade": "A"}'),
('a3a3a3a3-2222-3333-4444-555555555555', 2, '0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', 'distribution', 'Distribution Center Rotterdam', 'distribution_center', 'EuroFresh Logistics', POINT(4.4777, 51.9225), 50.0, 'refrigerated', 'refrigerated_truck', '2025-01-21T12:00:00Z', '{"vehicle_id": "EF-4524", "temperature_maintained_c": 2, "route": "Netherlands → Portugal"}'),
('a3a3a3a3-2222-3333-4444-555555555555', 3, '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2', '0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', 'store_arrival', 'Continente - Anjos', 'store', 'Store Team', POINT(-9.1389, 38.7208), 0, 'refrigerated', 'refrigerated_truck', '2025-01-22T05:00:00Z', '{"receiving_dock": "B3", "quality_check_passed": true, "shelf_location": "Produce Aisle 1"}'),
-- Hass Avocado (Portugal → Lisbon)
('b1b1b1b1-2222-3333-4444-555555555555', 0, '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3', NULL, 'harvest', 'Quinta do Sol', 'farm', 'João Silva', POINT(-7.5370, 37.1342), 230.0, 'ambient', NULL, '2025-01-16T08:00:00Z', '{"temperature_c": 22, "humidity_percent": 70, "batch_size_kg": 400}'),
('b1b1b1b1-2222-3333-4444-555555555555', 1, '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4', '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3', 'package', 'Packaging Center Algarve', 'packaging_center', 'Maria Santos', POINT(-7.9090, 36.9975), 157.0, 'refrigerated', NULL, '2025-01-16T12:00:00Z', '{"package_type": "crate", "weight_kg": 8, "quality_grade": "A"}'),
('b1b1b1b1-2222-3333-4444-555555555555', 2, '0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4', 'distribution', 'Distribution Center Algarve', 'distribution_center', 'TransEuro Logistics', POINT(-8.6291, 37.1390), 80.0, 'refrigerated', 'refrigerated_truck', '2025-01-17T10:00:00Z', '{"vehicle_id": "TE-7824", "temperature_maintained_c": 6, "route": "Algarve → Lisbon"}'),
('b1b1b1b1-2222-3333-4444-555555555555', 3, '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6', '0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', 'store_arrival', 'Continente - Arroios', 'store', 'Store Team', POINT(-9.1361, 38.7286), 0, 'refrigerated', 'refrigerated_truck', '2025-01-18T07:00:00Z', '{"receiving_dock": "C2", "quality_check_passed": true, "shelf_location": "Produce Aisle 5"}'),
-- Fuerte Avocado (Portugal → Lisbon)
('b2b2b2b2-2222-3333-4444-555555555555', 0, '0x6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7', NULL, 'harvest', 'Quinta do Sol', 'farm', 'João Silva', POINT(-7.5370, 37.1342), 230.0, 'ambient', NULL, '2025-01-17T08:00:00Z', '{"temperature_c": 22, "humidity_percent": 70, "batch_size_kg": 350}'),
('b2b2b2b2-2222-3333-4444-555555555555', 1, '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8', '0x6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7', 'package', 'Packaging Center Algarve', 'packaging_center', 'Maria Santos', POINT(-7.9090, 36.9975), 157.0, 'refrigerated', NULL, '2025-01-17T12:00:00Z', '{"package_type": "crate", "weight_kg": 8, "quality_grade": "A"}'),
('b2b2b2b2-2222-3333-4444-555555555555', 2, '0x8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8', 'distribution', 'Distribution Center Algarve', 'distribution_center', 'TransEuro Logistics', POINT(-8.6291, 37.1390), 80.0, 'refrigerated', 'refrigerated_truck', '2025-01-18T10:00:00Z', '{"vehicle_id": "TE-7825", "temperature_maintained_c": 6, "route": "Algarve → Lisbon"}'),
('b2b2b2b2-2222-3333-4444-555555555555', 3, '0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0', '0x8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', 'store_arrival', 'Continente - Baixa-Chiado', 'store', 'Store Team', POINT(-9.1414, 38.7108), 0, 'refrigerated', 'refrigerated_truck', '2025-01-19T07:00:00Z', '{"receiving_dock": "B2", "quality_check_passed": true, "shelf_location": "Produce Aisle 5"}'),
-- Bacon Avocado (Portugal → Lisbon)
('b3b3b3b3-2222-3333-4444-555555555555', 0, '0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', NULL, 'harvest', 'Quinta do Sol', 'farm', 'João Silva', POINT(-7.5370, 37.1342), 230.0, 'ambient', NULL, '2025-01-18T08:00:00Z', '{"temperature_c": 22, "humidity_percent": 70, "batch_size_kg": 300}'),
('b3b3b3b3-2222-3333-4444-555555555555', 1, '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2', '0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', 'package', 'Packaging Center Algarve', 'packaging_center', 'Maria Santos', POINT(-7.9090, 36.9975), 157.0, 'refrigerated', NULL, '2025-01-18T12:00:00Z', '{"package_type": "crate", "weight_kg": 8, "quality_grade": "A"}'),
('b3b3b3b3-2222-3333-4444-555555555555', 2, '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2', 'distribution', 'Distribution Center Algarve', 'distribution_center', 'TransEuro Logistics', POINT(-8.6291, 37.1390), 80.0, 'refrigerated', 'refrigerated_truck', '2025-01-19T10:00:00Z', '{"vehicle_id": "TE-7826", "temperature_maintained_c": 6, "route": "Algarve → Lisbon"}'),
('b3b3b3b3-2222-3333-4444-555555555555', 3, '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', 'store_arrival', 'Continente - Alameda', 'store', 'Store Team', POINT(-9.1333, 38.7350), 0, 'refrigerated', 'refrigerated_truck', '2025-01-20T07:00:00Z', '{"receiving_dock": "A3", "quality_check_passed": true, "shelf_location": "Produce Aisle 5"}'),
-- Gala Apple (Italy → Lisbon)
('c1c1c1c1-2222-3333-4444-555555555555', 0, '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', NULL, 'harvest', 'Sole di Campania', 'farm', 'Marco Rossi', POINT(14.0595, 40.9459), 1450.0, 'ambient', NULL, '2025-01-10T07:00:00Z', '{"temperature_c": 18, "humidity_percent": 65, "batch_size_kg": 800}'),
('c1c1c1c1-2222-3333-4444-555555555555', 1, '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', 'package', 'Packaging Center Campania', 'packaging_center', 'Giuseppe Romano', POINT(14.0500, 40.9500), 1445.0, 'refrigerated', NULL, '2025-01-10T11:00:00Z', '{"package_type": "crate", "weight_kg": 15, "quality_grade": "A"}'),
('c1c1c1c1-2222-3333-4444-555555555555', 2, '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7', '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', 'distribution', 'Distribution Center Naples', 'distribution_center', 'Mediterranean Transport', POINT(14.2681, 40.8518), 1440.0, 'refrigerated', 'refrigerated_truck', '2025-01-11T14:00:00Z', '{"vehicle_id": "MT-8935", "temperature_maintained_c": 2, "route": "Italy → Portugal"}'),
('c1c1c1c1-2222-3333-4444-555555555555', 3, '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8', '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7', 'store_arrival', 'Continente - Anjos', 'store', 'Store Team', POINT(-9.1389, 38.7208), 0, 'refrigerated', 'refrigerated_truck', '2025-01-13T08:00:00Z', '{"receiving_dock": "B4", "quality_check_passed": true, "shelf_location": "Produce Aisle 6"}'),
-- Granny Smith Apple (Italy → Lisbon)
('c2c2c2c2-2222-3333-4444-555555555555', 0, '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9', NULL, 'harvest', 'Sole di Campania', 'farm', 'Marco Rossi', POINT(14.0595, 40.9459), 1450.0, 'ambient', NULL, '2025-01-11T07:00:00Z', '{"temperature_c": 18, "humidity_percent": 65, "batch_size_kg": 750}'),
('c2c2c2c2-2222-3333-4444-555555555555', 1, '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0', '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9', 'package', 'Packaging Center Campania', 'packaging_center', 'Giuseppe Romano', POINT(14.0500, 40.9500), 1445.0, 'refrigerated', NULL, '2025-01-11T11:00:00Z', '{"package_type": "crate", "weight_kg": 15, "quality_grade": "A"}'),
('c2c2c2c2-2222-3333-4444-555555555555', 2, '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1', '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0', 'distribution', 'Distribution Center Naples', 'distribution_center', 'Mediterranean Transport', POINT(14.2681, 40.8518), 1440.0, 'refrigerated', 'refrigerated_truck', '2025-01-12T14:00:00Z', '{"vehicle_id": "MT-8936", "temperature_maintained_c": 2, "route": "Italy → Portugal"}'),
('c2c2c2c2-2222-3333-4444-555555555555', 3, '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2', '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1', 'store_arrival', 'Continente - Arroios', 'store', 'Store Team', POINT(-9.1361, 38.7286), 0, 'refrigerated', 'refrigerated_truck', '2025-01-14T08:00:00Z', '{"receiving_dock": "C4", "quality_check_passed": true, "shelf_location": "Produce Aisle 6"}'),
-- Fuji Apple (Italy → Lisbon)
('c3c3c3c3-2222-3333-4444-555555555555', 0, '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3', NULL, 'harvest', 'Sole di Campania', 'farm', 'Marco Rossi', POINT(14.0595, 40.9459), 1450.0, 'ambient', NULL, '2025-01-12T07:00:00Z', '{"temperature_c": 18, "humidity_percent": 65, "batch_size_kg": 700}'),
('c3c3c3c3-2222-3333-4444-555555555555', 1, '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4', '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3', 'package', 'Packaging Center Campania', 'packaging_center', 'Giuseppe Romano', POINT(14.0500, 40.9500), 1445.0, 'refrigerated', NULL, '2025-01-12T11:00:00Z', '{"package_type": "crate", "weight_kg": 15, "quality_grade": "A"}'),
('c3c3c3c3-2222-3333-4444-555555555555', 2, '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5', '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4', 'distribution', 'Distribution Center Naples', 'distribution_center', 'Mediterranean Transport', POINT(14.2681, 40.8518), 1440.0, 'refrigerated', 'refrigerated_truck', '2025-01-13T14:00:00Z', '{"vehicle_id": "MT-8937", "temperature_maintained_c": 2, "route": "Italy → Portugal"}'),
('c3c3c3c3-2222-3333-4444-555555555555', 3, '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6', '0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5', 'store_arrival', 'Continente - Baixa-Chiado', 'store', 'Store Team', POINT(-9.1414, 38.7108), 0, 'refrigerated', 'refrigerated_truck', '2025-01-15T08:00:00Z', '{"receiving_dock": "B4", "quality_check_passed": true, "shelf_location": "Produce Aisle 6"}'),
-- Ataulfo Mango (Thailand → Lisbon)
('d1d1d1d1-2222-3333-4444-555555555555', 0, '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7', NULL, 'harvest', 'Tropical Paradise Farms', 'farm', 'Niran Srisawat', POINT(98.9853, 18.7883), 8900.0, 'ambient', NULL, '2025-01-08T06:00:00Z', '{"temperature_c": 28, "humidity_percent": 80, "batch_size_kg": 500}'),
('d1d1d1d1-2222-3333-4444-555555555555', 1, '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7', 'package', 'Packaging Center Chiang Mai', 'packaging_center', 'Somsak Tan', POINT(98.9800, 18.7900), 8895.0, 'refrigerated', NULL, '2025-01-08T10:00:00Z', '{"package_type": "crate", "weight_kg": 12, "quality_grade": "A"}'),
('d1d1d1d1-2222-3333-4444-555555555555', 2, '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', 'distribution', 'Distribution Center Bangkok', 'distribution_center', 'Asia-Europe Logistics', POINT(100.5018, 13.7563), 8800.0, 'refrigerated', 'refrigerated_truck', '2025-01-09T08:00:00Z', '{"vehicle_id": "AE-1234", "temperature_maintained_c": 8, "route": "Thailand → Portugal (via ship)"}'),
('d1d1d1d1-2222-3333-4444-555555555555', 3, '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', '0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', 'store_arrival', 'Continente - Alameda', 'store', 'Store Team', POINT(-9.1333, 38.7350), 0, 'refrigerated', 'refrigerated_truck', '2025-01-15T06:00:00Z', '{"receiving_dock": "A4", "quality_check_passed": true, "shelf_location": "Produce Aisle 7"}'),
-- Tommy Atkins Mango (Thailand → Lisbon)
('d2d2d2d2-2222-3333-4444-555555555555', 0, '0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', NULL, 'harvest', 'Tropical Paradise Farms', 'farm', 'Niran Srisawat', POINT(98.9853, 18.7883), 8900.0, 'ambient', NULL, '2025-01-09T06:00:00Z', '{"temperature_c": 28, "humidity_percent": 80, "batch_size_kg": 450}'),
('d2d2d2d2-2222-3333-4444-555555555555', 1, '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2', '0x0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1', 'package', 'Packaging Center Chiang Mai', 'packaging_center', 'Somsak Tan', POINT(98.9800, 18.7900), 8895.0, 'refrigerated', NULL, '2025-01-09T10:00:00Z', '{"package_type": "crate", "weight_kg": 12, "quality_grade": "A"}'),
('d2d2d2d2-2222-3333-4444-555555555555', 2, '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3', '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2', 'distribution', 'Distribution Center Bangkok', 'distribution_center', 'Asia-Europe Logistics', POINT(100.5018, 13.7563), 8800.0, 'refrigerated', 'refrigerated_truck', '2025-01-10T08:00:00Z', '{"vehicle_id": "AE-1235", "temperature_maintained_c": 8, "route": "Thailand → Portugal (via ship)"}'),
('d2d2d2d2-2222-3333-4444-555555555555', 3, '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4', '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3', 'store_arrival', 'Continente - Anjos', 'store', 'Store Team', POINT(-9.1389, 38.7208), 0, 'refrigerated', 'refrigerated_truck', '2025-01-16T06:00:00Z', '{"receiving_dock": "B5", "quality_check_passed": true, "shelf_location": "Produce Aisle 7"}'),
-- Keitt Mango (Thailand → Lisbon)
('d3d3d3d3-2222-3333-4444-555555555555', 0, '0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', NULL, 'harvest', 'Tropical Paradise Farms', 'farm', 'Niran Srisawat', POINT(98.9853, 18.7883), 8900.0, 'ambient', NULL, '2025-01-10T06:00:00Z', '{"temperature_c": 28, "humidity_percent": 80, "batch_size_kg": 400}'),
('d3d3d3d3-2222-3333-4444-555555555555', 1, '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6', '0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', 'package', 'Packaging Center Chiang Mai', 'packaging_center', 'Somsak Tan', POINT(98.9800, 18.7900), 8895.0, 'refrigerated', NULL, '2025-01-10T10:00:00Z', '{"package_type": "crate", "weight_kg": 12, "quality_grade": "A"}'),
('d3d3d3d3-2222-3333-4444-555555555555', 2, '0x6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7', '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6', 'distribution', 'Distribution Center Bangkok', 'distribution_center', 'Asia-Europe Logistics', POINT(100.5018, 13.7563), 8800.0, 'refrigerated', 'refrigerated_truck', '2025-01-11T08:00:00Z', '{"vehicle_id": "AE-1236", "temperature_maintained_c": 8, "route": "Thailand → Portugal (via ship)"}'),
('d3d3d3d3-2222-3333-4444-555555555555', 3, '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8', '0x6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7', 'store_arrival', 'Continente - Arroios', 'store', 'Store Team', POINT(-9.1361, 38.7286), 0, 'refrigerated', 'refrigerated_truck', '2025-01-17T06:00:00Z', '{"receiving_dock": "C5", "quality_check_passed": true, "shelf_location": "Produce Aisle 7"}'),
-- Lychee (Thailand → Lisbon)
('e1e1e1e1-2222-3333-4444-555555555555', 0, '0x8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', NULL, 'harvest', 'Tropical Paradise Farms', 'farm', 'Niran Srisawat', POINT(98.9853, 18.7883), 8900.0, 'ambient', NULL, '2025-01-07T05:00:00Z', '{"temperature_c": 28, "humidity_percent": 85, "batch_size_kg": 200}'),
('e1e1e1e1-2222-3333-4444-555555555555', 1, '0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0', '0x8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', 'package', 'Packaging Center Chiang Mai', 'packaging_center', 'Somsak Tan', POINT(98.9800, 18.7900), 8895.0, 'refrigerated', NULL, '2025-01-07T09:00:00Z', '{"package_type": "basket", "weight_kg": 1, "quality_grade": "A"}'),
('e1e1e1e1-2222-3333-4444-555555555555', 2, '0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', '0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0', 'distribution', 'Distribution Center Bangkok', 'distribution_center', 'Asia-Europe Logistics', POINT(100.5018, 13.7563), 8800.0, 'refrigerated', 'refrigerated_truck', '2025-01-08T08:00:00Z', '{"vehicle_id": "AE-1237", "temperature_maintained_c": 4, "route": "Thailand → Portugal (via ship)"}'),
('e1e1e1e1-2222-3333-4444-555555555555', 3, '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2', '0x0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', 'store_arrival', 'Continente - Baixa-Chiado', 'store', 'Store Team', POINT(-9.1414, 38.7108), 0, 'refrigerated', 'refrigerated_truck', '2025-01-14T06:00:00Z', '{"receiving_dock": "B5", "quality_check_passed": true, "shelf_location": "Produce Aisle 8"}'),
-- Dragonfruit (Thailand → Lisbon)
('f1f1f1f1-2222-3333-4444-555555555555', 0, '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', NULL, 'harvest', 'Tropical Paradise Farms', 'farm', 'Niran Srisawat', POINT(98.9853, 18.7883), 8900.0, 'ambient', NULL, '2025-01-06T05:00:00Z', '{"temperature_c": 28, "humidity_percent": 85, "batch_size_kg": 150}'),
('f1f1f1f1-2222-3333-4444-555555555555', 1, '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', 'package', 'Packaging Center Chiang Mai', 'packaging_center', 'Somsak Tan', POINT(98.9800, 18.7900), 8895.0, 'refrigerated', NULL, '2025-01-06T09:00:00Z', '{"package_type": "crate", "weight_kg": 5, "quality_grade": "A"}'),
('f1f1f1f1-2222-3333-4444-555555555555', 2, '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', 'distribution', 'Distribution Center Bangkok', 'distribution_center', 'Asia-Europe Logistics', POINT(100.5018, 13.7563), 8800.0, 'refrigerated', 'refrigerated_truck', '2025-01-07T08:00:00Z', '{"vehicle_id": "AE-1238", "temperature_maintained_c": 6, "route": "Thailand → Portugal (via ship)"}'),
('f1f1f1f1-2222-3333-4444-555555555555', 3, '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', 'store_arrival', 'Continente - Alameda', 'store', 'Store Team', POINT(-9.1333, 38.7350), 0, 'refrigerated', 'refrigerated_truck', '2025-01-13T06:00:00Z', '{"receiving_dock": "A5", "quality_check_passed": true, "shelf_location": "Produce Aisle 8"}');

-- ============================================
-- STEP 9: Add Certification Ledger (All Products)
-- ============================================
INSERT INTO certification_ledger (
  product_id, block_index, block_hash, previous_hash,
  cert_type, certifying_body, certifying_body_code,
  certificate_id, audit_date, expiry_date, auditor_name, audit_findings,
  timestamp
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  0,
  '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  NULL,
  'eu_organic',
  'CERTIPLANET',
  'PT-BIO-09',
  'ORG-2024-78234',
  '2024-03-15',
  '2025-03-15',
  'Dr. Ana Ferreira',
  'All organic requirements met. Soil tests show no prohibited substances. Crop rotation properly documented.',
  '2024-03-15T10:00:00Z'
),
(
  '11111111-2222-3333-4444-555555555555',
  1,
  '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
  '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  'fair_labor',
  'Fair Labor Association',
  'FLA-EU',
  'FLA-2024-PT-1234',
  '2024-06-20',
  '2026-06-20',
  'Carlos Mendez',
  'Workers receive above minimum wage, proper housing provided for seasonal workers, no child labor observed.',
  '2024-06-20T14:30:00Z'
),
(
  '11111111-2222-3333-4444-555555555555',
  2,
  '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
  '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
  'low_carbon',
  'Carbon Trust',
  'CT-2024',
  'CT-VEG-2024-5678',
  '2024-09-10',
  '2025-09-10',
  'Emma van der Berg',
  'Carbon footprint verified at 1.8 kg CO2e/kg, 40% below industry average for imported tomatoes.',
  '2024-09-10T09:00:00Z'
),
-- Cherry Tomatoes
('22222222-3333-4444-5555-666666666666', 0, '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', NULL, 'eu_organic', 'SKAL', 'NL-BIO-01', 'ORG-2024-NL-12345', '2024-04-10', '2025-04-10', 'Jan de Vries', 'Greenhouse organic certification verified. No synthetic inputs used.', '2024-04-10T10:00:00Z'),
-- Roma Tomatoes
('33333333-4444-5555-6666-777777777777', 0, '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b', NULL, 'eu_organic', 'ICEA', 'IT-BIO-006', 'ORG-2024-IT-78901', '2024-05-15', '2025-05-15', 'Giuseppe Bianchi', 'Organic certification for traditional Italian farming methods.', '2024-05-15T11:00:00Z'),
-- Green Asparagus
('a1a1a1a1-2222-3333-4444-555555555555', 0, '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c', NULL, 'eu_organic', 'SKAL', 'NL-BIO-01', 'ORG-2024-NL-23456', '2024-03-20', '2025-03-20', 'Jan de Vries', 'Greenhouse organic certification. Geothermal energy used.', '2024-03-20T09:00:00Z'),
-- White Asparagus
('a2a2a2a2-2222-3333-4444-555555555555', 0, '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d', NULL, 'eu_organic', 'SKAL', 'NL-BIO-01', 'ORG-2024-NL-23457', '2024-03-20', '2025-03-20', 'Jan de Vries', 'Greenhouse organic certification. Geothermal energy used.', '2024-03-20T09:00:00Z'),
-- Purple Asparagus
('a3a3a3a3-2222-3333-4444-555555555555', 0, '0xd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e', NULL, 'eu_organic', 'SKAL', 'NL-BIO-01', 'ORG-2024-NL-23458', '2024-03-20', '2025-03-20', 'Jan de Vries', 'Greenhouse organic certification. Geothermal energy used.', '2024-03-20T09:00:00Z'),
-- Hass Avocado
('b1b1b1b1-2222-3333-4444-555555555555', 0, '0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f', NULL, 'eu_organic', 'CERTIPLANET', 'PT-BIO-09', 'ORG-2024-PT-34567', '2024-06-10', '2025-06-10', 'Dr. Ana Ferreira', 'Organic avocado production verified. Sustainable water management.', '2024-06-10T10:00:00Z'),
-- Fuerte Avocado
('b2b2b2b2-2222-3333-4444-555555555555', 0, '0xf2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a', NULL, 'eu_organic', 'CERTIPLANET', 'PT-BIO-09', 'ORG-2024-PT-34568', '2024-06-10', '2025-06-10', 'Dr. Ana Ferreira', 'Organic avocado production verified. Sustainable water management.', '2024-06-10T10:00:00Z'),
-- Bacon Avocado
('b3b3b3b3-2222-3333-4444-555555555555', 0, '0xa3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b', NULL, 'eu_organic', 'CERTIPLANET', 'PT-BIO-09', 'ORG-2024-PT-34569', '2024-06-10', '2025-06-10', 'Dr. Ana Ferreira', 'Organic avocado production verified. Sustainable water management.', '2024-06-10T10:00:00Z'),
-- Gala Apple
('c1c1c1c1-2222-3333-4444-555555555555', 0, '0xb4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c', NULL, 'eu_organic', 'ICEA', 'IT-BIO-006', 'ORG-2024-IT-89012', '2024-07-05', '2025-07-05', 'Giuseppe Bianchi', 'Organic apple production in volcanic soils. Traditional methods.', '2024-07-05T10:00:00Z'),
-- Granny Smith Apple
('c2c2c2c2-2222-3333-4444-555555555555', 0, '0xc5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d', NULL, 'eu_organic', 'ICEA', 'IT-BIO-006', 'ORG-2024-IT-89013', '2024-07-05', '2025-07-05', 'Giuseppe Bianchi', 'Organic apple production in volcanic soils. Traditional methods.', '2024-07-05T10:00:00Z'),
-- Fuji Apple
('c3c3c3c3-2222-3333-4444-555555555555', 0, '0xd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e', NULL, 'eu_organic', 'ICEA', 'IT-BIO-006', 'ORG-2024-IT-89014', '2024-07-05', '2025-07-05', 'Giuseppe Bianchi', 'Organic apple production in volcanic soils. Traditional methods.', '2024-07-05T10:00:00Z'),
-- Ataulfo Mango
('d1d1d1d1-2222-3333-4444-555555555555', 0, '0xe7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f', NULL, 'fair_trade', 'Fair Trade International', 'FT-ASIA', 'FT-2024-TH-12345', '2024-08-15', '2026-08-15', 'Somsak Tan', 'Fair trade certification ensures fair wages and community support.', '2024-08-15T10:00:00Z'),
('d1d1d1d1-2222-3333-4444-555555555555', 1, '0xf8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a', '0xe7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f', 'organic', 'Organic Thailand', 'TH-ORG-001', 'ORG-2024-TH-56789', '2024-08-20', '2025-08-20', 'Niran Srisawat', 'Organic certification for agroforestry production methods.', '2024-08-20T10:00:00Z'),
-- Tommy Atkins Mango
('d2d2d2d2-2222-3333-4444-555555555555', 0, '0xa9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', NULL, 'fair_trade', 'Fair Trade International', 'FT-ASIA', 'FT-2024-TH-12346', '2024-08-15', '2026-08-15', 'Somsak Tan', 'Fair trade certification ensures fair wages and community support.', '2024-08-15T10:00:00Z'),
('d2d2d2d2-2222-3333-4444-555555555555', 1, '0xb0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', '0xa9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', 'organic', 'Organic Thailand', 'TH-ORG-001', 'ORG-2024-TH-56790', '2024-08-20', '2025-08-20', 'Niran Srisawat', 'Organic certification for agroforestry production methods.', '2024-08-20T10:00:00Z'),
-- Keitt Mango
('d3d3d3d3-2222-3333-4444-555555555555', 0, '0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', NULL, 'fair_trade', 'Fair Trade International', 'FT-ASIA', 'FT-2024-TH-12347', '2024-08-15', '2026-08-15', 'Somsak Tan', 'Fair trade certification ensures fair wages and community support.', '2024-08-15T10:00:00Z'),
('d3d3d3d3-2222-3333-4444-555555555555', 1, '0xd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e', '0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', 'organic', 'Organic Thailand', 'TH-ORG-001', 'ORG-2024-TH-56791', '2024-08-20', '2025-08-20', 'Niran Srisawat', 'Organic certification for agroforestry production methods.', '2024-08-20T10:00:00Z'),
-- Lychee
('e1e1e1e1-2222-3333-4444-555555555555', 0, '0xe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', NULL, 'fair_trade', 'Fair Trade International', 'FT-ASIA', 'FT-2024-TH-12348', '2024-08-15', '2026-08-15', 'Somsak Tan', 'Fair trade certification ensures fair wages and community support.', '2024-08-15T10:00:00Z'),
('e1e1e1e1-2222-3333-4444-555555555555', 1, '0xf4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', '0xe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', 'organic', 'Organic Thailand', 'TH-ORG-001', 'ORG-2024-TH-56792', '2024-08-20', '2025-08-20', 'Niran Srisawat', 'Organic certification for agroforestry production methods.', '2024-08-20T10:00:00Z'),
-- Dragonfruit
('f1f1f1f1-2222-3333-4444-555555555555', 0, '0xa5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b', NULL, 'fair_trade', 'Fair Trade International', 'FT-ASIA', 'FT-2024-TH-12349', '2024-08-15', '2026-08-15', 'Somsak Tan', 'Fair trade certification ensures fair wages and community support.', '2024-08-15T10:00:00Z'),
('f1f1f1f1-2222-3333-4444-555555555555', 1, '0xb6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c', '0xa5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b', 'organic', 'Organic Thailand', 'TH-ORG-001', 'ORG-2024-TH-56793', '2024-08-20', '2025-08-20', 'Niran Srisawat', 'Organic certification for agroforestry production methods.', '2024-08-20T10:00:00Z');

-- ============================================
-- STEP 10: Add Farming Practices (All Farms)
-- ============================================
INSERT INTO farming_practices (farm_id, category, icon_type, practices) VALUES
-- Quinta do Sol (Portugal)
('f1a2b3c4-d5e6-7890-abcd-ef1234567890', 'soil_inputs', 'soil', ARRAY['Organic compost from local sources', 'Natural nitrogen fixation with cover crops', 'No synthetic fertilizers used', 'Regular soil health testing']),
('f1a2b3c4-d5e6-7890-abcd-ef1234567890', 'water_management', 'water', ARRAY['Drip irrigation system', 'Rainwater harvesting', 'Water usage monitoring', '30% water reduction vs. conventional']),
('f1a2b3c4-d5e6-7890-abcd-ef1234567890', 'pest_control', 'bug', ARRAY['Integrated pest management (IPM)', 'Beneficial insect habitats', 'Natural predators encouraged', 'No synthetic pesticides']),
('f1a2b3c4-d5e6-7890-abcd-ef1234567890', 'biodiversity', 'tree', ARRAY['Native hedgerows maintained', 'Pollinator-friendly flower strips', 'Bird nesting boxes installed', 'Wildlife corridors preserved']),
('f1a2b3c4-d5e6-7890-abcd-ef1234567890', 'labor_conditions', 'people', ARRAY['Fair wages above minimum', 'Safe working conditions', 'Worker housing provided', 'Regular training programs']),
-- GreenHouse Westland (Netherlands)
('f2b3c4d5-e6f7-8901-bcde-f23456789012', 'soil_inputs', 'soil', ARRAY['Hydroponic growing medium', 'Nutrient solution recycling', 'No soil contamination risk', 'Precise nutrient control']),
('f2b3c4d5-e6f7-8901-bcde-f23456789012', 'water_management', 'water', ARRAY['Closed-loop water system', '95% water recycling', 'Rainwater collection', 'Zero water waste']),
('f2b3c4d5-e6f7-8901-bcde-f23456789012', 'pest_control', 'bug', ARRAY['Biological pest control', 'Beneficial insects released weekly', 'No pesticides needed', 'Climate-controlled environment']),
('f2b3c4d5-e6f7-8901-bcde-f23456789012', 'biodiversity', 'tree', ARRAY['Native plant borders', 'Bee-friendly areas', 'Wildlife-friendly perimeter', 'Biodiversity corridors']),
('f2b3c4d5-e6f7-8901-bcde-f23456789012', 'labor_conditions', 'people', ARRAY['Above-average wages', 'Modern facilities', 'Safety training programs', 'Year-round employment']),
-- Sole di Campania (Italy)
('f3c4d5e6-f7a8-9012-cdef-034567890123', 'soil_inputs', 'soil', ARRAY['Volcanic soil enrichment', 'Organic matter from local sources', 'Traditional composting', 'Soil testing every season']),
('f3c4d5e6-f7a8-9012-cdef-034567890123', 'water_management', 'water', ARRAY['Traditional irrigation methods', 'Water-efficient systems', 'Spring water source', 'Drought-resistant varieties']),
('f3c4d5e6-f7a8-9012-cdef-034567890123', 'pest_control', 'bug', ARRAY['Traditional companion planting', 'Natural repellents', 'Beneficial insects', 'Organic pest management']),
('f3c4d5e6-f7a8-9012-cdef-034567890123', 'biodiversity', 'tree', ARRAY['Mixed crop planting', 'Native tree preservation', 'Wildflower meadows', 'Bird habitats maintained']),
('f3c4d5e6-f7a8-9012-cdef-034567890123', 'labor_conditions', 'people', ARRAY['Family employment priority', 'Fair seasonal wages', 'Traditional knowledge sharing', 'Community support']),
-- Tropical Paradise Farms (Thailand)
('f4d5e6f7-a8b9-0123-cdef-145678901234', 'soil_inputs', 'soil', ARRAY['Agroforestry practices', 'Natural mulching', 'Compost from farm waste', 'No chemical inputs']),
('f4d5e6f7-a8b9-0123-cdef-145678901234', 'water_management', 'water', ARRAY['Rainwater collection systems', 'Natural water retention', 'Efficient irrigation', 'Water conservation practices']),
('f4d5e6f7-a8b9-0123-cdef-145678901234', 'pest_control', 'bug', ARRAY['Natural pest deterrents', 'Biodiversity-based control', 'Traditional methods', 'Ecosystem balance']),
('f4d5e6f7-a8b9-0123-cdef-145678901234', 'biodiversity', 'tree', ARRAY['Forest integration', 'Native species preservation', 'Wildlife corridors', 'Ecosystem diversity']),
('f4d5e6f7-a8b9-0123-cdef-145678901234', 'labor_conditions', 'people', ARRAY['Fair trade certified', 'Community employment', 'Skills development', 'Cultural preservation']);

-- ============================================
-- STEP 11: Add Farmer Stories (All Farms)
-- ============================================
INSERT INTO farmer_stories (
  farm_id, farmer_name, title, story_content, quote, image_url, years_farming
)
VALUES 
-- Quinta do Sol (Portugal)
(
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'João Silva',
  'Three Generations of Sun-Ripened Tomatoes',
  'João Silva represents the third generation of the Silva family to tend the rich soils of Quinta do Sol in Portugal''s sun-drenched Algarve region. What started as his grandfather''s small vegetable plot in 1962 has grown into a thriving 50-hectare organic farm.

"My grandfather always said the secret to great tomatoes is patience," João explains, walking between rows of vibrant tomato vines. "We let the Algarve sun do its work. No rushing, no shortcuts."

The farm transitioned to fully organic practices in 2008, a decision João describes as "returning to our roots." His commitment to sustainable farming goes beyond certification—it''s a philosophy that touches every aspect of the operation.

"When I look at these tomatoes, I see my father''s hands, my grandfather''s wisdom, and hopefully, my children''s future," João reflects. "Every tomato that leaves this farm carries a piece of our family''s story."',
  'We let the Algarve sun do its work. No rushing, no shortcuts.',
  'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800',
  35
),
-- GreenHouse Westland (Netherlands)
(
  'f2b3c4d5-e6f7-8901-bcde-f23456789012',
  'Pieter van der Berg',
  'Innovation Meets Tradition in Dutch Greenhouses',
  'Pieter van der Berg has been at the forefront of sustainable greenhouse farming for over 25 years. His family''s operation in Westland combines cutting-edge technology with deep respect for nature.

"We use technology not to replace nature, but to work with it," Pieter explains, gesturing to the rows of perfectly tended asparagus. "Our geothermal system means we can grow year-round without burning fossil fuels."

The greenhouse complex represents a new model of agriculture—one that produces more food with less land, less water, and fewer emissions. Pieter''s team of 25 technicians monitors every aspect of plant health using AI-powered sensors, while beneficial insects handle pest control naturally.

"Our goal is to prove that high-tech farming can be truly sustainable," Pieter says. "Every asparagus spear that leaves here represents our commitment to feeding the world without destroying it."',
  'We use technology not to replace nature, but to work with it.',
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
  25
),
-- Sole di Campania (Italy)
(
  'f3c4d5e6-f7a8-9012-cdef-034567890123',
  'Marco Rossi',
  'Volcanic Soil, Family Roots: 60 Years of Italian Excellence',
  'Marco Rossi represents the third generation of his family to farm the fertile volcanic soils of Campania. The Rossi family has been growing San Marzano tomatoes here since 1960, using techniques passed down through generations.

"My nonno taught me that the secret is in the soil," Marco says, holding a handful of the dark, rich earth. "This volcanic soil, blessed by Mount Vesuvius, gives our tomatoes their unique flavor."

The farm has maintained its traditional methods while earning organic certification. Marco works alongside his father and uncle, and his children are already learning the trade. The family celebrates each harvest with traditional festivals, and their farmhouse kitchen is always filled with the aroma of fresh tomatoes being transformed into passata.

"We''re not just growing tomatoes," Marco reflects. "We''re preserving a way of life, a connection to the land that goes back generations. Every tomato carries the taste of our terroir, our history."',
  'This volcanic soil, blessed by Mount Vesuvius, gives our tomatoes their unique flavor.',
  'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=800',
  20
),
-- Tropical Paradise Farms (Thailand)
(
  'f4d5e6f7-a8b9-0123-cdef-145678901234',
  'Niran Srisawat',
  'Agroforestry and Community: Growing Exotic Fruits with Purpose',
  'Niran Srisawat founded Tropical Paradise Farms in 1985 with a vision: to grow exotic fruits sustainably while supporting local communities. Located in the foothills of Doi Suthep, the farm combines traditional Thai agricultural wisdom with modern organic practices.

"Our farm is a living ecosystem," Niran explains, walking through rows of mango trees interspersed with native forest. "We don''t fight nature—we work with it. The trees provide shade, the forest provides biodiversity, and together they create something beautiful."

The farm employs 30 people, including members of local hill tribes who bring generations of knowledge. Niran has worked to preserve traditional varieties while improving yields through sustainable methods. The farm practices agroforestry, using natural mulches and maintaining forest corridors for wildlife.

"When I started, people said I was crazy to grow organically in the mountains," Niran laughs. "But now we''re a model for others. We prove that you can grow beautiful, delicious fruits while protecting the environment and supporting your community."',
  'We don''t fight nature—we work with it.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  40
);

-- ============================================
-- STEP 12: Add Recipes (2 recipes per product)
-- ============================================
INSERT INTO recipes (
  product_id, title, description, cultural_origin,
  prep_time_minutes, cook_time_minutes, servings,
  ingredients, instructions, image_url
)
VALUES
-- Tomatoes (Cluster, Cherry, Roma - can share recipes)
('11111111-2222-3333-4444-555555555555', 'Tomato & Olive Salad (Salada da Horta)', 'A bright Algarve-style salad with ripe tomatoes, briny olives, and herb dressing.', 'Portugal - Algarve', 10, 0, 2, '[{"name": "Tomatoes", "amount": "400g"}, {"name": "Kalamata olives", "amount": "80g"}, {"name": "Red onion", "amount": "1/2 small"}, {"name": "Fresh parsley", "amount": "small handful"}, {"name": "Olive oil", "amount": "3 tbsp"}, {"name": "Red wine vinegar", "amount": "1 tbsp"}, {"name": "Dried oregano", "amount": "1/2 tsp"}, {"name": "Sea salt", "amount": "pinch"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Slice tomatoes into wedges; thinly slice the red onion.', 'Whisk olive oil, red wine vinegar, oregano, salt, and pepper for the dressing.', 'Combine tomatoes, olives, and onion in a bowl. Toss with dressing.', 'Finish with chopped parsley and serve immediately.'], 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),
('11111111-2222-3333-4444-555555555555', 'Classic Gazpacho', 'A refreshing cold soup from Andalusia, perfect for hot summer days.', 'Spain - Andalusia', 20, 0, 4, '[{"name": "Tomatoes", "amount": "1 kg"}, {"name": "Cucumber", "amount": "1 medium"}, {"name": "Red bell pepper", "amount": "1"}, {"name": "Garlic cloves", "amount": "2"}, {"name": "Olive oil", "amount": "4 tbsp"}, {"name": "Sherry vinegar", "amount": "2 tbsp"}, {"name": "Stale bread", "amount": "50g"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Core and roughly chop the tomatoes. Peel and chop the cucumber. Deseed and chop the bell pepper.', 'Soak the stale bread in water for 5 minutes, then squeeze out excess water.', 'Combine all vegetables, garlic, and soaked bread in a blender.', 'Blend until smooth, then add olive oil and sherry vinegar while blending.', 'Season with salt and refrigerate for at least 2 hours before serving.', 'Serve cold, garnished with diced vegetables and a drizzle of olive oil.'], 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800'),
('22222222-3333-4444-5555-666666666666', 'Tomato & Olive Salad (Salada da Horta)', 'A bright Algarve-style salad with ripe tomatoes, briny olives, and herb dressing.', 'Portugal - Algarve', 10, 0, 2, '[{"name": "Cherry tomatoes", "amount": "400g"}, {"name": "Kalamata olives", "amount": "80g"}, {"name": "Red onion", "amount": "1/2 small"}, {"name": "Fresh parsley", "amount": "small handful"}, {"name": "Olive oil", "amount": "3 tbsp"}, {"name": "Red wine vinegar", "amount": "1 tbsp"}, {"name": "Dried oregano", "amount": "1/2 tsp"}, {"name": "Sea salt", "amount": "pinch"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Halve cherry tomatoes; thinly slice the red onion.', 'Whisk olive oil, red wine vinegar, oregano, salt, and pepper for the dressing.', 'Combine tomatoes, olives, and onion in a bowl. Toss with dressing.', 'Finish with chopped parsley and serve immediately.'], 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),
('22222222-3333-4444-5555-666666666666', 'Classic Gazpacho', 'A refreshing cold soup from Andalusia, perfect for hot summer days.', 'Spain - Andalusia', 20, 0, 4, '[{"name": "Cherry tomatoes", "amount": "1 kg"}, {"name": "Cucumber", "amount": "1 medium"}, {"name": "Red bell pepper", "amount": "1"}, {"name": "Garlic cloves", "amount": "2"}, {"name": "Olive oil", "amount": "4 tbsp"}, {"name": "Sherry vinegar", "amount": "2 tbsp"}, {"name": "Stale bread", "amount": "50g"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Core and roughly chop the tomatoes. Peel and chop the cucumber. Deseed and chop the bell pepper.', 'Soak the stale bread in water for 5 minutes, then squeeze out excess water.', 'Combine all vegetables, garlic, and soaked bread in a blender.', 'Blend until smooth, then add olive oil and sherry vinegar while blending.', 'Season with salt and refrigerate for at least 2 hours before serving.', 'Serve cold, garnished with diced vegetables and a drizzle of olive oil.'], 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800'),
('33333333-4444-5555-6666-777777777777', 'Tomato & Olive Salad (Salada da Horta)', 'A bright Algarve-style salad with ripe tomatoes, briny olives, and herb dressing.', 'Portugal - Algarve', 10, 0, 2, '[{"name": "Roma tomatoes", "amount": "400g"}, {"name": "Kalamata olives", "amount": "80g"}, {"name": "Red onion", "amount": "1/2 small"}, {"name": "Fresh parsley", "amount": "small handful"}, {"name": "Olive oil", "amount": "3 tbsp"}, {"name": "Red wine vinegar", "amount": "1 tbsp"}, {"name": "Dried oregano", "amount": "1/2 tsp"}, {"name": "Sea salt", "amount": "pinch"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Slice tomatoes into wedges; thinly slice the red onion.', 'Whisk olive oil, red wine vinegar, oregano, salt, and pepper for the dressing.', 'Combine tomatoes, olives, and onion in a bowl. Toss with dressing.', 'Finish with chopped parsley and serve immediately.'], 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),
('33333333-4444-5555-6666-777777777777', 'Classic Gazpacho', 'A refreshing cold soup from Andalusia, perfect for hot summer days.', 'Spain - Andalusia', 20, 0, 4, '[{"name": "Roma tomatoes", "amount": "1 kg"}, {"name": "Cucumber", "amount": "1 medium"}, {"name": "Red bell pepper", "amount": "1"}, {"name": "Garlic cloves", "amount": "2"}, {"name": "Olive oil", "amount": "4 tbsp"}, {"name": "Sherry vinegar", "amount": "2 tbsp"}, {"name": "Stale bread", "amount": "50g"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Core and roughly chop the tomatoes. Peel and chop the cucumber. Deseed and chop the bell pepper.', 'Soak the stale bread in water for 5 minutes, then squeeze out excess water.', 'Combine all vegetables, garlic, and soaked bread in a blender.', 'Blend until smooth, then add olive oil and sherry vinegar while blending.', 'Season with salt and refrigerate for at least 2 hours before serving.', 'Serve cold, garnished with diced vegetables and a drizzle of olive oil.'], 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800'),
-- Asparagus (Green, White, Purple - can share recipes)
('a1a1a1a1-2222-3333-4444-555555555555', 'Roasted Asparagus with Lemon', 'Simple and elegant, letting the natural flavor of fresh asparagus shine.', 'Mediterranean', 5, 15, 4, '[{"name": "Green asparagus", "amount": "500g"}, {"name": "Olive oil", "amount": "2 tbsp"}, {"name": "Lemon", "amount": "1"}, {"name": "Garlic cloves", "amount": "2"}, {"name": "Sea salt", "amount": "to taste"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Preheat oven to 200°C. Trim the woody ends from asparagus.', 'Toss asparagus with olive oil, minced garlic, salt, and pepper.', 'Arrange in a single layer on a baking sheet.', 'Roast for 12-15 minutes until tender and slightly charred.', 'Squeeze fresh lemon juice over before serving.'], 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800'),
('a1a1a1a1-2222-3333-4444-555555555555', 'Asparagus Risotto', 'Creamy Italian risotto with fresh asparagus, a springtime favorite.', 'Italy', 15, 25, 4, '[{"name": "Green asparagus", "amount": "400g"}, {"name": "Arborio rice", "amount": "300g"}, {"name": "White wine", "amount": "100ml"}, {"name": "Vegetable stock", "amount": "1 liter"}, {"name": "Parmesan cheese", "amount": "50g"}, {"name": "Onion", "amount": "1 small"}, {"name": "Butter", "amount": "2 tbsp"}, {"name": "Olive oil", "amount": "1 tbsp"}]'::jsonb, ARRAY['Cut asparagus tips and set aside. Chop stems into small pieces.', 'Sauté onion in butter and olive oil until translucent.', 'Add rice and stir for 2 minutes. Add wine and let it evaporate.', 'Add hot stock one ladle at a time, stirring constantly.', 'After 15 minutes, add asparagus pieces. Continue adding stock.', 'When rice is creamy and al dente, stir in asparagus tips and parmesan. Serve immediately.'], 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800'),
('a2a2a2a2-2222-3333-4444-555555555555', 'Roasted Asparagus with Lemon', 'Simple and elegant, letting the natural flavor of fresh asparagus shine.', 'Mediterranean', 5, 15, 4, '[{"name": "White asparagus", "amount": "500g"}, {"name": "Olive oil", "amount": "2 tbsp"}, {"name": "Lemon", "amount": "1"}, {"name": "Garlic cloves", "amount": "2"}, {"name": "Sea salt", "amount": "to taste"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Preheat oven to 200°C. Peel white asparagus and trim ends.', 'Toss asparagus with olive oil, minced garlic, salt, and pepper.', 'Arrange in a single layer on a baking sheet.', 'Roast for 12-15 minutes until tender.', 'Squeeze fresh lemon juice over before serving.'], 'https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800'),
('a2a2a2a2-2222-3333-4444-555555555555', 'Asparagus Risotto', 'Creamy Italian risotto with fresh asparagus, a springtime favorite.', 'Italy', 15, 25, 4, '[{"name": "White asparagus", "amount": "400g"}, {"name": "Arborio rice", "amount": "300g"}, {"name": "White wine", "amount": "100ml"}, {"name": "Vegetable stock", "amount": "1 liter"}, {"name": "Parmesan cheese", "amount": "50g"}, {"name": "Onion", "amount": "1 small"}, {"name": "Butter", "amount": "2 tbsp"}, {"name": "Olive oil", "amount": "1 tbsp"}]'::jsonb, ARRAY['Peel and cut asparagus tips and set aside. Chop stems into small pieces.', 'Sauté onion in butter and olive oil until translucent.', 'Add rice and stir for 2 minutes. Add wine and let it evaporate.', 'Add hot stock one ladle at a time, stirring constantly.', 'After 15 minutes, add asparagus pieces. Continue adding stock.', 'When rice is creamy and al dente, stir in asparagus tips and parmesan. Serve immediately.'], 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800'),
('a3a3a3a3-2222-3333-4444-555555555555', 'Roasted Asparagus with Lemon', 'Simple and elegant, letting the natural flavor of fresh asparagus shine.', 'Mediterranean', 5, 15, 4, '[{"name": "Purple asparagus", "amount": "500g"}, {"name": "Olive oil", "amount": "2 tbsp"}, {"name": "Lemon", "amount": "1"}, {"name": "Garlic cloves", "amount": "2"}, {"name": "Sea salt", "amount": "to taste"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Preheat oven to 200°C. Trim the woody ends from asparagus.', 'Toss asparagus with olive oil, minced garlic, salt, and pepper.', 'Arrange in a single layer on a baking sheet.', 'Roast for 10-12 minutes until tender (purple turns green when cooked).', 'Squeeze fresh lemon juice over before serving.'], 'https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800'),
('a3a3a3a3-2222-3333-4444-555555555555', 'Asparagus Risotto', 'Creamy Italian risotto with fresh asparagus, a springtime favorite.', 'Italy', 15, 25, 4, '[{"name": "Purple asparagus", "amount": "400g"}, {"name": "Arborio rice", "amount": "300g"}, {"name": "White wine", "amount": "100ml"}, {"name": "Vegetable stock", "amount": "1 liter"}, {"name": "Parmesan cheese", "amount": "50g"}, {"name": "Onion", "amount": "1 small"}, {"name": "Butter", "amount": "2 tbsp"}, {"name": "Olive oil", "amount": "1 tbsp"}]'::jsonb, ARRAY['Cut asparagus tips and set aside. Chop stems into small pieces.', 'Sauté onion in butter and olive oil until translucent.', 'Add rice and stir for 2 minutes. Add wine and let it evaporate.', 'Add hot stock one ladle at a time, stirring constantly.', 'After 15 minutes, add asparagus pieces. Continue adding stock.', 'When rice is creamy and al dente, stir in asparagus tips and parmesan. Serve immediately.'], 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800'),
-- Avocados (Hass, Fuerte, Bacon - can share recipes)
('b1b1b1b1-2222-3333-4444-555555555555', 'Classic Guacamole', 'The perfect dip for chips, tacos, or as a side dish.', 'Mexico', 10, 0, 4, '[{"name": "Hass avocados", "amount": "3 ripe"}, {"name": "Lime", "amount": "1"}, {"name": "Red onion", "amount": "1/4 small"}, {"name": "Tomato", "amount": "1 small"}, {"name": "Cilantro", "amount": "2 tbsp"}, {"name": "Jalapeño", "amount": "1/2"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Cut avocados in half, remove pit, and scoop flesh into a bowl.', 'Mash with a fork, leaving some chunks for texture.', 'Add finely diced red onion, tomato, and jalapeño.', 'Stir in chopped cilantro and lime juice.', 'Season with salt to taste. Serve immediately.'], 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800'),
('b1b1b1b1-2222-3333-4444-555555555555', 'Avocado Toast', 'Simple, healthy, and delicious breakfast or snack.', 'International', 5, 0, 2, '[{"name": "Hass avocados", "amount": "2 ripe"}, {"name": "Sourdough bread", "amount": "4 slices"}, {"name": "Lemon", "amount": "1/2"}, {"name": "Red pepper flakes", "amount": "pinch"}, {"name": "Sea salt", "amount": "to taste"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Toast bread until golden and crispy.', 'Cut avocados in half, remove pit, and scoop flesh.', 'Mash avocado with lemon juice, salt, and pepper.', 'Spread generously on toast.', 'Sprinkle with red pepper flakes and serve immediately.'], 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800'),
('b2b2b2b2-2222-3333-4444-555555555555', 'Classic Guacamole', 'The perfect dip for chips, tacos, or as a side dish.', 'Mexico', 10, 0, 4, '[{"name": "Fuerte avocados", "amount": "3 ripe"}, {"name": "Lime", "amount": "1"}, {"name": "Red onion", "amount": "1/4 small"}, {"name": "Tomato", "amount": "1 small"}, {"name": "Cilantro", "amount": "2 tbsp"}, {"name": "Jalapeño", "amount": "1/2"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Cut avocados in half, remove pit, and scoop flesh into a bowl.', 'Mash with a fork, leaving some chunks for texture.', 'Add finely diced red onion, tomato, and jalapeño.', 'Stir in chopped cilantro and lime juice.', 'Season with salt to taste. Serve immediately.'], 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800'),
('b2b2b2b2-2222-3333-4444-555555555555', 'Avocado Toast', 'Simple, healthy, and delicious breakfast or snack.', 'International', 5, 0, 2, '[{"name": "Fuerte avocados", "amount": "2 ripe"}, {"name": "Sourdough bread", "amount": "4 slices"}, {"name": "Lemon", "amount": "1/2"}, {"name": "Red pepper flakes", "amount": "pinch"}, {"name": "Sea salt", "amount": "to taste"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Toast bread until golden and crispy.', 'Cut avocados in half, remove pit, and scoop flesh.', 'Mash avocado with lemon juice, salt, and pepper.', 'Spread generously on toast.', 'Sprinkle with red pepper flakes and serve immediately.'], 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800'),
('b3b3b3b3-2222-3333-4444-555555555555', 'Classic Guacamole', 'The perfect dip for chips, tacos, or as a side dish.', 'Mexico', 10, 0, 4, '[{"name": "Bacon avocados", "amount": "3 ripe"}, {"name": "Lime", "amount": "1"}, {"name": "Red onion", "amount": "1/4 small"}, {"name": "Tomato", "amount": "1 small"}, {"name": "Cilantro", "amount": "2 tbsp"}, {"name": "Jalapeño", "amount": "1/2"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Cut avocados in half, remove pit, and scoop flesh into a bowl.', 'Mash with a fork, leaving some chunks for texture.', 'Add finely diced red onion, tomato, and jalapeño.', 'Stir in chopped cilantro and lime juice.', 'Season with salt to taste. Serve immediately.'], 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800'),
('b3b3b3b3-2222-3333-4444-555555555555', 'Avocado Toast', 'Simple, healthy, and delicious breakfast or snack.', 'International', 5, 0, 2, '[{"name": "Bacon avocados", "amount": "2 ripe"}, {"name": "Sourdough bread", "amount": "4 slices"}, {"name": "Lemon", "amount": "1/2"}, {"name": "Red pepper flakes", "amount": "pinch"}, {"name": "Sea salt", "amount": "to taste"}, {"name": "Black pepper", "amount": "to taste"}]'::jsonb, ARRAY['Toast bread until golden and crispy.', 'Cut avocados in half, remove pit, and scoop flesh.', 'Mash avocado with lemon juice, salt, and pepper.', 'Spread generously on toast.', 'Sprinkle with red pepper flakes and serve immediately.'], 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800'),
-- Apples (Gala, Granny Smith, Fuji - can share recipes)
('c1c1c1c1-2222-3333-4444-555555555555', 'Apple Crumble', 'Classic comfort dessert with sweet, spiced apples and crispy topping.', 'United Kingdom', 20, 40, 6, '[{"name": "Gala apples", "amount": "1 kg"}, {"name": "Flour", "amount": "150g"}, {"name": "Butter", "amount": "100g"}, {"name": "Brown sugar", "amount": "100g"}, {"name": "Cinnamon", "amount": "1 tsp"}, {"name": "Lemon", "amount": "1/2"}]'::jsonb, ARRAY['Preheat oven to 180°C. Peel, core, and slice apples.', 'Toss apples with lemon juice, cinnamon, and half the sugar.', 'Place in a baking dish.', 'Rub butter into flour and remaining sugar to make crumble.', 'Sprinkle crumble over apples and bake for 40 minutes until golden.'], 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'),
('c1c1c1c1-2222-3333-4444-555555555555', 'Apple Salad with Walnuts', 'Fresh, crisp apple salad with walnuts and a light vinaigrette.', 'International', 15, 0, 4, '[{"name": "Gala apples", "amount": "3 medium"}, {"name": "Mixed greens", "amount": "200g"}, {"name": "Walnuts", "amount": "50g"}, {"name": "Feta cheese", "amount": "100g"}, {"name": "Olive oil", "amount": "3 tbsp"}, {"name": "Apple cider vinegar", "amount": "1 tbsp"}, {"name": "Honey", "amount": "1 tsp"}]'::jsonb, ARRAY['Core and slice apples into thin wedges.', 'Toast walnuts in a dry pan until fragrant.', 'Whisk olive oil, vinegar, and honey for dressing.', 'Toss greens with dressing, then add apples, walnuts, and crumbled feta.', 'Serve immediately.'], 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'),
('c2c2c2c2-2222-3333-4444-555555555555', 'Apple Crumble', 'Classic comfort dessert with sweet, spiced apples and crispy topping.', 'United Kingdom', 20, 40, 6, '[{"name": "Granny Smith apples", "amount": "1 kg"}, {"name": "Flour", "amount": "150g"}, {"name": "Butter", "amount": "100g"}, {"name": "Brown sugar", "amount": "120g"}, {"name": "Cinnamon", "amount": "1 tsp"}, {"name": "Lemon", "amount": "1/2"}]'::jsonb, ARRAY['Preheat oven to 180°C. Peel, core, and slice apples.', 'Toss apples with lemon juice, cinnamon, and half the sugar.', 'Place in a baking dish.', 'Rub butter into flour and remaining sugar to make crumble.', 'Sprinkle crumble over apples and bake for 40 minutes until golden.'], 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'),
('c2c2c2c2-2222-3333-4444-555555555555', 'Apple Salad with Walnuts', 'Fresh, crisp apple salad with walnuts and a light vinaigrette.', 'International', 15, 0, 4, '[{"name": "Granny Smith apples", "amount": "3 medium"}, {"name": "Mixed greens", "amount": "200g"}, {"name": "Walnuts", "amount": "50g"}, {"name": "Feta cheese", "amount": "100g"}, {"name": "Olive oil", "amount": "3 tbsp"}, {"name": "Apple cider vinegar", "amount": "1 tbsp"}, {"name": "Honey", "amount": "1 tsp"}]'::jsonb, ARRAY['Core and slice apples into thin wedges.', 'Toast walnuts in a dry pan until fragrant.', 'Whisk olive oil, vinegar, and honey for dressing.', 'Toss greens with dressing, then add apples, walnuts, and crumbled feta.', 'Serve immediately.'], 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'),
('c3c3c3c3-2222-3333-4444-555555555555', 'Apple Crumble', 'Classic comfort dessert with sweet, spiced apples and crispy topping.', 'United Kingdom', 20, 40, 6, '[{"name": "Fuji apples", "amount": "1 kg"}, {"name": "Flour", "amount": "150g"}, {"name": "Butter", "amount": "100g"}, {"name": "Brown sugar", "amount": "100g"}, {"name": "Cinnamon", "amount": "1 tsp"}, {"name": "Lemon", "amount": "1/2"}]'::jsonb, ARRAY['Preheat oven to 180°C. Peel, core, and slice apples.', 'Toss apples with lemon juice, cinnamon, and half the sugar.', 'Place in a baking dish.', 'Rub butter into flour and remaining sugar to make crumble.', 'Sprinkle crumble over apples and bake for 40 minutes until golden.'], 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'),
('c3c3c3c3-2222-3333-4444-555555555555', 'Apple Salad with Walnuts', 'Fresh, crisp apple salad with walnuts and a light vinaigrette.', 'International', 15, 0, 4, '[{"name": "Fuji apples", "amount": "3 medium"}, {"name": "Mixed greens", "amount": "200g"}, {"name": "Walnuts", "amount": "50g"}, {"name": "Feta cheese", "amount": "100g"}, {"name": "Olive oil", "amount": "3 tbsp"}, {"name": "Apple cider vinegar", "amount": "1 tbsp"}, {"name": "Honey", "amount": "1 tsp"}]'::jsonb, ARRAY['Core and slice apples into thin wedges.', 'Toast walnuts in a dry pan until fragrant.', 'Whisk olive oil, vinegar, and honey for dressing.', 'Toss greens with dressing, then add apples, walnuts, and crumbled feta.', 'Serve immediately.'], 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'),
-- Mangoes (Ataulfo, Tommy Atkins, Keitt - can share recipes)
('d1d1d1d1-2222-3333-4444-555555555555', 'Mango Sticky Rice', 'Traditional Thai dessert with sweet sticky rice and fresh mango.', 'Thailand', 30, 20, 4, '[{"name": "Ataulfo mangoes", "amount": "2 ripe"}, {"name": "Sticky rice", "amount": "200g"}, {"name": "Coconut milk", "amount": "400ml"}, {"name": "Sugar", "amount": "3 tbsp"}, {"name": "Salt", "amount": "pinch"}]'::jsonb, ARRAY['Soak sticky rice overnight. Steam for 20 minutes until tender.', 'Heat coconut milk with sugar and salt until sugar dissolves.', 'Pour half over hot rice and let it absorb.', 'Slice mangoes and arrange on plates.', 'Serve rice with mango and drizzle remaining coconut milk.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
('d1d1d1d1-2222-3333-4444-555555555555', 'Mango Salsa', 'Fresh, tropical salsa perfect for fish, chicken, or chips.', 'International', 15, 0, 4, '[{"name": "Ataulfo mangoes", "amount": "2 ripe"}, {"name": "Red onion", "amount": "1/4 small"}, {"name": "Red bell pepper", "amount": "1/2"}, {"name": "Cilantro", "amount": "2 tbsp"}, {"name": "Lime", "amount": "1"}, {"name": "Jalapeño", "amount": "1/2"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Dice mango, onion, and bell pepper into small pieces.', 'Finely chop cilantro and jalapeño.', 'Combine all ingredients in a bowl.', 'Add lime juice and salt to taste.', 'Let sit for 10 minutes before serving.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
('d2d2d2d2-2222-3333-4444-555555555555', 'Mango Sticky Rice', 'Traditional Thai dessert with sweet sticky rice and fresh mango.', 'Thailand', 30, 20, 4, '[{"name": "Tommy Atkins mangoes", "amount": "2 ripe"}, {"name": "Sticky rice", "amount": "200g"}, {"name": "Coconut milk", "amount": "400ml"}, {"name": "Sugar", "amount": "3 tbsp"}, {"name": "Salt", "amount": "pinch"}]'::jsonb, ARRAY['Soak sticky rice overnight. Steam for 20 minutes until tender.', 'Heat coconut milk with sugar and salt until sugar dissolves.', 'Pour half over hot rice and let it absorb.', 'Slice mangoes and arrange on plates.', 'Serve rice with mango and drizzle remaining coconut milk.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
('d2d2d2d2-2222-3333-4444-555555555555', 'Mango Salsa', 'Fresh, tropical salsa perfect for fish, chicken, or chips.', 'International', 15, 0, 4, '[{"name": "Tommy Atkins mangoes", "amount": "2 ripe"}, {"name": "Red onion", "amount": "1/4 small"}, {"name": "Red bell pepper", "amount": "1/2"}, {"name": "Cilantro", "amount": "2 tbsp"}, {"name": "Lime", "amount": "1"}, {"name": "Jalapeño", "amount": "1/2"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Dice mango, onion, and bell pepper into small pieces.', 'Finely chop cilantro and jalapeño.', 'Combine all ingredients in a bowl.', 'Add lime juice and salt to taste.', 'Let sit for 10 minutes before serving.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
('d3d3d3d3-2222-3333-4444-555555555555', 'Mango Sticky Rice', 'Traditional Thai dessert with sweet sticky rice and fresh mango.', 'Thailand', 30, 20, 4, '[{"name": "Keitt mangoes", "amount": "2 ripe"}, {"name": "Sticky rice", "amount": "200g"}, {"name": "Coconut milk", "amount": "400ml"}, {"name": "Sugar", "amount": "3 tbsp"}, {"name": "Salt", "amount": "pinch"}]'::jsonb, ARRAY['Soak sticky rice overnight. Steam for 20 minutes until tender.', 'Heat coconut milk with sugar and salt until sugar dissolves.', 'Pour half over hot rice and let it absorb.', 'Slice mangoes and arrange on plates.', 'Serve rice with mango and drizzle remaining coconut milk.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
('d3d3d3d3-2222-3333-4444-555555555555', 'Mango Salsa', 'Fresh, tropical salsa perfect for fish, chicken, or chips.', 'International', 15, 0, 4, '[{"name": "Keitt mangoes", "amount": "2 ripe"}, {"name": "Red onion", "amount": "1/4 small"}, {"name": "Red bell pepper", "amount": "1/2"}, {"name": "Cilantro", "amount": "2 tbsp"}, {"name": "Lime", "amount": "1"}, {"name": "Jalapeño", "amount": "1/2"}, {"name": "Salt", "amount": "to taste"}]'::jsonb, ARRAY['Dice mango, onion, and bell pepper into small pieces.', 'Finely chop cilantro and jalapeño.', 'Combine all ingredients in a bowl.', 'Add lime juice and salt to taste.', 'Let sit for 10 minutes before serving.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
-- Lychee
('e1e1e1e1-2222-3333-4444-555555555555', 'Lychee Sorbet', 'Refreshing, light sorbet showcasing the delicate flavor of lychee.', 'International', 15, 0, 4, '[{"name": "Lychees", "amount": "500g"}, {"name": "Sugar", "amount": "100g"}, {"name": "Water", "amount": "100ml"}, {"name": "Lime juice", "amount": "1 tbsp"}]'::jsonb, ARRAY['Peel and pit lychees. Blend until smooth.', 'Heat water and sugar until sugar dissolves. Let cool.', 'Mix lychee puree with syrup and lime juice.', 'Churn in ice cream maker according to instructions.', 'Freeze for at least 4 hours before serving.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
('e1e1e1e1-2222-3333-4444-555555555555', 'Lychee & Mint Salad', 'Fresh fruit salad with lychee, mint, and a hint of lime.', 'International', 10, 0, 4, '[{"name": "Lychees", "amount": "400g"}, {"name": "Fresh mint", "amount": "handful"}, {"name": "Lime", "amount": "1"}, {"name": "Honey", "amount": "1 tsp"}, {"name": "Pomegranate seeds", "amount": "optional"}]'::jsonb, ARRAY['Peel and pit lychees. Cut in half if large.', 'Chiffonade mint leaves.', 'Whisk lime juice and honey together.', 'Combine lychees and mint in a bowl.', 'Drizzle with lime-honey dressing and garnish with pomegranate if using.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800'),
-- Dragonfruit
('f1f1f1f1-2222-3333-4444-555555555555', 'Dragonfruit Smoothie Bowl', 'Vibrant, healthy breakfast bowl with dragonfruit and tropical fruits.', 'International', 10, 0, 2, '[{"name": "Dragonfruit", "amount": "1 large"}, {"name": "Banana", "amount": "1"}, {"name": "Coconut milk", "amount": "100ml"}, {"name": "Mango", "amount": "1/2"}, {"name": "Granola", "amount": "50g"}, {"name": "Chia seeds", "amount": "1 tbsp"}]'::jsonb, ARRAY['Blend dragonfruit, banana, and coconut milk until smooth.', 'Pour into bowls and top with diced mango.', 'Sprinkle with granola and chia seeds.', 'Serve immediately while cold.'], 'https://minimalistbaker.com/wp-content/uploads/2018/04/DELICIOUS-Dragon-Fruit-Smoothie-Bowls-5-minutes-5-ingredients-1-blender-RICH-in-vitamins-and-minerals-vegan-glutenfree-smoothie-recipe-dragonfruit-12.jpg'),
('f1f1f1f1-2222-3333-4444-555555555555', 'Dragonfruit Salad', 'Colorful fruit salad with dragonfruit, berries, and a light dressing.', 'International', 15, 0, 4, '[{"name": "Dragonfruit", "amount": "2 medium"}, {"name": "Mixed berries", "amount": "200g"}, {"name": "Kiwi", "amount": "2"}, {"name": "Lime", "amount": "1"}, {"name": "Honey", "amount": "1 tbsp"}, {"name": "Mint", "amount": "few leaves"}]'::jsonb, ARRAY['Cut dragonfruit in half and scoop out flesh. Dice into cubes.', 'Slice kiwi and combine with berries and dragonfruit.', 'Whisk lime juice and honey for dressing.', 'Toss fruits with dressing.', 'Garnish with mint leaves and serve chilled.'], 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800');

-- ============================================
-- STEP 13: Add Sustainability Metrics (All Products)
-- ============================================
INSERT INTO sustainability_metrics (
  product_id, co2e_per_kg, water_usage_l_per_kg, land_use_m2_per_kg, energy_kwh_per_kg, notes
)
VALUES
-- Tomatoes
('11111111-2222-3333-4444-555555555555', 1.8, 214, 0.26, 0.8, '40% below industry average for imported tomatoes'),
('22222222-3333-4444-5555-666666666666', 0.9, 180, 0.15, 0.5, 'Local greenhouse production reduces transport emissions'),
('33333333-4444-5555-6666-777777777777', 2.1, 220, 0.28, 0.9, 'Traditional Italian farming methods, slightly higher transport'),
-- Asparagus
('a1a1a1a1-2222-3333-4444-555555555555', 0.8, 150, 0.12, 0.4, 'Efficient greenhouse production with geothermal energy'),
('a2a2a2a2-2222-3333-4444-555555555555', 0.8, 150, 0.12, 0.4, 'Efficient greenhouse production with geothermal energy'),
('a3a3a3a3-2222-3333-4444-555555555555', 0.8, 150, 0.12, 0.4, 'Efficient greenhouse production with geothermal energy'),
-- Avocados
('b1b1b1b1-2222-3333-4444-555555555555', 1.2, 1981, 2.5, 1.2, 'Local Portuguese production, lower transport emissions'),
('b2b2b2b2-2222-3333-4444-555555555555', 1.2, 1981, 2.5, 1.2, 'Local Portuguese production, lower transport emissions'),
('b3b3b3b3-2222-3333-4444-555555555555', 1.2, 1981, 2.5, 1.2, 'Local Portuguese production, lower transport emissions'),
-- Apples
('c1c1c1c1-2222-3333-4444-555555555555', 0.6, 822, 0.7, 0.3, 'Italian organic production, efficient storage'),
('c2c2c2c2-2222-3333-4444-555555555555', 0.6, 822, 0.7, 0.3, 'Italian organic production, efficient storage'),
('c3c3c3c3-2222-3333-4444-555555555555', 0.6, 822, 0.7, 0.3, 'Italian organic production, efficient storage'),
-- Mangoes
('d1d1d1d1-2222-3333-4444-555555555555', 3.2, 1800, 1.2, 1.5, 'Long-distance transport from Thailand, but organic and fair trade'),
('d2d2d2d2-2222-3333-4444-555555555555', 3.2, 1800, 1.2, 1.5, 'Long-distance transport from Thailand, but organic and fair trade'),
('d3d3d3d3-2222-3333-4444-555555555555', 3.2, 1800, 1.2, 1.5, 'Long-distance transport from Thailand, but organic and fair trade'),
-- Lychee
('e1e1e1e1-2222-3333-4444-555555555555', 3.5, 1600, 1.0, 1.8, 'Exotic fruit from Thailand, fair trade certified'),
-- Dragonfruit
('f1f1f1f1-2222-3333-4444-555555555555', 3.8, 1700, 1.1, 2.0, 'Exotic fruit from Thailand, agroforestry production');

-- ============================================
-- STEP 14: Add Alternative Products
-- ============================================
INSERT INTO alternative_products (product_id, alternative_id, reason, sort_order) VALUES
-- Tomatoes: all tomatoes are alternatives to each other
('11111111-2222-3333-4444-555555555555', '22222222-3333-4444-5555-666666666666', 'Lower carbon footprint, local', 1),
('11111111-2222-3333-4444-555555555555', '33333333-4444-5555-6666-777777777777', 'Great for cooking', 2),
('22222222-3333-4444-5555-666666666666', '11111111-2222-3333-4444-555555555555', 'Organic Portuguese variety', 1),
('22222222-3333-4444-5555-666666666666', '33333333-4444-5555-6666-777777777777', 'Great for cooking', 2),
('33333333-4444-5555-6666-777777777777', '11111111-2222-3333-4444-555555555555', 'Organic Portuguese variety', 1),
('33333333-4444-5555-6666-777777777777', '22222222-3333-4444-5555-666666666666', 'Lower carbon footprint, local', 2),
-- Asparagus: all asparagus are alternatives to each other
('a1a1a1a1-2222-3333-4444-555555555555', 'a2a2a2a2-2222-3333-4444-555555555555', 'Premium white variety', 1),
('a1a1a1a1-2222-3333-4444-555555555555', 'a3a3a3a3-2222-3333-4444-555555555555', 'Rare purple variety', 2),
('a2a2a2a2-2222-3333-4444-555555555555', 'a1a1a1a1-2222-3333-4444-555555555555', 'Classic green variety', 1),
('a2a2a2a2-2222-3333-4444-555555555555', 'a3a3a3a3-2222-3333-4444-555555555555', 'Rare purple variety', 2),
('a3a3a3a3-2222-3333-4444-555555555555', 'a1a1a1a1-2222-3333-4444-555555555555', 'Classic green variety', 1),
('a3a3a3a3-2222-3333-4444-555555555555', 'a2a2a2a2-2222-3333-4444-555555555555', 'Premium white variety', 2),
-- Avocados: all avocados are alternatives to each other
('b1b1b1b1-2222-3333-4444-555555555555', 'b2b2b2b2-2222-3333-4444-555555555555', 'Fuerte variety, creamier texture', 1),
('b1b1b1b1-2222-3333-4444-555555555555', 'b3b3b3b3-2222-3333-4444-555555555555', 'Bacon variety, lighter flavor', 2),
('b2b2b2b2-2222-3333-4444-555555555555', 'b1b1b1b1-2222-3333-4444-555555555555', 'Hass variety, rich and nutty', 1),
('b2b2b2b2-2222-3333-4444-555555555555', 'b3b3b3b3-2222-3333-4444-555555555555', 'Bacon variety, lighter flavor', 2),
('b3b3b3b3-2222-3333-4444-555555555555', 'b1b1b1b1-2222-3333-4444-555555555555', 'Hass variety, rich and nutty', 1),
('b3b3b3b3-2222-3333-4444-555555555555', 'b2b2b2b2-2222-3333-4444-555555555555', 'Fuerte variety, creamier texture', 2),
-- Apples: all apples are alternatives to each other
('c1c1c1c1-2222-3333-4444-555555555555', 'c2c2c2c2-2222-3333-4444-555555555555', 'Granny Smith, tart and crisp', 1),
('c1c1c1c1-2222-3333-4444-555555555555', 'c3c3c3c3-2222-3333-4444-555555555555', 'Fuji, sweet and juicy', 2),
('c2c2c2c2-2222-3333-4444-555555555555', 'c1c1c1c1-2222-3333-4444-555555555555', 'Gala, sweet and crisp', 1),
('c2c2c2c2-2222-3333-4444-555555555555', 'c3c3c3c3-2222-3333-4444-555555555555', 'Fuji, sweet and juicy', 2),
('c3c3c3c3-2222-3333-4444-555555555555', 'c1c1c1c1-2222-3333-4444-555555555555', 'Gala, sweet and crisp', 1),
('c3c3c3c3-2222-3333-4444-555555555555', 'c2c2c2c2-2222-3333-4444-555555555555', 'Granny Smith, tart and crisp', 2),
-- Mangoes: all mangoes are alternatives to each other
('d1d1d1d1-2222-3333-4444-555555555555', 'd2d2d2d2-2222-3333-4444-555555555555', 'Tommy Atkins, larger and firmer', 1),
('d1d1d1d1-2222-3333-4444-555555555555', 'd3d3d3d3-2222-3333-4444-555555555555', 'Keitt, late season variety', 2),
('d2d2d2d2-2222-3333-4444-555555555555', 'd1d1d1d1-2222-3333-4444-555555555555', 'Ataulfo, sweet and buttery', 1),
('d2d2d2d2-2222-3333-4444-555555555555', 'd3d3d3d3-2222-3333-4444-555555555555', 'Keitt, late season variety', 2),
('d3d3d3d3-2222-3333-4444-555555555555', 'd1d1d1d1-2222-3333-4444-555555555555', 'Ataulfo, sweet and buttery', 1),
('d3d3d3d3-2222-3333-4444-555555555555', 'd2d2d2d2-2222-3333-4444-555555555555', 'Tommy Atkins, larger and firmer', 2),
-- Lychee and Dragonfruit: alternatives to each other
('e1e1e1e1-2222-3333-4444-555555555555', 'f1f1f1f1-2222-3333-4444-555555555555', 'Exotic tropical fruit alternative', 1),
('f1f1f1f1-2222-3333-4444-555555555555', 'e1e1e1e1-2222-3333-4444-555555555555', 'Exotic tropical fruit alternative', 1);

-- ============================================
-- END OF SEED DATA
-- ============================================

-- .