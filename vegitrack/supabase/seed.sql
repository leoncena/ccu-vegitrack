-- VegiTrack Seed Data
-- Run this AFTER schema.sql to populate sample data

-- ============================================
-- Store: My Auchan - Largo da Graça
-- Plus code: PVM6+XX Lisbon
-- ============================================
INSERT INTO stores (id, name, address, coordinates, distance_m)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'My Auchan - Largo do Leão',
  'Largo do Leão 268, 1000-268 Lisboa, Portugal',
  POINT(-9.0815, 38.4406), -- lon, lat 38°44'06.0"N 9°08'15.3"W
  200
);

-- ============================================
-- Store: Continente Bom Dia - Av. Defensores Chaves 9A, Av. Praia da Vitória 7 a, 1000-245 Lisboa
-- Plus code: PVM4+CW Lisbon
-- ===========================================
INSERT INTO stores (id, name, address, coordinates, distance_m)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'Continente Bom Dia - Av. Defensores Chaves 9A',
  'Av. Praia da Vitória 7 a, 1000-245 Lisboa, Portugal',
  POINT(-9.0833, 38.4401), -- lon, lat 38°44'00.3"N 9°08'33.2"W
  500
);

-- ============================================
-- Store: Pingo Doce - Av. Rovisco Pais 1, 1049-001 Lisboa
-- Plus code: PVP6+R2 Lisbon
-- ===========================================
INSERT INTO stores (id, name, address, coordinates, distance_m)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-034567890123',
  'Pingo Doce - Av. Rovisco Pais 1',
  'Av. Rovisco Pais 1, 1049-001 Lisboa, Portugal',
  POINT(-9.1500, 38.7369), -- lon, lat
  50
);


-- ============================================
-- Farm: Quinta do Sol
-- ============================================
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, description)
VALUES (
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'Quinta do Sol',
  'Estrada Nacional 125, Algarve',
  'Algarve',
  'Portugal',
  POINT(-7.5370, 37.1342), -- lon, lat
  230.0,
  'A family-owned organic farm in the sunny Algarve region of Portugal, specializing in tomatoes and citrus fruits. The farm has been practicing sustainable agriculture for over 30 years.'
);

-- ============================================
-- Farm: GreenHouse Westland (for Cherry Tomatoes)
-- ============================================
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, description)
VALUES (
  'f2b3c4d5-e6f7-8901-bcde-f23456789012',
  'GreenHouse Westland',
  'Middel Broekweg 29, Naaldwijk',
  'Westland',
  'Netherlands',
  POINT(4.2056, 51.9943), -- lon, lat
  65.0,
  'High-tech sustainable greenhouse complex in the heart of the Netherlands. Using geothermal energy and advanced hydroponics for year-round production.'
);

-- ============================================
-- Farm: Sole di Campania (for Roma Tomatoes)
-- ============================================
INSERT INTO farms (id, name, full_address, region, country, coordinates, distance_km, description)
VALUES (
  'f3c4d5e6-f7a8-9012-cdef-034567890123',
  'Sole di Campania',
  'Via Domitiana, Castel Volturno',
  'Campania',
  'Italy',
  POINT(14.0595, 40.9459), -- lon, lat
  1450.0,
  'Traditional Italian farm located in the fertile volcanic soils of Campania. Famous for San Marzano tomatoes grown under the Mediterranean sun.'
);

-- ============================================
-- Product: Cluster Tomatoes
-- ============================================
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
  '2025-11-18',
  2.99,
  1842.5,
  1.8,
  'https://static.tegut.com/fileadmin/_processed_/5/c/csm_Tomate_Header_2_01_f1bde0a618.jpg',
  'VT-3345667'
);

-- QR code linkage for Cluster Tomatoes
INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-3345667', '11111111-2222-3333-4444-555555555555', NULL, true);

