-- Migration: Update shelf_life indicators to have more variation
-- Currently most have 93.33% (14 days), this will create a better distribution
-- Progress bar: 0 days = 0%, 15+ days = 100%

WITH numbered_indicators AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY id) % 15 as row_mod
  FROM quality_indicators
  WHERE indicator_type = 'shelf_life'
)
UPDATE quality_indicators qi
SET 
  shelf_life_remaining_days = CASE 
    -- Create variation based on row number to ensure varied distribution
    WHEN ni.row_mod = 0 THEN 1   -- 6.67%
    WHEN ni.row_mod = 1 THEN 3   -- 20.00%
    WHEN ni.row_mod = 2 THEN 5   -- 33.33%
    WHEN ni.row_mod = 3 THEN 6   -- 40.00%
    WHEN ni.row_mod = 4 THEN 7   -- 46.67%
    WHEN ni.row_mod = 5 THEN 8   -- 53.33%
    WHEN ni.row_mod = 6 THEN 9   -- 60.00%
    WHEN ni.row_mod = 7 THEN 10  -- 66.67%
    WHEN ni.row_mod = 8 THEN 11  -- 73.33%
    WHEN ni.row_mod = 9 THEN 12  -- 80.00%
    WHEN ni.row_mod = 10 THEN 13 -- 86.67%
    WHEN ni.row_mod = 11 THEN 14 -- 93.33%
    WHEN ni.row_mod = 12 THEN 15 -- 100.00%
    WHEN ni.row_mod = 13 THEN 4  -- 26.67%
    ELSE 2  -- 13.33% (row_mod = 14)
  END,
  percentage = CASE 
    WHEN ni.row_mod = 0 THEN 6.67   -- 1 day
    WHEN ni.row_mod = 1 THEN 20.00  -- 3 days
    WHEN ni.row_mod = 2 THEN 33.33  -- 5 days
    WHEN ni.row_mod = 3 THEN 40.00  -- 6 days
    WHEN ni.row_mod = 4 THEN 46.67  -- 7 days
    WHEN ni.row_mod = 5 THEN 53.33  -- 8 days
    WHEN ni.row_mod = 6 THEN 60.00  -- 9 days
    WHEN ni.row_mod = 7 THEN 66.67  -- 10 days
    WHEN ni.row_mod = 8 THEN 73.33  -- 11 days
    WHEN ni.row_mod = 9 THEN 80.00  -- 12 days
    WHEN ni.row_mod = 10 THEN 86.67 -- 13 days
    WHEN ni.row_mod = 11 THEN 93.33 -- 14 days
    WHEN ni.row_mod = 12 THEN 100.00 -- 15 days
    WHEN ni.row_mod = 13 THEN 26.67  -- 4 days
    ELSE 13.33  -- 2 days (row_mod = 14)
  END,
  description = CASE 
    WHEN ni.row_mod = 0 THEN '1 day remaining'
    WHEN ni.row_mod = 1 THEN '3 days remaining'
    WHEN ni.row_mod = 2 THEN '~5 days remaining'
    WHEN ni.row_mod = 3 THEN '~6 days remaining'
    WHEN ni.row_mod = 4 THEN '~7 days remaining'
    WHEN ni.row_mod = 5 THEN '~8 days remaining'
    WHEN ni.row_mod = 6 THEN '~9 days remaining'
    WHEN ni.row_mod = 7 THEN '~10 days remaining'
    WHEN ni.row_mod = 8 THEN '~11 days remaining'
    WHEN ni.row_mod = 9 THEN '~12 days remaining'
    WHEN ni.row_mod = 10 THEN '~13 days remaining'
    WHEN ni.row_mod = 11 THEN '~14 days remaining'
    WHEN ni.row_mod = 12 THEN '~15 days remaining'
    WHEN ni.row_mod = 13 THEN '~4 days remaining'
    ELSE '2 days remaining'  -- row_mod = 14
  END
FROM numbered_indicators ni
WHERE qi.id = ni.id
  AND qi.indicator_type = 'shelf_life';

-- Verify the results
SELECT 
  shelf_life_remaining_days,
  percentage,
  COUNT(*) as count
FROM quality_indicators
WHERE indicator_type = 'shelf_life'
GROUP BY shelf_life_remaining_days, percentage
ORDER BY shelf_life_remaining_days DESC;

-- Show distribution summary
SELECT 
  percentage,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage_of_total
FROM quality_indicators
WHERE indicator_type = 'shelf_life'
GROUP BY percentage
ORDER BY percentage DESC;
