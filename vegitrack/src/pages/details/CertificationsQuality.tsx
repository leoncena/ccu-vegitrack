import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'

export default function CertificationsQuality() {
  const { id } = useParams()

  return (
    <div 
      className="min-h-screen pb-8"
      style={{ 
        backgroundColor: 'var(--color-surface)', 
        paddingTop: '20px',
        paddingBottom: '60px',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <PageHeaderWithBack 
        title="Certifications"
        backTo={`/product/${id}`}
      />

      <div>
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
                  style={{ backgroundColor: i <= 67 ? 'var(--color-primary)' : 'var(--color-surface)' }}
                />
              ))}
            </div>
            <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              hxHarvested67DaysAgo
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
                  style={{ backgroundColor: i <= 67 ? 'var(--color-primary)' : 'var(--color-surface)' }}
                />
              ))}
            </div>
            <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              hxBalancedPerfectRipenessIn67Days
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
                  width: '67%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '2px'
                }}
              />
            </div>
            <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              67%. hxBestConsumedWithin67_67Days
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
            <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>hxEUOrganic</span>
            <span className="text-xs opacity-60">(hxPT-BIO-999)</span>
          </div>
          <p className="text-xs opacity-60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            Last audit: 06 July 2025
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
            hxGrownAccordingToEUOrganicRegulationsWithoutSyntheticPesticidesOrChemicalFertilizers
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
            <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>hxFairLabor</span>
          </div>
          <p className="text-xs opacity-60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            Last audit: 06 July 2025
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
            hxSeasonalWorkersEmployedUnderFormalContractsWithDocumentedWagesWorkHoursAndSafetyProcedures
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
            <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>hxLocal</span>
          </div>
          <p className="text-xs opacity-60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            hxAlgarvePortugal
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
            hxCultivatedAndPackedInTheAlgarveRegionWithinPortugalReducingTransportDistanceAndTime
          </p>
        </div>
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}

