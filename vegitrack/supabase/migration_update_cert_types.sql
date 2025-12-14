-- Migration: Update cert_type values to proper display names
-- This updates certification_ledger.cert_type from snake_case to proper names

UPDATE certification_ledger
SET cert_type = CASE
  WHEN cert_type = 'eu_organic' THEN 'EU Organic'
  WHEN cert_type = 'fair_labor' THEN 'Fair Labor'
  WHEN cert_type = 'low_carbon' THEN 'Low Carbon'
  WHEN cert_type = 'local' THEN 'Local'
  ELSE cert_type  -- Keep existing value if it doesn't match any case
END
WHERE cert_type IN ('eu_organic', 'fair_labor', 'low_carbon', 'local');

-- Verify the update
SELECT DISTINCT cert_type FROM certification_ledger ORDER BY cert_type;
