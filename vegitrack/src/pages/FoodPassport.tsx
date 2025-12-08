import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductById, getProductByDisplayId, getProductLabels, getAlternativeProducts } from '../lib/api'
import { supabase } from '../lib/supabase'
import type { Product, ProductLabel, Farm } from '../types/database'
import { Tag } from '../components/ui'
import { PageWrapper, PageHeader, DebugFooter } from '../components/layout'

interface ProductWithFarm extends Product {
  farm?: Farm | null
}

export default function FoodPassport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductWithFarm | null>(null)
  const [labels, setLabels] = useState<ProductLabel[]>([])
  const [alternatives, setAlternatives] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      
      setLoading(true)
      setError(null)

      try {
        // Try to fetch by UUID first, then by display_id
        let productData = await getProductById(id)
        
        if (!productData) {
          productData = await getProductByDisplayId(id)
        }

        if (!productData) {
          setError('Product not found')
          setLoading(false)
          return
        }

        // Fetch farm info if farm_id exists
        let farmData = null
        if (productData.farm_id) {
          const { data } = await supabase
            .from('farms')
            .select('*')
            .eq('id', productData.farm_id)
            .single()
          farmData = data
        }

        setProduct({ ...productData, farm: farmData })

        // Fetch labels and alternatives in parallel
        const [labelsData, alternativesData] = await Promise.all([
          getProductLabels(productData.id),
          getAlternativeProducts(productData.id),
        ])

        setLabels(labelsData)
        setAlternatives(alternativesData)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Calculate days since harvest
  const getDaysSinceHarvest = () => {
    if (!product?.harvest_date) return null
    const harvest = new Date(product.harvest_date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - harvest.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const detailSections = [
    { path: 'origin', label: 'Origin & Transportation', icon: '📍' },
    { path: 'certifications', label: 'Certifications & Quality', icon: '✓' },
    { path: 'farming', label: 'Farming Practices', icon: '🌱' },
    { path: 'farmer', label: 'Farmer Story', icon: '👨‍🌾' },
    { path: 'recipes', label: 'Cultural Recipes', icon: '🍳' },
  ]

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🍅</div>
            <p style={{ fontFamily: 'var(--font-body)' }}>Loading product...</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <PageHeader backTo="/scan" closeButton />
        <div className="flex flex-col items-center justify-center px-6 pt-20">
          <div className="text-6xl mb-4">🔍</div>
          <h1 
            className="text-xl mb-2"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
          >
            Product Not Found
          </h1>
          <p 
            className="text-sm opacity-60 text-center mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {error || 'We couldn\'t find this product. Please try scanning again.'}
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="px-6 py-3"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-body)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Back to Scanner
          </button>
        </div>
      </PageWrapper>
    )
  }

  const daysSinceHarvest = getDaysSinceHarvest()

  return (
    <PageWrapper style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <PageHeader 
        backTo="/scan" 
        closeButton 
        center={`ID ${product.display_id}`}
        showBookmark
      />

      {/* Product Image */}
      <div className="flex justify-center mb-4">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-48 h-48 object-cover"
            style={{ borderRadius: 'var(--radius-card)' }}
          />
        ) : (
          <div 
            className="w-48 h-48 flex items-center justify-center text-8xl"
            style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)' }}
          >
            🍅
          </div>
        )}
      </div>

      {/* Product Name */}
      <h1 
        className="text-center text-lg px-8 mb-2"
        style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
      >
        {product.scientific_name ? `${product.scientific_name} '${product.variety}'` : ''} {product.name}
      </h1>

      {/* Origin & Farm */}
      <div 
        className="flex justify-center items-center gap-2 text-sm mb-4 flex-wrap px-6"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <span>📍 {product.origin_country}{product.origin_region ? `, ${product.origin_region}` : ''}</span>
        {product.farm && (
          <>
            <span className="opacity-30">|</span>
            <span>{product.farm.name}</span>
          </>
        )}
        {product.transport_distance_km && (
          <>
            <span className="opacity-30">|</span>
            <span>{product.transport_distance_km} km</span>
          </>
        )}
      </div>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 px-6 mb-6">
          {labels.map((label) => (
            <Tag key={label.id} color={label.label_color || undefined}>
              {label.label_name}
            </Tag>
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div 
        className="grid grid-cols-4 gap-2 mx-6 p-4 mb-6"
        style={{ 
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-card)'
        }}
      >
        <div className="text-center">
          <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Harvested</p>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            {daysSinceHarvest !== null ? `${daysSinceHarvest}d ago` : '—'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Transport</p>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            {product.transport_distance_km ? `${product.transport_distance_km} km` : '—'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Emissions</p>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            {product.emissions_co2e_per_kg ? `${product.emissions_co2e_per_kg} kg` : '—'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Price</p>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            {product.price_per_kg ? `€${product.price_per_kg}/kg` : '—'}
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-6">
        <h2 
          className="text-base mb-3"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          Details
        </h2>
        
        <div className="h-px bg-gray-200 mb-4" />

        {/* Detail navigation grid */}
        <div className="grid grid-cols-2 gap-3">
          {detailSections.map((section) => (
            <Link
              key={section.path}
              to={`/product/${product.id}/${section.path}`}
              className="p-4 flex flex-col items-start"
              style={{ 
                backgroundColor: 'var(--color-card)',
                borderRadius: 'var(--radius-card)',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <span className="text-2xl mb-2">{section.icon}</span>
              <span 
                className="text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {section.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Alternatives Section */}
      <div className="px-6 mt-8">
        <h2 
          className="text-base mb-3"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          Alternatives
        </h2>
        
        {alternatives.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {alternatives.map((alt) => (
              <Link
                key={alt.id}
                to={`/product/${alt.id}`}
                className="flex-shrink-0 w-32 p-3"
                style={{ 
                  backgroundColor: 'var(--color-card)',
                  borderRadius: 'var(--radius-card)',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                {alt.image_url ? (
                  <img 
                    src={alt.image_url} 
                    alt={alt.name}
                    className="w-full h-20 object-cover mb-2"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  />
                ) : (
                  <div 
                    className="w-full h-20 flex items-center justify-center text-3xl mb-2"
                    style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}
                  >
                    🍅
                  </div>
                )}
                <p 
                  className="text-xs font-medium line-clamp-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {alt.name}
                </p>
                {alt.price_per_kg && (
                  <p 
                    className="text-xs opacity-60 mt-1"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    €{alt.price_per_kg}/kg
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div 
            className="p-4"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderRadius: 'var(--radius-card)'
            }}
          >
            <p 
              className="text-sm opacity-60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              No alternatives available
            </p>
          </div>
        )}
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </PageWrapper>
  )
}
