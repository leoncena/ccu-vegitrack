import { useParams } from 'react-router-dom'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  FarmingPracticeCard, 
  FarmingHighlightsCarousel,
} from '../../components/ui'

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
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}