-- ============================================
-- Product Labels
-- ============================================
INSERT INTO product_labels (product_id, label_name, label_color, icon_type) VALUES
('11111111-2222-3333-4444-555555555555', 'Organic', '#4CAF50', 'leaf'),
('11111111-2222-3333-4444-555555555555', 'Pesticide-Free', '#8BC34A', 'shield'),
('11111111-2222-3333-4444-555555555555', 'Low Carbon', '#03A9F4', 'eco'),
('11111111-2222-3333-4444-555555555555', 'Fair Trade', '#FF9800', 'handshake');

-- ============================================
-- Quality Indicators
-- ============================================
INSERT INTO quality_indicators (product_id, indicator_type, score, max_score, percentage, description, recommendation) VALUES
('11111111-2222-3333-4444-555555555555', 'freshness', 4, 5, NULL, 'Harvested 3 days ago', 'Best consumed within 5 days'),
('11111111-2222-3333-4444-555555555555', 'ripeness', 4, 5, NULL, 'Perfectly ripe', 'Ready to eat today'),
('11111111-2222-3333-4444-555555555555', 'shelf_life', NULL, NULL, 80, '~5 days remaining', 'Store at room temperature');

-- ============================================
-- Supply Chain Ledger (VegiChain - 4 blocks)
-- ============================================

-- Block 0: Harvest at farm
INSERT INTO supply_chain_ledger (
  product_id, block_index, block_hash, previous_hash,
  event_type, location_name, location_type, actor_name,
  coordinates, distance_from_store_km, storage_type, timestamp, details
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
  '2025-11-18T06:30:00Z',
  '{"temperature_c": 18, "humidity_percent": 65, "batch_size_kg": 500}'
);

-- Block 1: Packaging
INSERT INTO supply_chain_ledger (
  product_id, block_index, block_hash, previous_hash,
  event_type, location_name, location_type, actor_name,
  coordinates, distance_from_store_km, storage_type, timestamp, details
)
VALUES (
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
  '2025-11-18T10:15:00Z',
  '{"package_type": "cluster_tray", "weight_kg": 0.5, "quality_grade": "A"}'
);

-- Block 2: Distribution
INSERT INTO supply_chain_ledger (
  product_id, block_index, block_hash, previous_hash,
  event_type, location_name, location_type, actor_name,
  coordinates, distance_from_store_km, storage_type, transport_method, timestamp, details
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  2,
  '0x9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d',
  '0x2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c',
  'distribution',
  'Distribution Center',
  'distribution_center',
  'TransEuro Logistics',
  POINT(-8.6291, 37.1390), -- Portimão/Lagos area
  80.0,
  'refrigerated',
  'refrigerated_truck',
  '2025-11-20T14:30:00Z',
  '{"vehicle_id": "TE-7823", "temperature_maintained_c": 4, "route": "Algarve → Lisbon"}'
);

-- Block 3: Store arrival
INSERT INTO supply_chain_ledger (
  product_id, block_index, block_hash, previous_hash,
  event_type, location_name, location_type, actor_name,
  coordinates, distance_from_store_km, storage_type, transport_method, timestamp, details
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  3,
  '0x4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f',
  '0x9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d',
  'store_arrival',
  'My Auchan - Largo da Graça',
  'store',
  'Store Team',
  POINT(-9.1304, 38.7162),
  0,
  'refrigerated',
  'refrigerated_truck',
  '2025-11-21T05:45:00Z',
  '{"receiving_dock": "B2", "quality_check_passed": true, "shelf_location": "Produce Aisle 3"}'
);

-- ============================================
-- Certification Ledger (VegiChain - 3 certifications)
-- ============================================

-- Certification 1: EU Organic
INSERT INTO certification_ledger (
  product_id, block_index, block_hash, previous_hash,
  cert_type, cert_display_name, certifying_body, certifying_body_code,
  certificate_id, audit_date, expiry_date, auditor_name, audit_findings,
  description, timestamp
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  0,
  '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  NULL,
  'eu_organic',
  'EU Organic',
  'CERTIPLANET',
  'PT-BIO-09',
  'ORG-2024-78234',
  '2024-03-15',
  '2025-03-15',
  'Dr. Ana Ferreira',
  'All organic requirements met. Soil tests show no prohibited substances. Crop rotation properly documented.',
  'Certified organic production following EU Regulation 2018/848. No synthetic pesticides, herbicides, or GMOs used.',
  '2024-03-15T10:00:00Z'
);

