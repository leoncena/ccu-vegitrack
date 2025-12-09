import { Rating } from './rating'

interface QualityRatingProps {
  /**
   * The rating value (0 to max)
   */
  value: number
  /**
   * Maximum rating value
   * @default 5
   */
  max?: number
  /**
   * Label for the rating (e.g., "Freshness", "Ripeness")
   */
  label: string
  /**
   * Optional description text below the rating
   */
  description?: string
  /**
   * Size of the rating circles
   * @default "medium"
   */
  size?: "small" | "medium" | "large"
}

export function QualityRating({ 
  value, 
  max = 5,
  label, 
  description,
  size = "medium"
}: QualityRatingProps) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </p>
      <div className="mb-1">
        <Rating value={value} max={max} size={size} />
      </div>
      {description && (
        <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
          {description}
        </p>
      )}
    </div>
  )
}

