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
  UserFavorite,
  ViewHistory,
  SustainabilityMetric,
} from '../types/database'

// ============================================
// QR Codes
// ============================================

export interface QRCodePayload {
  qr_id: string
  product_id: string
  // Allow future fields without breaking existing codes
  [key: string]: any
}

export function parseQRCodePayload(qrText: string): QRCodePayload | null {
  try {
    const parsed = JSON.parse(qrText)
    if (parsed?.qr_id && parsed?.product_id) {
      return parsed as QRCodePayload
    }
    return null
  } catch (error) {
    console.error('Invalid QR payload:', error)
    return null
  }
}

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

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, display_id')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching all products:', error)
    return []
  }
  return data || []
}

export async function getProductWithRelations(id: string): Promise<ProductWithRelations | null> {
  // Fetch product
  const product = await getProductById(id)
  if (!product) return null

  // Fetch related data in parallel
  const [farm, labels, qualityIndicators, supplyChain, certifications, metrics] = await Promise.all([
    product.farm_id ? getFarmById(product.farm_id) : null,
    getProductLabels(id),
    getQualityIndicators(id),
    getSupplyChain(id),
    getCertifications(id),
    getSustainabilityMetrics(id),
  ])

  return {
    ...product,
    farm: farm || undefined,
    labels: labels || undefined,
    quality_indicators: qualityIndicators || undefined,
    supply_chain: supplyChain || undefined,
    certifications: certifications || undefined,
    sustainability_metrics: metrics || undefined,
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
// Sustainability Metrics
// ============================================
export async function getSustainabilityMetrics(productId: string): Promise<SustainabilityMetric | null> {
  const { data, error } = await supabase
    .from('sustainability_metrics')
    .select('*')
    .eq('product_id', productId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching sustainability metrics:', error)
    return null
  }
  return data || null
}

// ============================================
// Favorites
// ============================================
export async function getUserFavorites(userId: string): Promise<(UserFavorite & { product?: Product | null })[]> {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('*, product:products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
  return (data as (UserFavorite & { product?: Product | null })[]) || []
}

export async function addFavorite(userId: string, productId: string) {
  const { error } = await (supabase
    .from('user_favorites') as any)
    .upsert({ user_id: userId, product_id: productId })
  if (error) throw error
}

export async function removeFavorite(userId: string, productId: string) {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}

// ============================================
// View History
// ============================================
export async function addViewHistory(userId: string, productId: string, metadata: Record<string, unknown> = {}) {
  const { error } = await (supabase
    .from('view_history') as any)
    .insert({ user_id: userId, product_id: productId, metadata })
  if (error) throw error
}

export async function getViewHistory(userId: string, limit = 20): Promise<(ViewHistory & { product?: Product | null })[]> {
  const { data, error } = await supabase
    .from('view_history')
    .select('*, product:products(*)')
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching view history:', error)
    return []
  }
  return (data as (ViewHistory & { product?: Product | null })[]) || []
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
  return data
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

// ============================================
// Producer & Farm Management
// ============================================

export async function getProducerProfile(userId: string) {
  const { data, error } = await supabase
    .from('producer_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching producer profile:', error)
    return null
  }
  return data
}

export async function getProducerFarm(userId: string): Promise<Farm | null> {
  // First, get producer profile
  const { data: profile } = await supabase
    .from('producer_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!profile) return null

  const producerId = (profile as { id: string }).id
  if (!producerId) return null

  // Try to get farm from producer's products
  const { data: products } = await supabase
    .from('producer_products')
    .select('product:products(farm_id)')
    .eq('producer_id', producerId)

  if (products && products.length > 0) {
    const firstProduct = products[0] as { product: { farm_id: string } | null } | null
    const product = firstProduct?.product
    if (product?.farm_id) {
      return getFarmById(product.farm_id)
    }
  }

  // If no farm found via products, return null (user can create one)
  return null
}

export async function getProducerFarms(userId: string): Promise<Farm[]> {
  // First, get producer profile
  const { data: profile } = await supabase
    .from('producer_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!profile) return []

  const producerId = (profile as { id: string }).id
  if (!producerId) return []

  const farmIds = new Set<string>()

  // Method 1: Get farms from products linked to this producer
  const { data: products } = await supabase
    .from('producer_products')
    .select('product:products(farm_id)')
    .eq('producer_id', producerId)

  if (products && products.length > 0) {
    for (const item of products) {
      const product = (item as { product: { farm_id: string | null } | null })?.product
      if (product?.farm_id) {
        farmIds.add(product.farm_id)
      }
    }
  }

  // Method 2: Get farms that have farming_practices but no products yet
  // These are likely newly created farms by this producer
  // Get all farms with farming_practices
  const { data: allPractices } = await (supabase
    .from('farming_practices') as any)
    .select('farm_id')
    .not('farm_id', 'is', null)

  if (allPractices && allPractices.length > 0) {
    // Get unique farm IDs from practices
    const practiceFarmIds = new Set<string>()
    for (const practice of allPractices as { farm_id: string }[]) {
      if (practice.farm_id) {
        practiceFarmIds.add(practice.farm_id)
      }
    }

    // For each farm with practices, check if it has products
    // If no products, include it (likely a new farm)
    for (const farmId of practiceFarmIds) {
      if (!farmIds.has(farmId)) {
        // Check if this farm has any products
        const { data: farmProducts } = await supabase
          .from('products')
          .select('id')
          .eq('farm_id', farmId)
          .limit(1)
        
        // If farm has no products, include it (newly created farm)
        if (!farmProducts || farmProducts.length === 0) {
          farmIds.add(farmId)
        }
      }
    }
  }

  // Fetch all farms
  const farms: Farm[] = []
  for (const farmId of farmIds) {
    const farm = await getFarmById(farmId)
    if (farm) {
      farms.push(farm)
    }
  }

  return farms
}

export async function createFarm(farmData: Omit<Farm, 'id' | 'created_at'>) {
  // Ensure id and created_at are not in the payload (they should be auto-generated)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, coordinates, ...cleanData } = farmData as any
  
  // Convert coordinates from {lat, lng} object to PostgreSQL POINT format: "(lng,lat)"
  let coordinatesFormatted: string | null = null
  if (coordinates && typeof coordinates === 'object' && 'lat' in coordinates && 'lng' in coordinates) {
    coordinatesFormatted = `(${coordinates.lng},${coordinates.lat})`
  }
  
  const insertData = {
    ...cleanData,
    ...(coordinatesFormatted !== null ? { coordinates: coordinatesFormatted } : {})
  }
  
  const { data, error } = await (supabase
    .from('farms') as any)
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating farm:', error)
    throw error
  }
  return data
}

export async function updateFarm(farmId: string, farmData: Partial<Omit<Farm, 'id' | 'created_at'>>) {
  // Convert coordinates from {lat, lng} object to PostgreSQL POINT format: "(lng,lat)"
  const { coordinates, ...restData } = farmData as any
  let coordinatesFormatted: string | null | undefined = undefined
  
  if (coordinates !== undefined) {
    if (coordinates === null) {
      coordinatesFormatted = null
    } else if (typeof coordinates === 'object' && coordinates !== null && 'lat' in coordinates && 'lng' in coordinates) {
      coordinatesFormatted = `(${coordinates.lng},${coordinates.lat})`
    }
  }
  
  const updateData = {
    ...restData,
    ...(coordinatesFormatted !== undefined ? { coordinates: coordinatesFormatted } : {})
  }
  
  const { data, error } = await (supabase
    .from('farms') as any)
    .update(updateData)
    .eq('id', farmId)
    .select()
    .single()

  if (error) {
    console.error('Error updating farm:', error)
    throw error
  }
  return data
}

export async function upsertFarmerStory(storyData: Omit<FarmerStory, 'id' | 'created_at'> & { id?: string }) {
  if (storyData.id) {
    const { id, ...updateData } = storyData
    const { data, error } = await (supabase
      .from('farmer_stories') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { id, ...insertData } = storyData
    const { data, error } = await (supabase
      .from('farmer_stories') as any)
      .insert(insertData)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export async function upsertFarmingPractice(practiceData: Omit<FarmingPractice, 'id' | 'created_at'> & { id?: string }) {
  if (practiceData.id) {
    const { id, ...updateData } = practiceData
    const { data, error } = await (supabase
      .from('farming_practices') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { id, ...insertData } = practiceData
    const { data, error } = await (supabase
      .from('farming_practices') as any)
      .insert(insertData)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export async function deleteFarmingPractice(practiceId: string) {
  const { error } = await supabase
    .from('farming_practices')
    .delete()
    .eq('id', practiceId)
  if (error) throw error
}

// ============================================
// Product Management
// ============================================

export async function getProducerProducts(userId: string): Promise<(Product & { farm_name?: string | null })[]> {
  const { data: profile } = await (supabase
    .from('producer_profiles') as any)
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!profile) return []

  const { data, error } = await (supabase
    .from('producer_products') as any)
    .select('product:products(*, farms(name))')
    .eq('producer_id', profile.id)

  if (error) {
    console.error('Error fetching producer products:', error)
    return []
  }

  return (data || []).map((item: { product: Product & { farms?: { name: string } | { name: string }[] | null } }) => {
    const product = item.product
    // Handle both array and object cases for the farms relationship
    const farm = Array.isArray(product.farms) ? product.farms[0] : product.farms
    return {
      ...product,
      farm_name: farm?.name || null,
    }
  }).filter(Boolean)
}

export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  userId: string,
  relatedData?: {
    labels?: Omit<ProductLabel, 'id' | 'created_at' | 'product_id'>[]
    qualityIndicators?: Omit<QualityIndicator, 'id' | 'created_at' | 'product_id'>[]
    certifications?: Omit<CertificationBlock, 'id' | 'created_at' | 'product_id' | 'block_index' | 'block_hash' | 'previous_hash' | 'timestamp'>[]
    recipes?: Omit<Recipe, 'id' | 'created_at' | 'product_id'>[]
    sustainabilityMetrics?: Omit<SustainabilityMetric, 'id' | 'created_at' | 'product_id'> | null
  }
) {
  // Create product
  const { data: product, error: productError } = await (supabase
    .from('products') as any)
    .insert(productData)
    .select()
    .single()

  if (productError) {
    console.error('Error creating product:', productError)
    throw productError
  }

  // Link to producer
  const { data: profile } = await (supabase
    .from('producer_profiles') as any)
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (profile && product) {
    await (supabase.from('producer_products') as any).insert({
      producer_id: profile.id,
      product_id: product.id,
    })
  }

  // Create related data
  if (relatedData) {
    const now = new Date().toISOString()
    
    if (relatedData.labels?.length && product) {
      await (supabase.from('product_labels') as any).insert(
        relatedData.labels.map((label: any) => ({ ...label, product_id: product.id }))
      )
    }

    if (relatedData.qualityIndicators?.length && product) {
      await (supabase.from('quality_indicators') as any).insert(
        relatedData.qualityIndicators.map((indicator: any) => {
          if (indicator.indicator_type === 'shelf_life') {
            return {
              indicator_type: indicator.indicator_type,
              product_id: product.id,
              score: null,
              max_score: null,
              percentage: null,
              description: indicator.description || null,
              shelf_life_remaining_days: indicator.shelf_life_remaining_days || null,
            }
          } else {
            return {
              indicator_type: indicator.indicator_type,
              product_id: product.id,
              score: typeof indicator.score === 'string' ? parseFloat(indicator.score) : indicator.score,
              max_score: typeof indicator.max_score === 'string' ? parseFloat(indicator.max_score) : (indicator.max_score || 5),
              percentage: indicator.percentage ? parseFloat(indicator.percentage) : ((indicator.score / (indicator.max_score || 5)) * 100),
              description: indicator.description || null,
              shelf_life_remaining_days: null,
            }
          }
        })
      )
    }

    if (relatedData.certifications?.length && product) {
      let previousHash: string | null = null
      for (let i = 0; i < relatedData.certifications.length; i++) {
        const cert = relatedData.certifications[i]
        const blockHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
        await (supabase.from('certification_ledger') as any).insert({
          ...cert,
          product_id: product.id,
          block_index: i,
          block_hash: blockHash,
          previous_hash: previousHash,
          timestamp: now,
        })
        previousHash = blockHash
      }
    }

    if (relatedData.recipes?.length && product) {
      await (supabase.from('recipes') as any).insert(
        relatedData.recipes.map((recipe: any) => ({ ...recipe, product_id: product.id }))
      )
    }

    if (relatedData.sustainabilityMetrics && product) {
      await (supabase.from('sustainability_metrics') as any).insert({
        ...relatedData.sustainabilityMetrics,
        product_id: product.id,
      })
    }
  }

  return product
}

export async function updateProduct(
  productId: string,
  productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await (supabase
    .from('products') as any)
    .update(productData)
    .eq('id', productId)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }
  return data
}

export async function deleteProduct(productId: string) {
  const { error } = await (supabase
    .from('products') as any)
    .delete()
    .eq('id', productId)
  if (error) throw error
}

export async function getAllFarms(): Promise<Farm[]> {
  const { data, error } = await (supabase
    .from('farms') as any)
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching farms:', error)
    return []
  }
  return data || []
}

export async function getAllStores(): Promise<Store[]> {
  const { data, error } = await (supabase
    .from('stores') as any)
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching stores:', error)
    return []
  }
  return data || []
}

