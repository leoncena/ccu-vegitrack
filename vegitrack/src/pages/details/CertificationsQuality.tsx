import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  QualityIndicatorCard, 
  CertificationCard,
  type QualityIndicator 
} from '../../components/ui'

export default function CertificationsQuality() {
  const { id } = useParams()

  // Quality indicators data
  const qualityIndicators: QualityIndicator[] = [
    {
      type: 'rating',
      label: 'Freshness',
      value: 4,
      max: 5,
      description: 'Harvested 2 days ago'
    },
    {
      type: 'rating',
      label: 'Ripeness',
      value: 3,
      max: 5,
      description: 'Balanced. Perfect ripeness in 2 days.'
    },
    {
      type: 'progress',
      label: 'Shelf-Life Remaining',
      value: 67,
      description: '67% Best consumed within 6-7 days.'
    }
  ]

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
        title="Certifications & Quality"
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

        <QualityIndicatorCard indicators={qualityIndicators} />

        {/* Certifications */}
        <h2 
          className="text-base mb-3"
          style={{ 
            fontFamily: 'var(--font-body)', 
            fontWeight: 500,
            marginTop: 'calc(1 * var(--spacing-card))'
          }}
        >
          Certifications
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
          {/* EU Organic */}
          <CertificationCard
            logo="🌿"
            logoType="emoji"
            name="EU Organic"
            code="(PT-BIO-09)"
            info="Last audit: 2025-03-05"
            description="Grown according to EU organic regulations, without synthetic pesticides or chemical fertilizers."
            footerItems={[
              { label: 'Certifying body', value: 'PT-BIO-09' },
              { label: 'Certificate ID', value: 'QDS-ORG-2025-117' }
            ]}
          />

          {/* Fair Labor */}
          <CertificationCard
            logo="🤝"
            logoType="emoji"
            name="Fair Labor"
            info="Last audit: 2024-09-12"
            description="Seasonal workers employed under formal contracts, with documented wages, work hours, and safety procedures."
            footerItems={[
              { label: 'Audit', value: 'Independent social compliance audit' },
              { label: 'Auditor', value: 'AgroSocial Consultores' },
              { label: 'Findings', value: 'No major non-compliance reported' }
            ]}
          />

          {/* Local */}
          <CertificationCard
            logo="📍"
            logoType="emoji"
            name="Local"
            info="Algarve, Portugal"
            description="Cultivated and packed in the Algarve region, within Portugal, reducing transport distance and time from farm to store."
            footerItems={[
              { label: 'Farm', value: 'Quinta do Sol, Lagos, Algarve' },
              { label: 'Distance to this store', value: '~280 km by road' }
            ]}
          />
        </div>
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}

