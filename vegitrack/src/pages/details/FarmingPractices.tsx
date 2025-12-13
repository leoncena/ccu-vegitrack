import { Link, useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  FarmingPracticeCard, 
  FarmingHighlightsCarousel,
} from '../../components/ui'
import { VerifiedBadge } from '../../components/features/VegiChain'

const PRACTICES = [
  {
    category: 'Soil & Inputs',
    icon: '🌿',
    items: [
      'No synthetic pesticides',
      'Organic fertilizer only',
      'Crop rotation to maintain soil health',
      'Natural composting methods'
    ]
  },
  {
    category: 'Water Management',
    icon: '💧',
    items: [
      'Drip irrigation system',
      'Water saving methods in place',
      'Rainwater collection',
      'Efficient scheduling to minimize waste'
    ]
  },
  {
    category: 'Pest Control',
    icon: '🐛',
    items: [
      'Biological pest control',
      'Natural predators encouraged',
      'No chemical sprays',
      'Companion planting strategy'
    ]
  },
  {
    category: 'Biodiversity',
    icon: '🦋',
    items: [
      'Wildflower strips for pollinators',
      'Native hedgerows maintained',
      'Bird nesting boxes installed and regularly maintained to support local bird populations throughout the year'
    ]
  },
  {
    category: 'Labor & Working Conditions',
    icon: '👨‍🌾',
    items: [
      'Seasonal workers hired under documented contracts',
      'Safety training required for greenhouse entry',
      'Verified in Fair Labor audit (06 July 2025)'
    ]
  }
]

export default function FarmingPractices() {
  const { id } = useParams()

  // Derive highlights from practices data
  const highlights = PRACTICES.map(practice => ({
    name: practice.category,
    logo: practice.icon
  }))

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

      {/* Farming Highlights Carousel */}
      <FarmingHighlightsCarousel items={highlights} />

      {/* Practice cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-card)' }}>
        {PRACTICES.map((practice, i) => (
          <FarmingPracticeCard
            key={i}
            title={practice.category}
            icon={practice.icon}
            iconType="emoji"
            items={practice.items}
          />
        ))}
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

