import { useState, useEffect } from 'react'
import { FarmingHighlight } from './FarmingHighlight'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './carousel'

export interface HighlightItem {
  name: string
  logo: string
}

export interface FarmingHighlightsCarouselProps {
  items: HighlightItem[]
}

export function FarmingHighlightsCarousel({ items }: FarmingHighlightsCarouselProps) {
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
          {items.map((item, i) => (
            <CarouselItem 
              key={i} 
              className="basis-1/3"
              style={{
                paddingLeft: 'var(--spacing-card)'
              }}
            >
              <FarmingHighlight
                icon={item.logo}
                iconType="emoji"
                title={item.name}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 3 && (
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
  )
}