-- Certification 2: Fair Labor
INSERT INTO certification_ledger (
  product_id, block_index, block_hash, previous_hash,
  cert_type, cert_display_name, certifying_body, certifying_body_code,
  certificate_id, audit_date, expiry_date, auditor_name, audit_findings,
  description, timestamp
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  1,
  '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
  '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  'fair_labor',
  'Fair Labor Certified',
  'Fair Labor Association',
  'FLA-EU',
  'FLA-2024-PT-1234',
  '2024-06-20',
  '2026-06-20',
  'Carlos Mendez',
  'Workers receive above minimum wage, proper housing provided for seasonal workers, no child labor observed.',
  'Ensures fair wages, safe working conditions, and respect for workers'' rights throughout the supply chain.',
  '2024-06-20T14:30:00Z'
);

-- Certification 3: Low Carbon
INSERT INTO certification_ledger (
  product_id, block_index, block_hash, previous_hash,
  cert_type, cert_display_name, certifying_body, certifying_body_code,
  certificate_id, audit_date, expiry_date, auditor_name, audit_findings,
  description, timestamp
)
VALUES (
  '11111111-2222-3333-4444-555555555555',
  2,
  '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
  '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
  'low_carbon',
  'Carbon Trust Certified',
  'Carbon Trust',
  'CT-2024',
  'CT-VEG-2024-5678',
  '2024-09-10',
  '2025-09-10',
  'Emma van der Berg',
  'Carbon footprint verified at 1.8 kg CO2e/kg, 40% below industry average for imported tomatoes.',
  'Verified low carbon footprint through efficient farming practices, renewable energy use, and optimized logistics.',
  '2024-09-10T09:00:00Z'
);

-- ============================================
-- Farming Practices
-- ============================================
INSERT INTO farming_practices (farm_id, category, category_display_name, icon_type, practices) VALUES
(
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'soil_inputs',
  'Soil & Inputs',
  'soil',
  ARRAY['Organic compost from local sources', 'Natural nitrogen fixation with cover crops', 'No synthetic fertilizers used', 'Regular soil health testing']
),
(
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'water_management',
  'Water Management',
  'water',
  ARRAY['Drip irrigation system', 'Rainwater harvesting', 'Water usage monitoring', '30% water reduction vs. conventional']
),
(
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'pest_control',
  'Pest Control',
  'bug',
  ARRAY['Integrated pest management (IPM)', 'Beneficial insect habitats', 'Natural predators encouraged', 'No synthetic pesticides']
),
(
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'biodiversity',
  'Biodiversity',
  'tree',
  ARRAY['Native hedgerows maintained', 'Pollinator-friendly flower strips', 'Bird nesting boxes installed', 'Wildlife corridors preserved']
),
(
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'labor_conditions',
  'Labor Conditions',
  'people',
  ARRAY['Fair wages above minimum', 'Safe working conditions', 'Worker housing provided', 'Regular training programs']
);

-- ============================================
-- Farmer Story
-- ============================================
INSERT INTO farmer_stories (
  farm_id, farmer_name, title, story_content, quote, image_url, years_farming
)
VALUES (
  'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  'João Silva',
  'Three Generations of Sun-Ripened Tomatoes',
  'João Silva represents the third generation of the Silva family to tend the rich soils of Quinta da Ria in Portugal''s sun-drenched Algarve region. What started as his grandfather''s small vegetable plot in 1962 has grown into a thriving 50-hectare organic farm.

"My grandfather always said the secret to great tomatoes is patience," João explains, walking between rows of vibrant tomato vines. "We let the Algarve sun do its work. No rushing, no shortcuts."

The farm transitioned to fully organic practices in 2008, a decision João describes as "returning to our roots." His commitment to sustainable farming goes beyond certification—it''s a philosophy that touches every aspect of the operation.

"When I look at these tomatoes, I see my father''s hands, my grandfather''s wisdom, and hopefully, my children''s future," João reflects. "Every tomato that leaves this farm carries a piece of our family''s story."',
  'We let the Algarve sun do its work. No rushing, no shortcuts.',
  'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800',
  35
);

