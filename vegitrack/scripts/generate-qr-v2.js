// Script to generate QR codes for all products in the qr_codes table
// Usage: node generate-qr-v2.js
// Requires: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const outputDir = path.join(__dirname, '..', 'qr-output')
fs.mkdirSync(outputDir, { recursive: true })

// Helper function to sanitize filename
function sanitizeFilename(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

// Helper function to generate filename from product name and variety
function generateFilename(productName, variety) {
  const namePart = sanitizeFilename(productName)
  const varietyPart = variety ? sanitizeFilename(variety) : ''
  const filename = varietyPart 
    ? `QR_${namePart}_${varietyPart}`
    : `QR_${namePart}`
  return `${filename}.png`
}

// Helper function to create HTML for QR code rendering
function createQRCodeHTML(payload, iconSvgContent) {
  const payloadJson = JSON.stringify(payload)
  // Convert SVG to data URI (URL encode for proper embedding)
  const encodedSvg = encodeURIComponent(iconSvgContent)
  const iconDataUri = `data:image/svg+xml;charset=utf-8,${encodedSvg}`
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://unpkg.com/@bitjson/qr-code@1.0.2/dist/qr-code.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
    }
    qr-code {
      width: 400px;
      height: 400px;
    }
  </style>
</head>
<body>
  <qr-code
    id="qr"
    contents='${payloadJson.replace(/'/g, "\\'")}'
    module-color="#1c7d43"
    position-ring-color="#13532d"
    position-center-color="#70c559"
  >
    <img src="${iconDataUri}" slot="icon" style="width: 80px; height: 80px;" />
  </qr-code>
  <script>
    document.getElementById('qr').addEventListener('codeRendered', () => {
      console.log('QR code rendered');
    });
  </script>
</body>
</html>`
}

async function main() {
  console.log('Fetching QR codes and products from Supabase...')
  
  // Fetch QR codes
  const { data: qrCodes, error: qrError } = await supabase
    .from('qr_codes')
    .select('qr_code_id, product_id')
    .eq('is_active', true)

  if (qrError) {
    console.error('Error fetching QR codes:', qrError)
    process.exit(1)
  }

  if (!qrCodes || qrCodes.length === 0) {
    console.log('No active QR codes found in the database.')
    process.exit(0)
  }

  console.log(`Found ${qrCodes.length} QR codes to generate\n`)

  // Fetch all products
  const productIds = qrCodes.map(qr => qr.product_id).filter(Boolean)
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, variety')
    .in('id', productIds)

  if (productsError) {
    console.error('Error fetching products:', productsError)
    process.exit(1)
  }

  // Create a map for quick product lookup
  const productMap = new Map((products || []).map(p => [p.id, p]))

  // Load tomato icon and change color to green
  const iconPath = path.join(__dirname, '..', 'src', 'assets', 'wallpaper', 'tomato.svg')
  if (!fs.existsSync(iconPath)) {
    console.error(`❌ Icon not found at: ${iconPath}`)
    process.exit(1)
  }
  let iconSvgContent = fs.readFileSync(iconPath, 'utf-8')
  // Replace red color (#C02525) with green color (#1c7d43) to match QR code
  iconSvgContent = iconSvgContent.replace(/#C02525/g, '#1c7d43')

  // Launch browser
  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  let successCount = 0
  let errorCount = 0

  try {
    for (const qr of qrCodes) {
      try {
        const product = productMap.get(qr.product_id)
        if (!product) {
          console.warn(`⚠️  Skipping QR ${qr.qr_code_id}: product ${qr.product_id} not found`)
          errorCount++
          continue
        }

        // Create JSON payload
        const payload = {
          qr_id: qr.qr_code_id,
          product_id: qr.product_id,
        }

        // Generate filename
        const filename = generateFilename(product.name, product.variety)
        const outPath = path.join(outputDir, filename)

        // Create HTML for QR code
        const html = createQRCodeHTML(payload, iconSvgContent)
        const tempHtmlPath = path.join(outputDir, `temp_${Date.now()}.html`)
        fs.writeFileSync(tempHtmlPath, html)

        // Render QR code with Puppeteer
        const page = await browser.newPage()
        try {
          await page.setViewport({ width: 500, height: 500 })
          await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' })
          
          // Wait for QR code to render
          await page.waitForFunction(() => {
            const qrElement = document.querySelector('qr-code')
            return qrElement && qrElement.shadowRoot && qrElement.shadowRoot.querySelector('svg')
          }, { timeout: 10000 })

          // Wait a bit more for icon to load
          await new Promise(resolve => setTimeout(resolve, 500))

          // Take screenshot
          const qrElement = await page.$('qr-code')
          await qrElement.screenshot({ path: outPath, type: 'png' })
        } finally {
          await page.close()
          // Clean up temp file
          if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath)
          }
        }

        console.log(`✅ Generated: ${filename}`)
        console.log(`   QR ID: ${qr.qr_code_id}, Product: ${product.name}${product.variety ? ` (${product.variety})` : ''}`)
        console.log(`   Payload: ${JSON.stringify(payload)}\n`)

        successCount++
      } catch (err) {
        console.error(`❌ Error generating QR for ${qr.qr_code_id}:`, err.message)
        errorCount++
      }
    }
  } finally {
    await browser.close()
  }

  console.log('\n' + '='.repeat(50))
  console.log(`Summary: ${successCount} successful, ${errorCount} errors`)
  console.log(`Output directory: ${outputDir}`)
}

main().catch((err) => {
  console.error('Failed to generate QR codes:', err)
  process.exit(1)
})

