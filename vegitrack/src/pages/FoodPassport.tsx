import { useParams, useNavigate, Link } from 'react-router-dom'

// Mock product data (matches Figma design)
const MOCK_PRODUCT = {
  id: 'sample-tomatoes-001',
  display_id: '3345667',
  name: "Solanum lycopersicum 'Trust' Cluster Tomatoes",
  origin_country: 'Portugal',
  origin_region: 'Algarve',
  farm_name: 'Quinta do Sol',
  distance_km: 230,
  harvest_days_ago: 2,
  transport_km: 350,
  emissions_co2e: 1.8,
  price_per_kg: 2.99,
  image_url: null, // TODO: Add image
  labels: [
    { name: 'Organic', color: '#174E05' },
    { name: 'Local', color: '#386A27' },
    { name: 'Greenhouse Grown', color: '#174E05' },
    { name: 'Freshly Harvested', color: '#386A27' },
  ],
}

export default function FoodPassport() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // In real app, fetch product by ID
  const product = MOCK_PRODUCT

  const detailSections = [
    { path: 'origin', label: 'Origin & Transportation', icon: '📍' },
    { path: 'certifications', label: 'Certifications & Quality', icon: '✓' },
    { path: 'farming', label: 'Farming Practices', icon: '🌱' },
    { path: 'farmer', label: 'Farmer Story', icon: '👨‍🌾' },
    { path: 'recipes', label: 'Cultural Recipes', icon: '🍳' },
  ]

  return (
    <div 
      className="min-h-screen pb-8"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-16 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span 
          className="text-sm opacity-60"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          ID {product.display_id}
        </span>
        <button 
          className="p-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Product Image */}
      <div className="flex justify-center mb-4">
        <div 
          className="w-48 h-48 flex items-center justify-center text-8xl"
          style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)' }}
        >
          🍅
        </div>
      </div>

      {/* Product Name */}
      <h1 
        className="text-center text-lg px-8 mb-2"
        style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
      >
        {product.name}
      </h1>

      {/* Origin & Farm */}
      <div 
        className="flex justify-center items-center gap-4 text-sm mb-4"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <span>📍 {product.origin_country}, {product.origin_region}</span>
        <span className="opacity-30">|</span>
        <span>{product.farm_name}</span>
        <span className="opacity-30">|</span>
        <span>{product.distance_km} km</span>
      </div>

      {/* Labels */}
      <div className="flex flex-wrap justify-center gap-2 px-6 mb-6">
        {product.labels.map((label, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderRadius: '15px',
              fontFamily: 'var(--font-body)'
            }}
          >
            {label.name}
          </span>
        ))}
      </div>

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
            {product.harvest_days_ago} days ago
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Transport</p>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            {product.transport_km} km
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Emissions</p>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            {product.emissions_co2e} kgCO₂e/kg
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>Price</p>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            €{product.price_per_kg}/kg
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
              to={`/product/${id}/${section.path}`}
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
            Alternative products will appear here...
          </p>
        </div>
      </div>
    </div>
  )
}

