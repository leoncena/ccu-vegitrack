import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { ShelfLifeIndicator, QualityRating } from '../../components/ui'

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
          <QualityRating 
            value={4}
            label="Freshness"
            description="hxHarvested67DaysAgo"
          />

          {/* Ripeness */}
          <QualityRating 
            value={5}
            label="Ripeness"
            description="hxBalancedPerfectRipenessIn67Days"
          />

          {/* Shelf Life */}
          <ShelfLifeIndicator 
            percentage={67}
            description="67%. hxBestConsumedWithin67_67Days"
          />
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

