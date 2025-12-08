interface StatItemProps {
  label: string
  value: string | number
  unit?: string
  icon?: string
}

export function StatItem({ label, value, unit, icon }: StatItemProps) {
  return (
    <div className="text-center">
      {icon && <span className="text-lg mb-1 block">{icon}</span>}
      <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </p>
      <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
        {value}{unit && <span className="text-xs font-normal opacity-70">{unit}</span>}
      </p>
    </div>
  )
}

interface StatGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
}

export function StatGrid({ children, columns = 4 }: StatGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div
      className={`grid ${gridCols[columns]} gap-2 p-4`}
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {children}
    </div>
  )
}

