import { Progress } from './progress'

interface ShelfLifeIndicatorProps {
  percentage: number
  description?: string
  label?: string
}

export function ShelfLifeIndicator({ 
  percentage, 
  description,
  label = "Shelf-Life Remaining"
}: ShelfLifeIndicatorProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage))
  
  return (
    <div>
      <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </p>
      <div className="mb-1">
        <Progress value={clampedPercentage} />
      </div>
      {description && (
        <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
          {description}
        </p>
      )}
    </div>
  )
}

