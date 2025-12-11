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

const productId = getArg('--product') || getArg('--product-id')
const qrId = getArg('--qr') || getArg('--qr-id') || 'QR-SAMPLE'
const baseUrl = getArg('--base-url') || 'http://localhost:5173'
const outfile = getArg('--out') || `${qrId}.png`

if (!productId) {
  console.error('Missing required --product <product-uuid>')
  process.exit(1)
}

const payload = {
  qr_id: qrId,
  product_id: productId,
}

const outputDir = path.isAbsolute(outfile)
  ? path.dirname(outfile)
  : path.join(__dirname, '..', 'qr-output')

fs.mkdirSync(outputDir, { recursive: true })

const outPath = path.isAbsolute(outfile)
  ? outfile
  : path.join(outputDir, outfile)

async function main() {
  console.log('Generating QR code with payload:', payload)
  await QRCode.toFile(outPath, JSON.stringify(payload), {
    errorCorrectionLevel: 'M',
    type: 'png',
    width: 400,
  })

  const targetUrl = `${baseUrl}/product/${productId}`
  console.log('Saved QR to:', outPath)
  console.log('When scanned, app will parse JSON payload and navigate to:', targetUrl)
  console.log('Preview payload:', JSON.stringify(payload))
}

main().catch((err) => {
  console.error('Failed to generate QR:', err)
  process.exit(1)
})
