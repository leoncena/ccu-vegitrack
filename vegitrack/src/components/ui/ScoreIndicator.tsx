interface ScoreIndicatorProps {
  score: number
  maxScore?: number
  label: string
  description?: string
}

export function ScoreIndicator({ score, maxScore = 5, label, description }: ScoreIndicatorProps) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </p>
      <div className="flex gap-1 mb-1">
        {Array.from({ length: maxScore }, (_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: i < score ? 'var(--color-primary)' : 'var(--color-surface)',
            }}
          />
        ))}
      </div>
      {description && (
        <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
          {description}
        </p>
      )}
    </div>
  )
}

interface ProgressBarProps {
  percentage: number
  label: string
  description?: string
}

export function ProgressBar({ percentage, label, description }: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage))
  
  return (
    <div>
      <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </p>
      <div
        className="h-4 mb-1 overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '2px',
          border: '1px solid var(--color-primary)',
        }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: 'var(--color-primary)',
            borderRadius: '2px',
          }}
        />
      </div>
      {description && (
        <p className="text-xs italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
          {description}
        </p>
      )}
    </div>
  )
}