-- ============================================
-- Recipes
-- ============================================
INSERT INTO recipes (
  product_id, title, description, cultural_origin,
  prep_time_minutes, cook_time_minutes, servings,
  ingredients, instructions, image_url
)
VALUES
(
  '11111111-2222-3333-4444-555555555555',
  'Tomato & Olive Salad (Salada da Horta)',
  'A bright Algarve-style salad with ripe tomatoes, briny olives, and herb dressing.',
  'Portugal - Algarve',
  10,
  0,
  2,
  '[
    {"name": "Cluster tomatoes", "amount": "400g"},
    {"name": "Kalamata olives", "amount": "80g"},
    {"name": "Red onion", "amount": "1/2 small"},
    {"name": "Fresh parsley", "amount": "small handful"},
    {"name": "Olive oil", "amount": "3 tbsp"},
    {"name": "Red wine vinegar", "amount": "1 tbsp"},
    {"name": "Dried oregano", "amount": "1/2 tsp"},
    {"name": "Sea salt", "amount": "pinch"},
    {"name": "Black pepper", "amount": "to taste"}
  ]'::jsonb,
  ARRAY[
    'Slice tomatoes into wedges; thinly slice the red onion.',
    'Whisk olive oil, red wine vinegar, oregano, salt, and pepper for the dressing.',
    'Combine tomatoes, olives, and onion in a bowl. Toss with dressing.',
    'Finish with chopped parsley and serve immediately.'
  ],
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
),
(
  '11111111-2222-3333-4444-555555555555',
  'Classic Gazpacho',
  'A refreshing cold soup from Andalusia, perfect for hot summer days. This traditional recipe lets the natural sweetness of ripe tomatoes shine.',
  'Spain - Andalusia',
  20,
  0,
  4,
  '[
    {"name": "Cluster tomatoes", "amount": "1 kg"},
    {"name": "Cucumber", "amount": "1 medium"},
    {"name": "Red bell pepper", "amount": "1"},
    {"name": "Garlic cloves", "amount": "2"},
    {"name": "Olive oil", "amount": "4 tbsp"},
    {"name": "Sherry vinegar", "amount": "2 tbsp"},
    {"name": "Stale bread", "amount": "50g"},
    {"name": "Salt", "amount": "to taste"}
  ]'::jsonb,
  ARRAY[
    'Core and roughly chop the tomatoes. Peel and chop the cucumber. Deseed and chop the bell pepper.',
    'Soak the stale bread in water for 5 minutes, then squeeze out excess water.',
    'Combine all vegetables, garlic, and soaked bread in a blender.',
    'Blend until smooth, then add olive oil and sherry vinegar while blending.',
    'Season with salt and refrigerate for at least 2 hours before serving.',
    'Serve cold, garnished with diced vegetables and a drizzle of olive oil.'
  ],
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800'
),
(
  '11111111-2222-3333-4444-555555555555',
  'Portuguese Tomato Rice',
  'Arroz de Tomate is a beloved Portuguese comfort food. Simple ingredients transform into something magical when made with perfectly ripe tomatoes.',
  'Portugal',
  10,
  25,
  4,
  '[
    {"name": "Cluster tomatoes", "amount": "500g"},
    {"name": "Rice", "amount": "300g"},
    {"name": "Onion", "amount": "1 medium"},
    {"name": "Garlic cloves", "amount": "3"},
    {"name": "Olive oil", "amount": "3 tbsp"},
    {"name": "Bay leaf", "amount": "1"},
    {"name": "Chicken or vegetable stock", "amount": "600ml"},
    {"name": "Salt and pepper", "amount": "to taste"},
    {"name": "Fresh parsley", "amount": "for garnish"}
  ]'::jsonb,
  ARRAY[
    'Grate the tomatoes or blend them briefly, discarding the skins.',
    'Sauté diced onion in olive oil until translucent. Add minced garlic.',
    'Add the grated tomatoes and bay leaf. Cook for 10 minutes until reduced.',
    'Stir in the rice to coat with the tomato mixture.',
    'Add warm stock, season with salt and pepper. Simmer covered for 18-20 minutes.',
    'Let rest for 5 minutes. Fluff with a fork and garnish with fresh parsley.'
  ],
  'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800'
),
(
  '11111111-2222-3333-4444-555555555555',
  'Bruschetta al Pomodoro',
  'The quintessential Italian appetizer showcasing fresh tomatoes at their best. Simple, elegant, and absolutely delicious.',
  'Italy',
  15,
  5,
  6,
  '[
    {"name": "Cluster tomatoes", "amount": "400g"},
    {"name": "Crusty bread", "amount": "1 baguette"},
    {"name": "Fresh basil", "amount": "handful"},
    {"name": "Garlic cloves", "amount": "2"},
    {"name": "Extra virgin olive oil", "amount": "4 tbsp"},
    {"name": "Balsamic glaze", "amount": "optional"},
    {"name": "Flaky sea salt", "amount": "to taste"}
  ]'::jsonb,
  ARRAY[
    'Dice the tomatoes finely. Chiffonade the basil leaves.',
    'Mix tomatoes with 2 tbsp olive oil, half the basil, and a pinch of salt. Let marinate 10 minutes.',
    'Slice bread into 1cm thick rounds. Brush with remaining olive oil.',
    'Grill or toast bread until golden and crispy.',
    'Rub warm bread with a cut garlic clove.',
    'Top with tomato mixture, remaining basil, and finish with flaky salt and optional balsamic glaze.'
  ],
  'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800'
);

