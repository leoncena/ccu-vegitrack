-- Migration: Add shelf life indicators for products that don't have them
-- This adds shelf_life quality indicators with random 1-15 days remaining
-- Progress bar: 0 days = 0%, 15+ days = 100%

-- First, let's see which products don't have shelf_life indicators
-- (This is just for reference, you can run this separately to check)
/*
SELECT 
  p.id,
  p.name,
  p.display_id,
  COUNT(qi.id) FILTER (WHERE qi.indicator_type = 'shelf_life') as shelf_life_count
FROM products p
LEFT JOIN quality_indicators qi ON p.id = qi.product_id AND qi.indicator_type = 'shelf_life'
GROUP BY p.id, p.name, p.display_id
HAVING COUNT(qi.id) FILTER (WHERE qi.indicator_type = 'shelf_life') = 0
ORDER BY p.name;
*/

-- Insert shelf_life indicators for products that don't have them
-- Using random() to generate 1-15 days, and calculating percentage (0 days = 0%, 15+ days = 100%)
INSERT INTO quality_indicators (
  product_id,
  indicator_type,
  score,
  max_score,
  percentage,
  description,
  shelf_life_remaining_days
)
SELECT 
  p.id as product_id,
  'shelf_life' as indicator_type,
  NULL as score,
  NULL as max_score,
  -- Calculate percentage: (days / 15) * 100, capped at 100
  -- 0 days = 0%, 15 days = 100%
  LEAST(100, ROUND((days_remaining::DECIMAL / 15) * 100, 2)) as percentage,
  -- Description based on days
  CASE 
    WHEN days_remaining = 1 THEN '1 day remaining'
    WHEN days_remaining <= 3 THEN days_remaining || ' days remaining'
    WHEN days_remaining <= 7 THEN '~' || days_remaining || ' days remaining'
    ELSE '~' || days_remaining || ' days remaining'
  END as description,
  days_remaining as shelf_life_remaining_days
FROM products p
CROSS JOIN LATERAL (
  SELECT FLOOR(RANDOM() * 15 + 1)::INTEGER as days_remaining
) days
WHERE NOT EXISTS (
  SELECT 1 
  FROM quality_indicators qi 
  WHERE qi.product_id = p.id 
  AND qi.indicator_type = 'shelf_life'
);

-- Verify the results
SELECT 
  p.name,
  p.display_id,
  qi.shelf_life_remaining_days,
  qi.percentage,
  qi.description
FROM products p
INNER JOIN quality_indicators qi ON p.id = qi.product_id
WHERE qi.indicator_type = 'shelf_life'
ORDER BY p.name, qi.created_at DESC;
