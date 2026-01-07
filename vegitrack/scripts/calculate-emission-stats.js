import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Function to calculate percentiles
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b)
  const index = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower
  
  if (lower === upper) {
    return sorted[lower]
  }
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

async function calculateEmissionStats() {
  try {
    console.log('Fetching emission data from Supabase...\n')
    
    // Query all products with emissions data
    const { data, error } = await supabase
      .from('products')
      .select('emissions_co2e_per_kg')
      .not('emissions_co2e_per_kg', 'is', null)
    
    if (error) {
      console.error('Error fetching data:', error)
      process.exit(1)
    }
    
    if (!data || data.length === 0) {
      console.log('No emission data found in the database.')
      return
    }
    
    // Extract emission values and convert to numbers
    const emissions = data
      .map(row => parseFloat(row.emissions_co2e_per_kg))
      .filter(val => !isNaN(val) && val !== null)
    
    if (emissions.length === 0) {
      console.log('No valid emission values found.')
      return
    }
    
    // Calculate statistics
    const sorted = [...emissions].sort((a, b) => a - b)
    const sum = emissions.reduce((acc, val) => acc + val, 0)
    const average = sum / emissions.length
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const median = percentile(emissions, 50)
    const p25 = percentile(emissions, 25)
    const p75 = percentile(emissions, 75)
    const p10 = percentile(emissions, 10)
    const p90 = percentile(emissions, 90)
    const p5 = percentile(emissions, 5)
    const p95 = percentile(emissions, 95)
    
    // Calculate standard deviation
    const variance = emissions.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / emissions.length
    const stdDev = Math.sqrt(variance)
    
    console.log('='.repeat(60))
    console.log('EMISSION STATISTICS')
    console.log('='.repeat(60))
    console.log(`Total products with emission data: ${emissions.length}`)
    console.log('\n--- Basic Statistics ---')
    console.log(`Minimum:           ${min.toFixed(3)} kg CO₂/kg`)
    console.log(`Maximum:          ${max.toFixed(3)} kg CO₂/kg`)
    console.log(`Average (Mean):   ${average.toFixed(3)} kg CO₂/kg`)
    console.log(`Median (50th):     ${median.toFixed(3)} kg CO₂/kg`)
    console.log(`Std Deviation:     ${stdDev.toFixed(3)} kg CO₂/kg`)
    
    console.log('\n--- Percentiles ---')
    console.log(`5th percentile:   ${p5.toFixed(3)} kg CO₂/kg`)
    console.log(`10th percentile:  ${p10.toFixed(3)} kg CO₂/kg`)
    console.log(`25th percentile:  ${p25.toFixed(3)} kg CO₂/kg`)
    console.log(`50th percentile:  ${median.toFixed(3)} kg CO₂/kg (Median)`)
    console.log(`75th percentile:  ${p75.toFixed(3)} kg CO₂/kg`)
    console.log(`90th percentile:  ${p90.toFixed(3)} kg CO₂/kg`)
    console.log(`95th percentile:  ${p95.toFixed(3)} kg CO₂/kg`)
    
    console.log('\n--- Distribution Analysis ---')
    const below1 = emissions.filter(e => e < 1).length
    const between1and2 = emissions.filter(e => e >= 1 && e < 2).length
    const above2 = emissions.filter(e => e >= 2).length
    
    console.log(`Values < 1:      ${below1} (${((below1/emissions.length)*100).toFixed(1)}%)`)
    console.log(`Values 1-2:       ${between1and2} (${((between1and2/emissions.length)*100).toFixed(1)}%)`)
    console.log(`Values >= 2:      ${above2} (${((above2/emissions.length)*100).toFixed(1)}%)`)
    
    const p33 = percentile(emissions, 33)
    const p66 = percentile(emissions, 66)
    
    console.log('\n--- Recommended Thresholds ---')
    console.log('Based on the data distribution, here are suggested thresholds:')
    console.log(`\nOption 1: Percentile-based (33rd/66th)`)
    console.log(`  Green (Low):    < ${p33.toFixed(3)} kg CO₂/kg (33rd percentile)`)
    console.log(`  Orange (Medium): ${p33.toFixed(3)} - ${p66.toFixed(3)} kg CO₂/kg (33rd-66th percentile)`)
    console.log(`  Red (High):     >= ${p66.toFixed(3)} kg CO₂/kg (66th percentile)`)
    
    const belowP33 = emissions.filter(e => e < p33).length
    const betweenP33P66 = emissions.filter(e => e >= p33 && e < p66).length
    const aboveP66 = emissions.filter(e => e >= p66).length
    console.log(`  Distribution: ${belowP33} green, ${betweenP33P66} orange, ${aboveP66} red`)
    
    console.log(`\nOption 2: Current thresholds (1 and 2)`)
    console.log(`  Green (Low):    < 1.0 kg CO₂/kg`)
    console.log(`  Orange (Medium): 1.0 - 2.0 kg CO₂/kg`)
    console.log(`  Red (High):     >= 2.0 kg CO₂/kg`)
    console.log(`  Distribution: ${below1} green, ${between1and2} orange, ${above2} red`)
    
    console.log(`\nOption 3: Quartile-based`)
    console.log(`  Green (Low):    < ${p25.toFixed(3)} kg CO₂/kg (25th percentile)`)
    console.log(`  Orange (Medium): ${p25.toFixed(3)} - ${p75.toFixed(3)} kg CO₂/kg (25th-75th percentile)`)
    console.log(`  Red (High):     >= ${p75.toFixed(3)} kg CO₂/kg (75th percentile)`)
    
    const belowP25 = emissions.filter(e => e < p25).length
    const betweenP25P75 = emissions.filter(e => e >= p25 && e < p75).length
    const aboveP75 = emissions.filter(e => e >= p75).length
    console.log(`  Distribution: ${belowP25} green, ${betweenP25P75} orange, ${aboveP75} red`)
    
    console.log('\n' + '='.repeat(60))
    
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}

calculateEmissionStats()
