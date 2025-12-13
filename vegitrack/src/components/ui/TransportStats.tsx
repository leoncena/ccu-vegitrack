export interface TransportStat {
  icon: string
  label: string
  iconScale?: number // Optional scale factor (e.g., 0.5 for 50%)
}

interface TransportStatsProps {
  stats: TransportStat[]
}

export function TransportStats({ stats }: TransportStatsProps) {
  const iconHeight = 48 // Base height in px
  
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--spacing-card)',
        marginBottom: 'calc(2 * var(--spacing-card))',
        justifyContent: 'space-around',
        alignItems: 'flex-start', // Align to top so text aligns
      }}
    >
      {stats.map((stat, index) => {
        const scale = stat.iconScale || 1
        const scaledHeight = `${iconHeight * scale}px`
        
        return (
          <div
            key={index}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Icon - fixed height container, icon centered vertically */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${iconHeight}px`, // Fixed container height for alignment
                width: '100%',
              }}
            >
              <img
                src={stat.icon}
                alt={stat.label.split('\n')[0]}
                style={{
                  height: scaledHeight,
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Spacing between icon and text */}
            <div style={{ height: 'calc(0.5 * var(--spacing-card))' }} />

            {/* Title text with line breaks support - aligned to top */}
            <p
              className="text-xs text-center"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
                lineHeight: 1.4,
                margin: 0,
                whiteSpace: 'pre-line', // Allows \n to create line breaks
                alignSelf: 'stretch', // Make text container full width
              }}
            >
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}






