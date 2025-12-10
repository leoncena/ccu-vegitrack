import { useState, useEffect } from 'react'
import { Card } from './card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './carousel'

export interface FarmPicturesCarouselProps {
  images: string[]
  title?: string
}

export function FarmPicturesCarousel({ images, title = 'Pictures of the farm' }: FarmPicturesCarouselProps) {
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
    <div>
      <div
        className="font-bold text-sm mb-3"
        style={{ 
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
        }}
      >
        {title}
      </div>
      
      <div style={{ position: 'relative' }}>
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: images.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Card style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                    <img
                      src={image}
                      alt={`Farm picture ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              {canScrollPrev && (
                <CarouselPrevious 
                  style={{ left: '-12px', opacity: 0.9 }}
                />
              )}
              {canScrollNext && (
                <CarouselNext 
                  style={{ right: '-12px', opacity: 0.9 }}
                />
              )}
            </>
          )}
        </Carousel>
      </div>
    </div>
  )
}
