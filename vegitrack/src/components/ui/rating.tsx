import * as React from "react"

interface RatingProps {
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
   * The precision of the rating value
   * @default 1
   */
  precision?: number
  /**
   * Size of the rating circles
   * @default "medium"
   */
  size?: "small" | "medium" | "large"
  /**
   * Custom class name
   */
  className?: string
  /**
   * Custom styles
   */
  style?: React.CSSProperties
}

const sizeMap = {
  small: "w-2 h-2",
  medium: "w-3 h-3",
  large: "w-4 h-4",
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ 
    value, 
    max = 5, 
    precision = 1,
    size = "medium",
    className = "",
    style,
    ...props 
  }, ref) => {
    const clampedValue = Math.min(max, Math.max(0, value))
    const roundedValue = Math.round(clampedValue / precision) * precision
    
    return (
      <div
        ref={ref}
        className={`flex gap-1 ${className}`}
        style={style}
        role="img"
        aria-label={`Rating: ${roundedValue} out of ${max}`}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => {
          const index = i + 1
          const isFilled = index <= Math.floor(roundedValue)
          const isHalfFilled = precision < 1 && 
            roundedValue > i && 
            roundedValue < index && 
            roundedValue % 1 !== 0
          
          return (
            <div
              key={i}
              className={`${sizeMap[size]} rounded-full flex-shrink-0`}
              style={{
                backgroundColor: isFilled || isHalfFilled
                  ? 'var(--color-primary)' 
                  : 'var(--color-surface)',
                border: isFilled || isHalfFilled
                  ? 'none'
                  : '1px solid var(--color-primary)',
                opacity: isHalfFilled ? 0.5 : 1,
              }}
              aria-hidden="true"
            />
          )
        })}
      </div>
    )
  }
)

Rating.displayName = "Rating"

