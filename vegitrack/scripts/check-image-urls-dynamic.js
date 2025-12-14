// Dynamic image URL checker that fetches from database
// Using native fetch (Node.js 18+)

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchImageUrls() {
  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, display_id, name, image_url')
    .not('image_url', 'is', null)
    .neq('image_url', '')

  if (productsError) {
    console.error('Error fetching products:', productsError)
    return []
  }

  // Fetch recipes
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, title, image_url')
    .not('image_url', 'is', null)
    .neq('image_url', '')

  if (recipesError) {
    console.error('Error fetching recipes:', recipesError)
    return []
  }

  // Fetch farms
  const { data: farms, error: farmsError } = await supabase
    .from('farms')
    .select('id, name, image_url')
    .not('image_url', 'is', null)
    .neq('image_url', '')

  if (farmsError) {
    console.error('Error fetching farms:', farmsError)
    return []
  }

  const imageUrls = [
    ...(products || []).map(p => ({
      source: 'product',
      id: p.id,
      name: p.name,
      display_id: p.display_id,
      url: p.image_url
    })),
    ...(recipes || []).map(r => ({
      source: 'recipe',
      id: r.id,
      name: r.title,
      display_id: r.title,
      url: r.image_url
    })),
    ...(farms || []).map(f => ({
      source: 'farm',
      id: f.id,
      name: f.name,
      display_id: f.name,
      url: f.image_url
    }))
  ]

  return imageUrls
}

async function checkUrl(item) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(item.url, { 
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageChecker/1.0)'
      }
    })
    
    clearTimeout(timeoutId)
    
    return {
      ...item,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    }
  } catch (error) {
    return {
      ...item,
      status: 'ERROR',
      ok: false,
      error: error.message
    }
  }
}

async function checkAllUrls() {
  console.log('Fetching image URLs from database...\n')
  
  const imageUrls = await fetchImageUrls()
  
  if (imageUrls.length === 0) {
    console.log('No image URLs found in database.')
    return
  }
  
  console.log(`Checking ${imageUrls.length} image URLs...\n`)
  
  const results = []
  for (let i = 0; i < imageUrls.length; i++) {
    const item = imageUrls[i]
    process.stdout.write(`[${i + 1}/${imageUrls.length}] Checking ${item.source}: ${item.name}... `)
    const result = await checkUrl(item)
    results.push(result)
    
    if (result.ok && result.status === 200) {
      console.log('✓ OK')
    } else {
      console.log(`✗ FAILED (${result.status || result.error})`)
    }
    
    // Small delay to avoid overwhelming servers
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  console.log('\n=== SUMMARY ===\n')
  
  const broken = results.filter(r => !r.ok || r.status !== 200)
  const working = results.filter(r => r.ok && r.status === 200)
  
  console.log(`Total URLs checked: ${results.length}`)
  console.log(`Working: ${working.length}`)
  console.log(`Broken: ${broken.length}\n`)
  
  if (broken.length > 0) {
    console.log('=== BROKEN IMAGE URLS ===\n')
    broken.forEach(item => {
      console.log(`${item.source.toUpperCase()}: ${item.name} (ID: ${item.id})`)
      console.log(`  Display ID: ${item.display_id}`)
      console.log(`  URL: ${item.url}`)
      console.log(`  Status: ${item.status || item.error}`)
      console.log('')
    })
  }
  
  return { broken, working }
}

checkAllUrls().catch(console.error)
