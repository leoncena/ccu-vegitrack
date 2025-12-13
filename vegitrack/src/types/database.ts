// Database types for Supabase
// These will be auto-generated once we have the actual schema

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id'>>
      }
      farms: {
        Row: Farm
        Insert: Omit<Farm, 'id' | 'created_at'>
        Update: Partial<Omit<Farm, 'id'>>
      }
      stores: {
        Row: Store
        Insert: Omit<Store, 'id' | 'created_at'>
        Update: Partial<Omit<Store, 'id'>>
      }
      product_labels: {
        Row: ProductLabel
        Insert: Omit<ProductLabel, 'id' | 'created_at'>
        Update: Partial<Omit<ProductLabel, 'id'>>
      }
      quality_indicators: {
        Row: QualityIndicator
        Insert: Omit<QualityIndicator, 'id' | 'created_at'>
        Update: Partial<Omit<QualityIndicator, 'id'>>
      }
      supply_chain_ledger: {
        Row: SupplyChainBlock
        Insert: Omit<SupplyChainBlock, 'id' | 'created_at'>
        Update: Partial<Omit<SupplyChainBlock, 'id'>>
      }
      certification_ledger: {
        Row: CertificationBlock
        Insert: Omit<CertificationBlock, 'id' | 'created_at'>
        Update: Partial<Omit<CertificationBlock, 'id'>>
      }
      farming_practices: {
        Row: FarmingPractice
        Insert: Omit<FarmingPractice, 'id' | 'created_at'>
        Update: Partial<Omit<FarmingPractice, 'id'>>
      }
      farmer_stories: {
        Row: FarmerStory
        Insert: Omit<FarmerStory, 'id' | 'created_at'>
        Update: Partial<Omit<FarmerStory, 'id'>>
      }
      recipes: {
        Row: Recipe
        Insert: Omit<Recipe, 'id' | 'created_at'>
        Update: Partial<Omit<Recipe, 'id'>>
      }
      sustainability_metrics: {
        Row: SustainabilityMetric
        Insert: Omit<SustainabilityMetric, 'id' | 'created_at'>
        Update: Partial<Omit<SustainabilityMetric, 'id'>>
      }
      user_favorites: {
        Row: UserFavorite
        Insert: Omit<UserFavorite, 'id' | 'created_at'>
        Update: Partial<Omit<UserFavorite, 'id'>>
      }
      view_history: {
        Row: ViewHistory
        Insert: Omit<ViewHistory, 'id' | 'viewed_at'>
        Update: Partial<Omit<ViewHistory, 'id'>>
      }
      producer_profiles: {
        Row: ProducerProfile
        Insert: Omit<ProducerProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProducerProfile, 'id'>>
      }
      producer_products: {
        Row: ProducerProduct
        Insert: Omit<ProducerProduct, 'id' | 'created_at'>
        Update: Partial<Omit<ProducerProduct, 'id'>>
      }
    }
  }
}

// Core Types
export interface Product {
  id: string
  display_id: string
  name: string
  scientific_name: string | null
  variety: string | null
  origin_country: string
  origin_region: string | null
  farm_id: string | null
  harvest_date: string | null
  price_per_kg: number | null
  transport_distance_km: number | null
  emissions_co2e_per_kg: number | null
  image_url: string | null
  qr_code: string | null
  created_at: string
  updated_at: string
}

export interface Farm {
  id: string
  name: string
  full_address: string | null
  region: string | null
  country: string
  coordinates: { lat: number; lng: number } | null
  distance_km: number | null
  our_story?: string | null
  what_drives_us?: string[] | null
  life_on_farm?: string | null
  looking_ahead?: string | null
  image_url?: string | null
  created_at: string
}

export interface Store {
  id: string
  name: string
  address: string | null
  coordinates: { lat: number; lng: number } | null
  distance_m: number | null
  created_at: string
}

export interface ProductLabel {
  id: string
  product_id: string
  label_name: string
  blockchain_verified?: boolean | null
  created_at: string
}

export interface QualityIndicator {
  id: string
  product_id: string
  indicator_type: 'freshness' | 'ripeness' | 'shelf_life'
  score: number | null
  max_score: number
  percentage: number | null
  description: string | null
  shelf_life_remaining_days: number | null
  created_at: string
}

// VegiChain Types (Blockchain Simulation)
export interface SupplyChainBlock {
  id: string
  product_id: string
  block_index: number
  block_hash: string
  previous_hash: string | null
  event_type: 'harvest' | 'package' | 'transport' | 'distribution' | 'store_arrival'
  location_name: string
  location_type: 'farm' | 'packaging_center' | 'distribution_center' | 'store' | null
  actor_name: string | null
  coordinates: { lat: number; lng: number } | null
  distance_from_store_km: number | null
  storage_type: 'ambient' | 'refrigerated' | 'frozen' | null
  transport_method: 'truck' | 'refrigerated_truck' | 'ship' | 'rail' | null
  timestamp: string
  details: Record<string, unknown>
  blockchain_verified?: boolean | null
  created_at: string
}

export interface CertificationBlock {
  id: string
  product_id: string
  block_index: number
  block_hash: string
  previous_hash: string | null
  cert_type: string
  certifying_body: string | null
  certifying_body_code: string | null
  certificate_id: string | null
  audit_date: string | null
  expiry_date: string | null
  auditor_name: string | null
  audit_findings: string | null
  timestamp: string
  blockchain_verified?: boolean | null
  created_at: string
}

export interface FarmingPractice {
  id: string
  farm_id: string
  category: 'soil_inputs' | 'water_management' | 'pest_control' | 'biodiversity' | 'labor_conditions'
  icon_type: string | null
  practices: string[]
  created_at: string
}

export interface FarmerStory {
  id: string
  farm_id: string
  farmer_name: string
  title: string | null
  story_content: string | null
  quote: string | null
  image_url: string | null
  years_farming: number | null
  created_at: string
}

export interface Recipe {
  id: string
  product_id: string
  title: string
  description: string | null
  cultural_origin: string | null
  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number | null
  ingredients: { name: string; amount: string }[]
  instructions: string[]
  image_url: string | null
  created_at: string
}

export interface SustainabilityMetric {
  id: string
  product_id: string
  co2e_per_kg: number | null
  water_usage_l_per_kg: number | null
  land_use_m2_per_kg: number | null
  energy_kwh_per_kg: number | null
  notes: string | null
  created_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export interface ViewHistory {
  id: string
  user_id: string
  product_id: string
  viewed_at: string
  metadata?: Record<string, unknown> | null
}

export interface ProducerProfile {
  id: string
  user_id: string
  company_name: string
  contact_email: string | null
  contact_phone: string | null
  country: string | null
  created_at: string
  updated_at: string
}

export interface ProducerProduct {
  id: string
  producer_id: string
  product_id: string
  created_at: string
}

// Extended types with relations
export interface ProductWithRelations extends Product {
  farm?: Farm
  labels?: ProductLabel[]
  quality_indicators?: QualityIndicator[]
  supply_chain?: SupplyChainBlock[]
  certifications?: CertificationBlock[]
  sustainability_metrics?: SustainabilityMetric | null
}

