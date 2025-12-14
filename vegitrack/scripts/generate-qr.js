// Script to generate a QR code image file with embedded JSON payload
// Usage example:
//   node generate-qr.js --product <product-uuid> --qr <qr-id> --base-url <base-url> --out <output-file>
// npm run generate:qr -- --product 11111111-2222-3333-4444-555555555555 --qr QR-3345667 --out cluster-qr.png --base-url http://localhost:5173         

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import QRCode from 'qrcode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

const url = getArg('--url')
const productId = getArg('--product') || getArg('--product-id')
const qrId = getArg('--qr') || getArg('--qr-id') || 'QR-SAMPLE'
const baseUrl = getArg('--base-url') || 'http://localhost:5173'
const outfile = getArg('--out') || `${qrId}.png`

let targetUrl
let payload

// If URL is provided, use it directly; otherwise use the old format
if (url) {
  targetUrl = url
  payload = url
} else if (productId) {
  targetUrl = `${baseUrl}/product/${productId}`
  payload = {
    qr_id: qrId,
    product_id: productId,
  }
} else {
  console.error('Missing required --url <url> or --product <product-uuid>')
  process.exit(1)
}

const outputDir = path.isAbsolute(outfile)
  ? path.dirname(outfile)
  : path.join(__dirname, '..', 'qr-output')

fs.mkdirSync(outputDir, { recursive: true })

const outPath = path.isAbsolute(outfile)
  ? outfile
  : path.join(outputDir, outfile)

// Generate filename for txt file (same name as QR but with .txt extension)
const txtPath = outPath.replace(/\.(png|jpg|jpeg)$/i, '.txt')

async function main() {
  console.log('Generating QR code for URL:', targetUrl)
  
  // Generate QR code - use URL directly if it's a string, otherwise JSON stringify
  const qrData = typeof payload === 'string' ? payload : JSON.stringify(payload)
  await QRCode.toFile(outPath, qrData, {
    errorCorrectionLevel: 'M',
    type: 'png',
    width: 400,
  })

  // Save payload as .txt file
  fs.writeFileSync(txtPath, targetUrl, 'utf-8')

  console.log('Saved QR code to:', outPath)
  console.log('Saved payload to:', txtPath)
  console.log('URL:', targetUrl)
}

main().catch((err) => {
  console.error('Failed to generate QR:', err)
  process.exit(1)
})
