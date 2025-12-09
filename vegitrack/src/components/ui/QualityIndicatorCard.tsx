import { Card, CardContent } from './card'
import { Rating } from './rating'
import { Progress } from './progress'

export interface QualityIndicator {
  type: 'rating' | 'progress'
  label: string
  value: number // For rating: 0-5, for progress: 0-100
  description: string
  max?: number // For rating, defaults to 5
}

interface QualityIndicatorCardProps {
  indicators: QualityIndicator[]
}

export function QualityIndicatorCard({ indicators }: QualityIndicatorCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {indicators.map((indicator, index) => (
            <div key={index}>
              {/* Label */}
              <p 
                className="text-sm mb-1.5"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text)',
                  marginTop: 'calc(0.25 * var(--spacing-card))'
                }}
              >
                {indicator.label}
              </p>
              
              {/* Row: Rating/Progress bar and Description text */}
              <div 
                className="flex items-center"
                style={{ gap: 'var(--spacing-card)' }}
              >
                {/* Left part: Rating/Progress bar */}
                <div style={{ width: '25%', flexShrink: 0, display: 'flex', justifyContent: 'flex-start' }}>
                  {indicator.type === 'rating' ? (
                    <Rating 
                      value={indicator.value} 
                      max={indicator.max || 5}
                      size="medium"
                    />
                  ) : (
                    <Progress value={indicator.value} />
                  )}
                </div>
                
                {/* Right part: Description text */}
                <div style={{ width: '70%', flexShrink: 0 }}>
                  <p 
                    className="text-xs"
                    style={{ 
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-light)',
                      lineHeight: 1.4
                    }}
                  >
                    {indicator.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

