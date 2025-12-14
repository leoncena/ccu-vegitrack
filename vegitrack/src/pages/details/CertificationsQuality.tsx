import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  QualityIndicatorCard, 
  CertificationCard,
  Spinner,
  type QualityIndicator 
} from '../../components/ui'
import { VerifiedBadge } from '../../components/features/VegiChain'
import { getProductById, getProductByDisplayId, getQualityIndicators, getCertifications } from '../../lib/api'
import type { CertificationBlock } from '../../types/database'

// Certification emoji mapping
const certEmojis: Record<string, string> = {
  eu_organic: '🌿',
  fair_labor: '🤝',
  low_carbon: '🌍',
  local: '📍',
}

// Certification display name mapping
const certDisplayNames: Record<string, string> = {
  eu_organic: 'EU Organic',
  fair_labor: 'Fair Labor',
  low_carbon: 'Low Carbon',
  local: 'Local',
}

// Quality indicator label mapping
const qualityIndicatorLabels: Record<string, string> = {
  freshness: 'Freshness',
  ripeness: 'Ripeness',
  shelf_life: 'Shelf-Life Remaining',
}

export default function CertificationsQuality() {
  const { id } = useParams()
  const [qualityIndicators, setQualityIndicators] = useState<QualityIndicator[]>([])
  const [certifications, setCertifications] = useState<CertificationBlock[]>([])
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

        // Fetch quality indicators and certifications in parallel
        const [qualityData, certData] = await Promise.all([
          getQualityIndicators(product.id),
          getCertifications(product.id),
        ])

        // Transform quality indicators from DB format to component format
        const transformedQualityIndicators: QualityIndicator[] = qualityData.map(indicator => {
          const label = qualityIndicatorLabels[indicator.indicator_type] || indicator.indicator_type
          
          // Shelf life should always be a progress bar
          if (indicator.indicator_type === 'shelf_life') {
            const percentage = indicator.percentage ?? 0
            return {
              type: 'progress',
              label,
              value: percentage,
              description: indicator.description || `${percentage}% Best consumed within ${indicator.shelf_life_remaining_days || 'N/A'} days.`,
            }
          } else {
            // Freshness and ripeness are ratings
            return {
              type: 'rating',
              label,
              value: indicator.score || 0,
              max: indicator.max_score || 5,
              description: indicator.description || '',
            }
          }
        })

        setQualityIndicators(transformedQualityIndicators)
        setCertifications(certData)
      } catch (err) {
        console.error('Error fetching certifications and quality data:', err)
        setError('Failed to load certifications and quality data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Transform certifications to component format
  const transformedCertifications = certifications.map(cert => {
    const displayName = certDisplayNames[cert.cert_type] || cert.cert_type
    const emoji = certEmojis[cert.cert_type] || '✓'
    
    // Build info string (last audit date or expiry info)
    let info: string | undefined
    if (cert.audit_date) {
      info = `Last audit: ${new Date(cert.audit_date).toLocaleDateString()}`
    } else if (cert.expiry_date) {
      info = `Expires: ${new Date(cert.expiry_date).toLocaleDateString()}`
    }

    // Build footer items
    const footerItems: Array<{ label: string; value: string }> = []
    if (cert.certifying_body_code) {
      footerItems.push({ label: 'Certifying body', value: cert.certifying_body_code })
    }
    if (cert.certificate_id) {
      footerItems.push({ label: 'Certificate ID', value: cert.certificate_id })
    }
    if (cert.auditor_name) {
      footerItems.push({ label: 'Auditor', value: cert.auditor_name })
    }
    if (cert.audit_findings) {
      footerItems.push({ label: 'Findings', value: cert.audit_findings })
    }

    // Build description - use default based on cert_type
    const defaultDescriptions: Record<string, string> = {
      eu_organic: 'Grown according to EU organic regulations, without synthetic pesticides or chemical fertilizers.',
      fair_labor: 'Seasonal workers employed under formal contracts, with documented wages, work hours, and safety procedures.',
      low_carbon: 'Verified low carbon footprint through efficient farming practices, renewable energy use, and optimized logistics.',
      local: 'Cultivated and packed locally, reducing transport distance and time from farm to store.',
    }
    const description = defaultDescriptions[cert.cert_type] || 'Certified product meeting quality and sustainability standards.'

    return {
      id: cert.id,
      logo: emoji,
      logoType: 'emoji' as const,
      name: displayName,
      code: cert.certifying_body_code ? `(${cert.certifying_body_code})` : undefined,
      info,
      description,
      footerItems,
    }
  })

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
          title="Certifications & Quality"
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
        title="Certifications & Quality"
        backTo={`/product/${id}`}
      />

      <div>
        {/* Quality Indicators */}
        {qualityIndicators.length > 0 && (
          <>
            <h2 
              className="text-base mb-3"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
            >
              Quality Indicators
            </h2>

            <QualityIndicatorCard indicators={qualityIndicators} />
          </>
        )}

        {/* Certifications */}
        {transformedCertifications.length > 0 && (
          <>
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
              {transformedCertifications.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  logo={cert.logo}
                  logoType={cert.logoType}
                  name={cert.name}
                  code={cert.code}
                  info={cert.info}
                  description={cert.description}
                  footerItems={cert.footerItems}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {qualityIndicators.length === 0 && transformedCertifications.length === 0 && (
          <div style={{ padding: 'var(--spacing-card)', textAlign: 'center', color: 'var(--color-text)' }}>
            <p>No quality indicators or certifications data available</p>
          </div>
        )}
      </div>

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

