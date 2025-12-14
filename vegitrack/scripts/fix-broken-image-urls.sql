-- SQL query to find all recipes with broken image URLs
-- These are the recipes that need their image_url updated

-- List all broken recipe image URLs with product information
SELECT 
  r.id as recipe_id,
  r.title as recipe_title,
  r.image_url as broken_image_url,
  p.id as product_id,
  p.display_id as product_display_id,
  p.name as product_name
FROM recipes r
LEFT JOIN products p ON r.product_id = p.id
WHERE r.image_url IN (
  'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800',
  'https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800'
)
ORDER BY p.name, r.title;

-- To update a specific recipe's image URL, use:
-- UPDATE recipes 
-- SET image_url = 'NEW_VALID_URL_HERE'
-- WHERE id = 'RECIPE_ID_HERE';

-- Example: Update all Lychee & Mint Salad recipes
-- UPDATE recipes 
-- SET image_url = 'https://images.unsplash.com/photo-NEW_VALID_ID?w=800'
-- WHERE title = 'Lychee & Mint Salad' AND image_url = 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800';

-- Example: Update all Mango Salsa recipes
-- UPDATE recipes 
-- SET image_url = 'https://images.unsplash.com/photo-NEW_VALID_ID?w=800'
-- WHERE title = 'Mango Salsa' AND image_url = 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800';

-- Example: Update all Mango Sticky Rice recipes
-- UPDATE recipes 
-- SET image_url = 'https://images.unsplash.com/photo-NEW_VALID_ID?w=800'
-- WHERE title = 'Mango Sticky Rice' AND image_url = 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800';

-- Example: Update all Roasted Asparagus with Lemon recipes (with broken URL)
-- UPDATE recipes 
-- SET image_url = 'https://images.unsplash.com/photo-NEW_VALID_ID?w=800'
-- WHERE title = 'Roasted Asparagus with Lemon' AND image_url = 'https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800';
