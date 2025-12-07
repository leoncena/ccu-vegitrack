import { useParams, useNavigate } from 'react-router-dom'

export default function CertificationsQuality() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen pb-8"
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
        Certifications & Quality
      </h1>

      <div className="px-6">
        {/* Quality Indicators */}
        <h2 
          className="text-base mb-3"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          Quality Indicators
        </h2>

        <div 
          className="p-4 mb-6"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          {/* Freshness */}
          <div className="mb-4">
            <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>Freshness</p>
            <div className="flex gap-1 mb-1">
              {[1,2,3,4,5].map(i => (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: i <= 4 ? 'var(--color-primary)' : 'var(--color-surface)' }}
                />
              ))}
            </div>
            <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              Harvested 2 days ago
            </p>
          </div>

          {/* Ripeness */}
          <div className="mb-4">
            <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>Ripeness</p>
            <div className="flex gap-1 mb-1">
              {[1,2,3,4,5].map(i => (
                <div 
                  key={i} 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: i <= 3 ? 'var(--color-primary)' : 'var(--color-surface)' }}
                />
              ))}
            </div>
            <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              Balanced. Perfect ripeness in 2 days.
            </p>
          </div>

          {/* Shelf Life */}
          <div>
            <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>Shelf-Life Remaining</p>
            <div 
              className="h-4 mb-1"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderRadius: '2px',
                border: '1px solid var(--color-primary)'
              }}
            >
              <div 
                className="h-full"
                style={{ 
                  width: '82%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '2px'
                }}
              />
            </div>
            <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              82%. Best consumed within 7-10 days.
            </p>
          </div>
        </div>

        {/* Certifications */}
        <h2 
          className="text-base mb-3"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
        >
          Certifications
        </h2>

        {/* EU Organic */}
        <div 
          className="p-4 mb-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌿</span>
            <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>EU Organic</span>
            <span className="text-xs opacity-60">(PT-BIO-09)</span>
          </div>
          <p className="text-xs opacity-60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            Last audit: 2025-03-05
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
            Grown according to EU organic regulations, without synthetic pesticides or chemical fertilizers.
          </p>
        </div>

        {/* Fair Labor */}
        <div 
          className="p-4 mb-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🤝</span>
            <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>Fair Labor</span>
          </div>
          <p className="text-xs opacity-60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            Last audit: 2024-09-12
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
            Seasonal workers employed under formal contracts, with documented wages, work hours, and safety procedures.
          </p>
        </div>

        {/* Local */}
        <div 
          className="p-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📍</span>
            <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>Local</span>
          </div>
          <p className="text-xs opacity-60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            Algarve, Portugal
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
            Cultivated and packed in the Algarve region, within Portugal, reducing transport distance and time.
          </p>
        </div>
      </div>
    </div>
  )
}

