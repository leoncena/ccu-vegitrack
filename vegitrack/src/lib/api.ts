import { supabase } from './supabase'
import type {
  Product,
  Farm,
  Store,
  ProductLabel,
  QualityIndicator,
  SupplyChainBlock,
  CertificationBlock,
  FarmingPractice,
  FarmerStory,
  Recipe,
  ProductWithRelations,
} from '../types/database'

// ============================================
// Product Queries
// ============================================

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  return data
}

export async function getProductByDisplayId(displayId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('display_id', displayId)
    .single()

  if (error) {
    console.error('Error fetching product by display_id:', error)
    return null
  }
  return data
}

export async function getProductWithRelations(id: string): Promise<ProductWithRelations | null> {
  // Fetch product
  const product = await getProductById(id)
  if (!product) return null

  // Fetch related data in parallel
  const [farm, labels, qualityIndicators, supplyChain, certifications] = await Promise.all([
    product.farm_id ? getFarmById(product.farm_id) : null,
    getProductLabels(id),
    getQualityIndicators(id),
    getSupplyChain(id),
    getCertifications(id),
  ])

  return {
    ...product,
    farm: farm || undefined,
    labels: labels || undefined,
    quality_indicators: qualityIndicators || undefined,
    supply_chain: supplyChain || undefined,
    certifications: certifications || undefined,
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(20)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }
  return data || []
}

// ============================================
// Farm Queries
// ============================================

export async function getFarmById(id: string): Promise<Farm | null> {
  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching farm:', error)
    return null
  }
  return data
}

export async function getFarmingPractices(farmId: string): Promise<FarmingPractice[]> {
  const { data, error } = await supabase
    .from('farming_practices')
    .select('*')
    .eq('farm_id', farmId)

  if (error) {
    console.error('Error fetching farming practices:', error)
    return []
  }
  return data || []
}

export async function getFarmerStory(farmId: string): Promise<FarmerStory | null> {
  const { data, error } = await supabase
    .from('farmer_stories')
    .select('*')
    .eq('farm_id', farmId)
    .single()

  if (error) {
    // Not necessarily an error - farm might not have a story
    if (error.code !== 'PGRST116') {
      console.error('Error fetching farmer story:', error)
    }
    return null
  }
  return data
}

// ============================================
// Store Queries
// ============================================

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('distance_m', { ascending: true })

  if (error) {
    console.error('Error fetching stores:', error)
    return []
  }
  return data || []
}

export async function getStoreById(id: string): Promise<Store | null> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching store:', error)
    return null
  }
  return data
}

// ============================================
// Product Labels & Quality
// ============================================

export async function getProductLabels(productId: string): Promise<ProductLabel[]> {
  const { data, error } = await supabase
    .from('product_labels')
    .select('*')
    .eq('product_id', productId)

  if (error) {
    console.error('Error fetching product labels:', error)
    return []
  }
  return data || []
}

export async function getQualityIndicators(productId: string): Promise<QualityIndicator[]> {
  const { data, error } = await supabase
    .from('quality_indicators')
    .select('*')
    .eq('product_id', productId)

  if (error) {
    console.error('Error fetching quality indicators:', error)
    return []
  }
  return data || []
}

// ============================================
// VegiChain Queries (Supply Chain & Certifications)
// ============================================

export async function getSupplyChain(productId: string): Promise<SupplyChainBlock[]> {
  const { data, error } = await supabase
    .from('supply_chain_ledger')
    .select('*')
    .eq('product_id', productId)
    .order('block_index', { ascending: true })

  if (error) {
    console.error('Error fetching supply chain:', error)
    return []
  }
  return data || []
}

export async function getCertifications(productId: string): Promise<CertificationBlock[]> {
  const { data, error } = await supabase
    .from('certification_ledger')
    .select('*')
    .eq('product_id', productId)
    .order('block_index', { ascending: true })

  if (error) {
    console.error('Error fetching certifications:', error)
    return []
  }
  return data || []
}

// ============================================
// Recipes
// ============================================

export async function getRecipes(productId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('product_id', productId)

  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
  return data || []
}

// ============================================
// Alternative Products
// ============================================

interface AlternativeProductWithDetails extends Product {
  reason?: string
}

export async function getAlternativeProducts(productId: string): Promise<AlternativeProductWithDetails[]> {
  const { data, error } = await supabase
    .from('alternative_products')
    .select(`
      reason,
      alternative:alternative_id (*)
    `)
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching alternative products:', error)
    return []
  }

  // Transform the nested data
  return (data || []).map((item: { reason: string | null; alternative: Product }) => ({
    ...item.alternative,
    reason: item.reason || undefined,
  }))
}

