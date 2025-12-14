// Using native fetch (Node.js 18+)

const imageUrls = [
  // Products
  { source: 'product', id: 'd1d1d1d1-2222-3333-4444-555555555555', name: 'Ataulfo Mango', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Yay%2C_the_Ataulfos_Have_Arrived.jpg/500px-Yay%2C_the_Ataulfos_Have_Arrived.jpg' },
  { source: 'product', id: 'b3b3b3b3-2222-3333-4444-555555555555', name: 'Bacon Avocado', url: 'https://www.blifesrl.it/wp-content/uploads/2021/02/6658.png' },
  { source: 'product', id: '22222222-3333-4444-5555-666666666666', name: 'Cherry Tomatoes', url: 'https://foodbutlers.de/wp-content/uploads/2020/12/Food-Butlers-Tomate-980x634.jpg' },
  { source: 'product', id: '11111111-2222-3333-4444-555555555555', name: 'Cluster Tomatoes', url: 'https://static.tegut.com/fileadmin/_processed_/5/c/csm_Tomate_Header_2_01_f1bde0a618.jpg' },
  { source: 'product', id: 'f1f1f1f1-2222-3333-4444-555555555555', name: 'Dragonfruit', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Dragonfruit_Chiayi_market.jpg' },
  { source: 'product', id: 'b2b2b2b2-2222-3333-4444-555555555555', name: 'Fuerte Avocado', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'product', id: 'c3c3c3c3-2222-3333-4444-555555555555', name: 'Fuji Apple', url: 'https://www.organicindiaseeds.com/cdn/shop/files/heirloom-fuji-apple-seedlings-growing.jpg?v=1762257296&width=1000' },
  { source: 'product', id: 'c1c1c1c1-2222-3333-4444-555555555555', name: 'Gala Apple', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
  { source: 'product', id: 'c2c2c2c2-2222-3333-4444-555555555555', name: 'Granny Smith Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Granny_smith_and_cross_section.jpg' },
  { source: 'product', id: 'a1a1a1a1-2222-3333-4444-555555555555', name: 'Green Asparagus', url: 'https://www.spargel-gaenger.de/fileadmin/_processed_/f/3/csm_spargel_aa87db7ed6.jpg' },
  { source: 'product', id: 'b1b1b1b1-2222-3333-4444-555555555555', name: 'Hass Avocado', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'product', id: 'd3d3d3d3-2222-3333-4444-555555555555', name: 'Keitt Mango', url: 'https://www.truebenecker.de/cdn/shop/files/mango_keitt_bio_kaufen.jpg?v=1761757779' },
  { source: 'product', id: 'e1e1e1e1-2222-3333-4444-555555555555', name: 'Lychee', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lychee.jpg/2560px-Lychee.jpg' },
  { source: 'product', id: 'a3a3a3a3-2222-3333-4444-555555555555', name: 'Purple Asparagus', url: 'https://www.organicindiaseeds.com/cdn/shop/files/purple-asparagus-seeds.webp?v=1761558589&width=1000' },
  { source: 'product', id: '33333333-4444-5555-6666-777777777777', name: 'Roma Tomatoes', url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800' },
  { source: 'product', id: '0823e12e-1eb5-449d-8e9f-9d6b429a77c7', name: 'Tegernsee Asparagus', url: 'https://ovgcnhoblwpkzccttyvk.supabase.co/storage/v1/object/public/images/products/0823e12e-1eb5-449d-8e9f-9d6b429a77c7-1765660828360.jpg' },
  { source: 'product', id: 'd2d2d2d2-2222-3333-4444-555555555555', name: 'Tommy Atkins Mango', url: 'https://www.pickmenursery.co.za/wp-content/uploads/Tommy-atkins-Mango.jpeg' },
  { source: 'product', id: 'a2a2a2a2-2222-3333-4444-555555555555', name: 'White Asparagus', url: 'https://www.thiermannspargel.de/wp-content/uploads/2022/04/spargel.jpg.pagespeed.ce.6xbDae8rVK.jpg' },
  // Recipes
  { source: 'recipe', id: '1a8f2b38-7775-406e-bfd0-6ae0df261443', name: 'Apple Crumble', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
  { source: 'recipe', id: '489e7f1b-6cdc-4768-bac3-cc9adc709fd4', name: 'Apple Crumble', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
  { source: 'recipe', id: '38e38886-444f-45e7-9d80-42fce902501e', name: 'Apple Crumble', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
  { source: 'recipe', id: '0d912a35-2963-458c-9a5f-d4523794c25c', name: 'Apple Salad with Walnuts', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
  { source: 'recipe', id: 'c5262d32-3c25-4db1-8527-108220629cdc', name: 'Apple Salad with Walnuts', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
  { source: 'recipe', id: '5097d8d6-4963-45ca-aafe-6172785fb691', name: 'Apple Salad with Walnuts', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
  { source: 'recipe', id: 'd40afc2e-a291-4aa6-98f1-97900880037a', name: 'Asparagus Risotto', url: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800' },
  { source: 'recipe', id: '3a22c1f6-2c20-408a-ab34-79b953deda1f', name: 'Asparagus Risotto', url: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800' },
  { source: 'recipe', id: '8e9865f7-0b39-4eb2-a327-dad012841628', name: 'Asparagus Risotto', url: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800' },
  { source: 'recipe', id: 'f78b6742-7cb4-4212-8f7e-cb0ad139f172', name: 'Avocado Toast', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'recipe', id: 'a07c1353-f405-4cae-b9c1-481395eafbd4', name: 'Avocado Toast', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'recipe', id: '4ea44c5d-05e8-4c2b-8c86-fd30ed52bb3d', name: 'Avocado Toast', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'recipe', id: '3350f0b5-bf1b-4e1a-aa67-bac3e6ab76ea', name: 'Classic Gazpacho', url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800' },
  { source: 'recipe', id: '83d3b803-bfea-40d4-9a3d-8174c9a31321', name: 'Classic Gazpacho', url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800' },
  { source: 'recipe', id: '9ded278e-559c-4414-9557-8c5c04466c5b', name: 'Classic Gazpacho', url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800' },
  { source: 'recipe', id: 'c7baa7f6-fe05-4fe3-bfc6-46b64e344bb4', name: 'Classic Guacamole', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'recipe', id: '9ba84c7a-16f2-4561-9452-5994d6409ae0', name: 'Classic Guacamole', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'recipe', id: '5b0a9ebe-a51b-4609-9f04-549b176cf1e1', name: 'Classic Guacamole', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800' },
  { source: 'recipe', id: '36db4990-07fb-4b18-94d2-02bcd1990f09', name: 'Dragonfruit Salad', url: 'https://sunkissedkitchen.com/wp-content/uploads/2020/03/dragon-fruit-salad.jpg' },
  { source: 'recipe', id: '4903d83a-db94-4b91-87bf-f8ec665bdafe', name: 'Dragonfruit Smoothie Bowl', url: 'https://minimalistbaker.com/wp-content/uploads/2018/04/DELICIOUS-Dragon-Fruit-Smoothie-Bowls-5-minutes-5-ingredients-1-blender-RICH-in-vitamins-and-minerals-vegan-glutenfree-smoothie-recipe-dragonfruit-12.jpg' },
  { source: 'recipe', id: '1c286ddd-505b-4b01-8874-8fcc6c4dce96', name: 'Lychee & Mint Salad', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: '0ff23c07-c7c0-459a-b2b3-2d2e0035b7ff', name: 'Lychee Sorbet', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: '8deccbe7-05ae-4ba6-b7ca-00bac0f7f1e2', name: 'Mango Salsa', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: 'dbcfdbae-d7d0-48c2-b376-34a1a9a498d9', name: 'Mango Salsa', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: 'd7a48786-80c4-49b6-a84e-1785ca908078', name: 'Mango Salsa', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: 'dd3a4ec5-71f4-45f2-9307-9c8198c0e5a7', name: 'Mango Sticky Rice', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: '264cdb41-cefe-4cb9-8a64-25dc81001f0a', name: 'Mango Sticky Rice', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: '661bc68d-5e00-41cf-8dc6-2b54fe539c96', name: 'Mango Sticky Rice', url: 'https://images.unsplash.com/photo-1605027990121-166a3b6b9a0b?w=800' },
  { source: 'recipe', id: 'fd22c051-bc61-46e3-b2ae-e2ff21af4010', name: 'Roasted Asparagus with Lemon', url: 'https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800' },
  { source: 'recipe', id: '7600f8aa-2cce-4ea5-994c-a96a791ba4c6', name: 'Roasted Asparagus with Lemon', url: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800' },
  { source: 'recipe', id: '50ba08d8-11ce-4b9e-b2d6-7bc26668349a', name: 'Roasted Asparagus with Lemon', url: 'https://images.unsplash.com/photo-1615485925510-7df3f25e0b0a?w=800' },
  { source: 'recipe', id: 'ef5a3d74-b6ea-443e-b3a3-4b72aca5dcfa', name: 'Spargelsuppe', url: 'https://ovgcnhoblwpkzccttyvk.supabase.co/storage/v1/object/public/images/recipes/0823e12e-1eb5-449d-8e9f-9d6b429a77c7-recipe-0-1765660829530.jpeg' },
  { source: 'recipe', id: '178cb602-f3e6-42ca-b00d-5100899f5ac5', name: 'Tomato & Olive Salad (Salada da Horta)', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' },
  { source: 'recipe', id: '0683939e-29a2-47a3-a08a-063d7ac70571', name: 'Tomato & Olive Salad (Salada da Horta)', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' },
  { source: 'recipe', id: '2abc685e-3047-4c98-a72f-88ed5eb2c994', name: 'Tomato & Olive Salad (Salada da Horta)', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' },
];

async function checkUrl(item) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(item.url, { 
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageChecker/1.0)'
      }
    });
    
    clearTimeout(timeoutId);
    
    return {
      ...item,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      ...item,
      status: 'ERROR',
      ok: false,
      error: error.message
    };
  }
}

async function checkAllUrls() {
  console.log(`Checking ${imageUrls.length} image URLs...\n`);
  
  const results = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const item = imageUrls[i];
    process.stdout.write(`[${i + 1}/${imageUrls.length}] Checking ${item.source}: ${item.name}... `);
    const result = await checkUrl(item);
    results.push(result);
    
    if (result.ok && result.status === 200) {
      console.log('✓ OK');
    } else {
      console.log(`✗ FAILED (${result.status || result.error})`);
    }
    
    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n=== SUMMARY ===\n');
  
  const broken = results.filter(r => !r.ok || r.status !== 200);
  const working = results.filter(r => r.ok && r.status === 200);
  
  console.log(`Total URLs checked: ${results.length}`);
  console.log(`Working: ${working.length}`);
  console.log(`Broken: ${broken.length}\n`);
  
  if (broken.length > 0) {
    console.log('=== BROKEN IMAGE URLS ===\n');
    broken.forEach(item => {
      console.log(`${item.source.toUpperCase()}: ${item.name} (ID: ${item.id})`);
      console.log(`  URL: ${item.url}`);
      console.log(`  Status: ${item.status || item.error}`);
      console.log('');
    });
  }
  
  return { broken, working };
}

checkAllUrls().catch(console.error);
