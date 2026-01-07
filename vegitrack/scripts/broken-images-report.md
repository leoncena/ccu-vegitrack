# Broken Image URLs Report

## Summary
- **Total URLs checked:** 53
- **Working:** 43
- **Broken:** 10 (all recipes)

## Broken Image URLs

All broken URLs are Unsplash image URLs that return 404. The issue appears to be that these Unsplash photo IDs are invalid or the images have been removed.

### Recipes with Broken Images:

1. **Lychee & Mint Salad** (ID: `1c286ddd-505b-4b01-8874-8fcc6c4dce96`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

2. **Lychee Sorbet** (ID: `0ff23c07-c7c0-459a-b2b3-2d2e0035b7ff`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

3. **Mango Salsa** (ID: `8deccbe7-05ae-4ba6-b7ca-00bac0f7f1e2`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

4. **Mango Salsa** (ID: `dbcfdbae-d7d0-48c2-b376-34a1a9a498d9`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

5. **Mango Salsa** (ID: `d7a48786-80c4-49b6-a84e-1785ca908078`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

6. **Mango Sticky Rice** (ID: `dd3a4ec5-71f4-45f2-9307-9c8198c0e5a7`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

7. **Mango Sticky Rice** (ID: `264cdb41-cefe-4cb9-8a64-25dc81001f0a`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

8. **Mango Sticky Rice** (ID: `661bc68d-5e00-41cf-8dc6-2b54fe539c96`)
   - URL: `https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800`
   - Status: 404

9. **Roasted Asparagus with Lemon** (ID: `fd22c051-bc61-46e3-b2ae-e2ff21af4010`)
   - URL: `https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800`
   - Status: 404

10. **Roasted Asparagus with Lemon** (ID: `50ba08d8-11ce-4b9e-b2d6-7bc26668349a`)
    - URL: `https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800`
    - Status: 404

## Notes

- All product images are working correctly
- All broken images are from Unsplash and appear to be using invalid photo IDs
- The same broken Unsplash URL (`photo-1605027990121-166a3b6b9a0b`) is used for multiple recipes (Lychee, Mango recipes)
- Another broken Unsplash URL (`photo-1615485925510-7df3f25e0b0a`) is used for some Roasted Asparagus recipes

## Recommended Actions 

1. Replace broken Unsplash URLs with valid image URLs
2. Consider using a more reliable image hosting solution or Supabase Storage for recipe images
3. Update the database with new valid image URLs
