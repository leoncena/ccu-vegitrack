import { Card, CardContent } from './card'

export type SupplyChainType = 'origin' | 'packaging_center' | 'distribution_center' | 'supermarket'

export interface SupplyChainCardData {
  type: SupplyChainType
  title: string
  date: string
  distance: string // e.g., "230 km away"
  // Type-specific data
  description?: string // For origin: e.g., "Harvested at peak ripeness at dawn"
  packagingHours?: string // For packaging_center: "Packaged within: 7 hours"
  storageInfo?: string // For distribution_center: "Storage: Refrigerated"
  // For supermarket: third row is always "Ready for you to enjoy!"
}

interface SupplyChainCardProps {
  data: SupplyChainCardData
  icon: string // SVG path or icon source
}

const getThirdRowContent = (data: SupplyChainCardData): string => {
  switch (data.type) {
    case 'origin':
      return data.description || ''
    case 'packaging_center':
      return data.packagingHours ? `Packaged within: ${data.packagingHours}` : ''
    case 'distribution_center':
      return data.storageInfo ? data.storageInfo : ''
    case 'supermarket':
      return 'Ready for you to enjoy!'
    default:
      return ''
  }
}

export function SupplyChainCard({ data, icon }: SupplyChainCardProps) {
  const thirdRowContent = getThirdRowContent(data)
  
  // Parse distance: "230 km away" -> ["230 km", "away"]
  const distanceParts = data.distance.split(' ')
  const distanceKm = distanceParts.slice(0, 2).join(' ') // "230 km"
  const distanceAway = distanceParts.slice(2).join(' ') || 'away' // "away" (fallback if not present)

  return (
    <Card>
      <CardContent
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-card)',
        }}
      >
        {/* Left: Icon (10%) */}
        <div
          style={{
            width: '10%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <img
            src={icon}
            alt={data.type}
            style={{
              width: 'auto',
              height: '32px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Center: Content (flexible) */}
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
            {data.title}
          </p>

          {/* Row 2: Date */}
          <p
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-light)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {data.date}
          </p>

          {/* Row 3: Type-specific content */}
          {thirdRowContent && (
            <p
              className="text-xs"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-light)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {thirdRowContent}
            </p>
          )}
        </div>

        {/* Right: Distance (15%) */}
        <div
          style={{
            width: '15%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            className="text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-primary)',
              margin: 0,
              lineHeight: 1.4,
              whiteSpace: 'pre-line',
              textAlign: 'center',
            }}
          >
            {distanceKm}{'\n'}{distanceAway}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}







