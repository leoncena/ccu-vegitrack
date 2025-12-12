-- ============================================
-- Migration: Add RLS Policies for Product Management
-- Run this to allow producers to create/update/delete their own products
-- ============================================

-- Allow authenticated users to insert products (they will be linked via producer_products after creation)
-- UPDATE and DELETE policies below ensure only owners can modify/delete their products
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow producers to update products they own
CREATE POLICY "Producers can update own products" ON products
  FOR UPDATE TO authenticated
  USING (
    id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to delete products they own
CREATE POLICY "Producers can delete own products" ON products
  FOR DELETE TO authenticated
  USING (
    id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to insert product labels
CREATE POLICY "Producers can insert product labels" ON product_labels
  FOR INSERT TO authenticated
  WITH CHECK (
    product_id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to update/delete product labels
CREATE POLICY "Producers can manage product labels" ON product_labels
  FOR ALL TO authenticated
  USING (
    product_id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to manage quality indicators
CREATE POLICY "Producers can manage quality indicators" ON quality_indicators
  FOR ALL TO authenticated
  USING (
    product_id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to manage certifications
CREATE POLICY "Producers can manage certifications" ON certification_ledger
  FOR ALL TO authenticated
  USING (
    product_id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to manage recipes
CREATE POLICY "Producers can manage recipes" ON recipes
  FOR ALL TO authenticated
  USING (
    product_id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to manage sustainability metrics
CREATE POLICY "Producers can manage sustainability metrics" ON sustainability_metrics
  FOR ALL TO authenticated
  USING (
    product_id IN (
      SELECT product_id 
      FROM producer_products 
      WHERE producer_id IN (
        SELECT id FROM producer_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Allow producers to manage farms (they should be able to update farms they use)
CREATE POLICY "Producers can update farms" ON farms
  FOR UPDATE TO authenticated
  USING (
    id IN (
      SELECT DISTINCT farm_id 
      FROM products 
      WHERE id IN (
        SELECT product_id 
        FROM producer_products 
        WHERE producer_id IN (
          SELECT id FROM producer_profiles WHERE user_id = auth.uid()
        )
      )
      AND farm_id IS NOT NULL
    )
  );

-- Allow producers to create new farms
CREATE POLICY "Producers can create farms" ON farms
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow producers to manage farmer stories
CREATE POLICY "Producers can manage farmer stories" ON farmer_stories
  FOR ALL TO authenticated
  USING (
    farm_id IN (
      SELECT DISTINCT farm_id 
      FROM products 
      WHERE id IN (
        SELECT product_id 
        FROM producer_products 
        WHERE producer_id IN (
          SELECT id FROM producer_profiles WHERE user_id = auth.uid()
        )
      )
      AND farm_id IS NOT NULL
    )
  );

-- Allow producers to manage farming practices
CREATE POLICY "Producers can manage farming practices" ON farming_practices
  FOR ALL TO authenticated
  USING (
    farm_id IN (
      SELECT DISTINCT farm_id 
      FROM products 
      WHERE id IN (
        SELECT product_id 
        FROM producer_products 
        WHERE producer_id IN (
          SELECT id FROM producer_profiles WHERE user_id = auth.uid()
        )
      )
      AND farm_id IS NOT NULL
    )
  );

