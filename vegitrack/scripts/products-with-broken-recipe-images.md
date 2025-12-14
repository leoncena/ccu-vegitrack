# Products with Broken Recipe Images

This list shows which products have recipes with broken image URLs. You can use this to update the recipe images.

## Summary
- **Total products affected:** 5
- **Total broken recipes:** 10

---

## 1. Ataulfo Mango (MAN001)
**Product ID:** `d1d1d1d1-2222-3333-4444-555555555555`

**Broken Recipes:**
- **Mango Salsa** (Recipe ID: `dbcfdbae-d7d0-48c2-b376-34a1a9a498d9`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

- **Mango Sticky Rice** (Recipe ID: `264cdb41-cefe-4cb9-8a64-25dc81001f0a`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

---

## 2. Keitt Mango (MAN003)
**Product ID:** `d3d3d3d3-2222-3333-4444-555555555555`

**Broken Recipes:**
- **Mango Salsa** (Recipe ID: `d7a48786-80c4-49b6-a84e-1785ca908078`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

- **Mango Sticky Rice** (Recipe ID: `dd3a4ec5-71f4-45f2-9307-9c8198c0e5a7`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

---

## 3. Lychee (LYC001)
**Product ID:** `e1e1e1e1-2222-3333-4444-555555555555`

**Broken Recipes:**
- **Lychee & Mint Salad** (Recipe ID: `1c286ddd-505b-4b01-8874-8fcc6c4dce96`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

- **Lychee Sorbet** (Recipe ID: `0ff23c07-c7c0-459a-b2b3-2d2e0035b7ff`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

---

## 4. Purple Asparagus (ASP003)
**Product ID:** `a3a3a3a3-2222-3333-4444-555555555555`

**Broken Recipes:**
- **Roasted Asparagus with Lemon** (Recipe ID: `50ba08d8-11ce-4b9e-b2d6-7bc26668349a`)
  - Broken URL: `https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800`

---

## 5. Tommy Atkins Mango (MAN002)
**Product ID:** `d2d2d2d2-2222-3333-4444-555555555555`

**Broken Recipes:**
- **Mango Salsa** (Recipe ID: `8deccbe7-05ae-4ba6-b7ca-00bac0f7f1e2`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

- **Mango Sticky Rice** (Recipe ID: `661bc68d-5e00-41cf-8dc6-2b54fe539c96`)
  - Broken URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`

---

## 6. White Asparagus (ASP002)
**Product ID:** `a2a2a2a2-2222-3333-4444-555555555555`

**Broken Recipes:**
- **Roasted Asparagus with Lemon** (Recipe ID: `fd22c051-bc61-46e3-b2ae-e2ff21af4010`)
  - Broken URL: `https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800`

---

## Quick Reference by Product Name

1. **Ataulfo Mango** - 2 broken recipes
2. **Keitt Mango** - 2 broken recipes
3. **Lychee** - 2 broken recipes
4. **Purple Asparagus** - 1 broken recipe
5. **Tommy Atkins Mango** - 2 broken recipes
6. **White Asparagus** - 1 broken recipe

## SQL to Update Recipe Images

After you have new image URLs, you can use these SQL commands to update them:

```sql
-- Update Mango Salsa recipes
UPDATE recipes 
SET image_url = 'NEW_VALID_URL_HERE'
WHERE title = 'Mango Salsa' 
  AND image_url = 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800';

-- Update Mango Sticky Rice recipes
UPDATE recipes 
SET image_url = 'NEW_VALID_URL_HERE'
WHERE title = 'Mango Sticky Rice' 
  AND image_url = 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800';

-- Update Lychee & Mint Salad
UPDATE recipes 
SET image_url = 'NEW_VALID_URL_HERE'
WHERE title = 'Lychee & Mint Salad' 
  AND image_url = 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800';

-- Update Lychee Sorbet
UPDATE recipes 
SET image_url = 'NEW_VALID_URL_HERE'
WHERE title = 'Lychee Sorbet' 
  AND image_url = 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800';

-- Update Roasted Asparagus with Lemon (broken URL variant)
UPDATE recipes 
SET image_url = 'NEW_VALID_URL_HERE'
WHERE title = 'Roasted Asparagus with Lemon' 
  AND image_url = 'https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800';
```
