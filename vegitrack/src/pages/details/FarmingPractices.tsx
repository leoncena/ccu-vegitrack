import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DebugFooter, PageHeaderWithBack } from '../../components/layout'
import { 
  FarmingPracticeCard, 
  FarmingHighlight,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../components/ui'

const HIGHLIGHTS = [
  {
    icon: '🌿',
    iconType: 'emoji' as const,
    title: 'Soil & Inputs'
  },
  {
    icon: '💧',
    iconType: 'emoji' as const,
    title: 'Water Management'
  },
  {
    icon: '🐛',
    iconType: 'emoji' as const,
    title: 'Pest Control'
  },
  {
    icon: '🦋',
    iconType: 'emoji' as const,
    title: 'Biodiversity'
  },
  {
    icon: '👨‍🌾',
    iconType: 'emoji' as const,
    title: 'Labor & Working Conditions'
  },
  {
    icon: '🌱',
    iconType: 'emoji' as const,
    title: 'Sustainable Practices'
  }
]

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
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) {
      return
    }

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateScrollState()
    api.on('select', updateScrollState)
    api.on('reInit', updateScrollState)

    return () => {
      api.off('select', updateScrollState)
      api.off('reInit', updateScrollState)
    }
  }, [api])

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
      <div 
        style={{ 
          marginBottom: 'calc(2 * var(--spacing-card))',
          position: 'relative'
        }}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
          }}
          className="w-full"
          style={{
            paddingLeft: 'calc(0.25 * var(--spacing-card))',
            paddingRight: 'calc(0.25 * var(--spacing-card))'
          }}
        >
          <CarouselContent 
            style={{
              marginLeft: `calc(-1 * var(--spacing-card))`
            }}
          >
            {HIGHLIGHTS.map((highlight, i) => (
              <CarouselItem 
                key={i} 
                className="basis-1/3"
                style={{
                  paddingLeft: 'var(--spacing-card)'
                }}
              >
                <FarmingHighlight
                  icon={highlight.icon}
                  iconType={highlight.iconType}
                  title={highlight.title}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {HIGHLIGHTS.length > 3 && (
            <>
              {canScrollPrev && (
                <CarouselPrevious 
                  style={{ left: '-12px', opacity: 0.5 }}
                />
              )}
              {canScrollNext && (
                <CarouselNext 
                  style={{ right: '-12px', opacity: 0.5 }}
                />
              )}
            </>
          )}
        </Carousel>
      </div>

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

