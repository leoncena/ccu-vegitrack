import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  FarmingPracticeCard, 
  FarmingHighlightsCarousel,
  Spinner,
} from '../../components/ui'
import { VerifiedBadge } from '../../components/features/VegiChain'
import { getProductById, getProductByDisplayId, getFarmingPractices } from '../../lib/api'
import type { FarmingPractice } from '../../types/database'

// Category display name mapping
const categoryDisplayNames: Record<string, string> = {
  soil_inputs: 'Soil & Inputs',
  water_management: 'Water Management',
  pest_control: 'Pest Control',
  biodiversity: 'Biodiversity',
  labor_conditions: 'Labor & Working Conditions',
}

// Emoji mapping for categories
const categoryEmojis: Record<string, string> = {
  soil_inputs: '🌿',
  water_management: '💧',
  pest_control: '🐛',
  biodiversity: '🦋',
  labor_conditions: '👨‍🌾',
}

export default function FarmingPractices() {
  const { id } = useParams()
  const [practices, setPractices] = useState<FarmingPractice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch product by id or display_id
        let product = await getProductById(id)
        if (!product) {
          product = await getProductByDisplayId(id)
        }

        if (!product) {
          setError('Product not found')
          setLoading(false)
          return
        }

        if (!product.farm_id) {
          setError('Product does not have an associated farm')
          setLoading(false)
          return
        }

        // Fetch farming practices
        const practicesData = await getFarmingPractices(product.farm_id)
        setPractices(practicesData)
      } catch (err) {
        console.error('Error fetching farming practices:', err)
        setError('Failed to load farming practices')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Transform practices data to match UI structure
  const transformedPractices = practices.map(practice => ({
    id: practice.id,
    category: categoryDisplayNames[practice.category] || practice.category,
    icon: categoryEmojis[practice.category] || '🌱',
    items: practice.practices || [],
  }))

  // Derive highlights from practices data
  const highlights = transformedPractices.map(practice => ({
    name: practice.category,
    logo: practice.icon
  }))

  if (loading) {
    return (
      <div 
        className="min-h-screen pb-8 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--color-surface-light-green-back)', 
          paddingTop: '20px',
          paddingBottom: '60px',
          paddingLeft: '10%',
          paddingRight: '10%',
        }}
      >
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className="min-h-screen pb-8"
        style={{ 
          backgroundColor: 'var(--color-surface-light-green-back)', 
          paddingTop: '20px',
          paddingBottom: '60px',
          paddingLeft: '10%',
          paddingRight: '10%',
        }}
      >
        <PageHeaderWithBack 
          title="Farming Practices"
          backTo={`/product/${id}`}
        />
        <div style={{ padding: 'var(--spacing-card)', textAlign: 'center', color: 'var(--color-text)' }}>
          <p>{error}</p>
        </div>
        <DebugFooter />
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen pb-8"
      style={{ 
        backgroundColor: 'var(--color-surface-light-green-back)', 
        paddingTop: '20px',
        paddingBottom: '60px',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <PageHeaderWithBack 
        title="Farming Practices"
        backTo={`/product/${id}`}
      />

      {/* Farming Highlights Carousel - only show if we have practices */}
      {highlights.length > 0 && (
        <FarmingHighlightsCarousel items={highlights} />
      )}

      {/* Practice cards */}
      {transformedPractices.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
          {transformedPractices.map((practice) => (
            <FarmingPracticeCard
              key={practice.id}
              title={practice.category}
              icon={practice.icon}
              iconType="emoji"
              items={practice.items}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: 'var(--spacing-card)', textAlign: 'center', color: 'var(--color-text)' }}>
          <p>No farming practices data available</p>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing-card) * 0.5)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'calc(var(--spacing-section) * 1.5)',
          marginTop: 'calc(var(--spacing-section) * 1.5)',
          marginBottom: 'calc(var(--spacing-section) * 1.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--spacing-card) * 0.5)' }}>
          <VerifiedBadge size="md" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.25)' }}>
            <span className="text-xs" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text)' }}>
              Supply chain events anchored on VegiChain
            </span>
            <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>
              Harvest, packaging, cold-chain handoffs, and store arrival are hashed blocks to expose tampering.
            </span>
          </div>
        </div>
        <Link
          to="/blockchain/assurance"
          className="text-xs"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-primary)',
            textDecoration: 'underline',
            fontWeight: 600,
          }}
        >
          What this verification covers
        </Link>
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}

