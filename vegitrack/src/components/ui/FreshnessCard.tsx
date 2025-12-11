import { Check, X } from 'lucide-react'
import { Card, CardContent } from './card'

interface FreshnessCardProps {
  isFresh: boolean
  durationDays: number
  durationHours: number
}

export function FreshnessCard({ isFresh, durationDays, durationHours }: FreshnessCardProps) {
  const title = isFresh ? 'Freshness Guaranteed' : 'Freshness at risk'
  const interpretation = isFresh
    ? 'This product is considered fresh as it has spent less than average time in supply chain.'
    : 'The freshness of this product cannot be guaranteed as it has spent longer than usual in the supply chain.'

  const IconComponent = isFresh ? Check : X

  return (
    <Card>
      <CardContent
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-card)',
        }}
      >
        {/* Left: Icon */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <IconComponent
            size={48}
            style={{
              color: 'var(--color-primary)',
            }}
          />
        </div>

        {/* Right: Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'calc(0.25 * var(--spacing-card))',
            minHeight: 'fit-content',
          }}
        >
          {/* Row 1: Title */}
          <p
            className="text-sm"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              color: 'var(--color-text)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {title}
          </p>

          {/* Row 2: Duration */}
          <p
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {durationDays} {durationDays === 1 ? 'day' : 'days'}, {durationHours}{' '}
            {durationHours === 1 ? 'hour' : 'hours'}.
          </p>

          {/* Row 3: Interpretation */}
          <p
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {interpretation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
