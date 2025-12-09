import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'

export default function OriginTransport() {
  const { id } = useParams()

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: 'var(--color-surface-light-green-back)', 
        paddingTop: '20px',
        paddingBottom: '60px',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <PageHeaderWithBack 
        title="Origin & Transport"
        backTo={`/product/${id}`}
      />

      {/* Map placeholder */}
      <div 
        className="h-48 mb-6 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-primary-light)'
        }}
      >
        <span className="text-4xl">🗺️</span>
      </div>

      {/* Supply chain timeline placeholder */}
      <div>
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
            📍 hxQuintaDoSol
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            06 July 2025 • 67 km away
          </p>
          <p className="text-xs opacity-60 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            hxHarvestedAtPeakRipenessAtDawn
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
            📦 hxPackagingCenter
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            06 July 2025 • 67 km away
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
            🚚 hxDistributionCenter
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            06 July 2025 • 67 km away
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
            🛒 hxMyAuchanLargoDaGraca
          </p>
          <p className="text-xs opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
            06 July 2025 • hxReadyForYou
          </p>
        </div>
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}

