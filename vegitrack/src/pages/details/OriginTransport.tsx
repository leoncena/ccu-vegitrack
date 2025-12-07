import { useParams, useNavigate } from 'react-router-dom'

export default function OriginTransport() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-16 pb-4">
        <button 
          onClick={() => navigate(`/product/${id}`)}
          className="p-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h1 
        className="text-center text-xl mb-6"
        style={{ fontFamily: 'var(--font-body)', letterSpacing: '-0.66px' }}
      >
        Origin & Transportation
      </h1>

      {/* Map placeholder */}
      <div 
        className="mx-6 h-48 mb-6 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-primary-light)'
        }}
      >
        <span className="text-4xl">🗺️</span>
      </div>

      {/* Supply chain timeline placeholder */}
      <div className="px-6">
        <h2 
          className="text-base mb-3"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          Origin
        </h2>
        
        {/* VegiChain blocks will go here */}
        <div 
          className="p-4 mb-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-body)' }}>
            📍 Quinta do Sol
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            Nov 18, 2025 • 230 km away
          </p>
          <p className="text-xs opacity-60 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Harvested at peak ripeness at dawn
          </p>
        </div>

        <h2 
          className="text-base mb-3"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          Transportation
        </h2>

        {/* More chain blocks */}
        <div 
          className="p-4 mb-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-body)' }}>
            📦 Packaging Center
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            Nov 18, 2025 • 157 km away
          </p>
        </div>

        <div 
          className="p-4 mb-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-body)' }}>
            🚚 Distribution Center
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            Nov 19, 2025 • 80 km away
          </p>
        </div>

        <div 
          className="p-4 mb-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-body)' }}>
            🛒 My Auchan - Largo da Graça
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            Nov 20, 2025 • Ready for you!
          </p>
        </div>
      </div>
    </div>
  )
}

