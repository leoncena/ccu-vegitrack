-- Migration: Update shelf life descriptions based on percentage
-- This updates the description field for shelf_life indicators based on their percentage value
-- Uses approximate descriptions like "~1 day remaining" for 10%, etc.

-- First, let's see the current state (for reference)
/*
SELECT 
  p.name as product_name,
  qi.percentage,
  qi.shelf_life_remaining_days,
  qi.description as current_description
FROM quality_indicators qi
INNER JOIN products p ON qi.product_id = p.id
WHERE qi.indicator_type = 'shelf_life'
ORDER BY qi.percentage;
*/

-- Update descriptions based on percentage
-- Assuming 15 days = 100%, so we calculate approximate days from percentage
UPDATE quality_indicators
SET description = CASE
  -- Calculate approximate days: (percentage / 100) * 15, rounded
  -- Then format as description
  WHEN percentage IS NULL OR percentage = 0 THEN '0 days remaining'
  WHEN percentage <= 6.67 THEN '~1 day remaining'      -- ~0-1 days (0-6.67%)
  WHEN percentage <= 13.33 THEN '~2 days remaining'   -- ~1-2 days (6.67-13.33%)
  WHEN percentage <= 20.00 THEN '~3 days remaining'     -- ~2-3 days (13.33-20%)
  WHEN percentage <= 26.67 THEN '~4 days remaining'     -- ~3-4 days (20-26.67%)
  WHEN percentage <= 33.33 THEN '~5 days remaining'    -- ~4-5 days (26.67-33.33%)
  WHEN percentage <= 40.00 THEN '~6 days remaining'     -- ~5-6 days (33.33-40%)
  WHEN percentage <= 46.67 THEN '~7 days remaining'     -- ~6-7 days (40-46.67%)
  WHEN percentage <= 53.33 THEN '~8 days remaining'    -- ~7-8 days (46.67-53.33%)
  WHEN percentage <= 60.00 THEN '~9 days remaining'    -- ~8-9 days (53.33-60%)
  WHEN percentage <= 66.67 THEN '~10 days remaining'   -- ~9-10 days (60-66.67%)
  WHEN percentage <= 73.33 THEN '~11 days remaining'  -- ~10-11 days (66.67-73.33%)
  WHEN percentage <= 80.00 THEN '~12 days remaining'   -- ~11-12 days (73.33-80%)
  WHEN percentage <= 86.67 THEN '~13 days remaining'  -- ~12-13 days (80-86.67%)
  WHEN percentage <= 93.33 THEN '~14 days remaining'  -- ~13-14 days (86.67-93.33%)
  WHEN percentage <= 100.00 THEN '~15 days remaining' -- ~14-15 days (93.33-100%)
  ELSE '~15+ days remaining'                           -- Over 100% (shouldn't happen, but just in case)
END
WHERE indicator_type = 'shelf_life'
  AND (description IS NULL OR description != CASE
    WHEN percentage IS NULL OR percentage = 0 THEN '0 days remaining'
    WHEN percentage <= 6.67 THEN '~1 day remaining'
    WHEN percentage <= 13.33 THEN '~2 days remaining'
    WHEN percentage <= 20.00 THEN '~3 days remaining'
    WHEN percentage <= 26.67 THEN '~4 days remaining'
    WHEN percentage <= 33.33 THEN '~5 days remaining'
    WHEN percentage <= 40.00 THEN '~6 days remaining'
    WHEN percentage <= 46.67 THEN '~7 days remaining'
    WHEN percentage <= 53.33 THEN '~8 days remaining'
    WHEN percentage <= 60.00 THEN '~9 days remaining'
    WHEN percentage <= 66.67 THEN '~10 days remaining'
    WHEN percentage <= 73.33 THEN '~11 days remaining'
    WHEN percentage <= 80.00 THEN '~12 days remaining'
    WHEN percentage <= 86.67 THEN '~13 days remaining'
    WHEN percentage <= 93.33 THEN '~14 days remaining'
    WHEN percentage <= 100.00 THEN '~15 days remaining'
    ELSE '~15+ days remaining'
  END);

-- Verify the results
SELECT 
  p.name as product_name,
  qi.percentage,
  qi.shelf_life_remaining_days,
  qi.description as updated_description,
  -- Show calculated approximate days for reference
  ROUND((qi.percentage / 100.0) * 15, 0) as calculated_days
FROM quality_indicators qi
INNER JOIN products p ON qi.product_id = p.id
WHERE qi.indicator_type = 'shelf_life'
ORDER BY qi.percentage;