-- ============================================
-- Alternative Products (additional tomatoes)
-- ============================================

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
  '2025-11-20',
  4.49,
  65,
  0.9,
  'https://foodbutlers.de/wp-content/uploads/2020/12/Food-Butlers-Tomate-980x634.jpg',
  'VT-3345668'
);

-- QR code linkage for Cherry Tomatoes
INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-3345668', '22222222-3333-4444-5555-666666666666', NULL, true);

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
  '2025-11-17',
  3.29,
  1450,
  2.1,
  'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800',
  'VT-3345669'
);

-- QR code linkage for Roma Tomatoes
INSERT INTO qr_codes (qr_code_id, product_id, batch_number, is_active)
VALUES ('QR-3345669', '33333333-4444-5555-6666-777777777777', NULL, true);

-- Link alternatives
INSERT INTO alternative_products (product_id, alternative_id, reason, sort_order) VALUES
('11111111-2222-3333-4444-555555555555', '22222222-3333-4444-5555-666666666666', 'Lower carbon footprint, local', 1),
('11111111-2222-3333-4444-555555555555', '33333333-4444-5555-6666-777777777777', 'Great for cooking', 2);

-- Add labels to alternatives
INSERT INTO product_labels (product_id, label_name, label_color, icon_type) VALUES
('22222222-3333-4444-5555-666666666666', 'Local', '#2196F3', 'location'),
('22222222-3333-4444-5555-666666666666', 'Greenhouse', '#9C27B0', 'home'),
('33333333-4444-5555-6666-777777777777', 'Organic', '#4CAF50', 'leaf'),
('33333333-4444-5555-6666-777777777777', 'Premium', '#FFD700', 'star');

-- ============================================
-- Producer Profile and Demo Farm for Test User
-- User: leon.cena@tum.de (UUID: 48e20a60-7047-4708-8523-30b6f3bfe427)
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

