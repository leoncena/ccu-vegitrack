interface PageTitleProps {
  children: React.ReactNode
  className?: string
}

export function PageTitle({ children, className = '' }: PageTitleProps) {
  return (
    <h1
      className={`text-center text-xl mb-6 ${className}`}
      style={{
        fontFamily: 'var(--font-body)',
        letterSpacing: '-0.66px',
        fontWeight: 500,
      }}
    >
      {children}
    </h1>
  )
}

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2
      className={`text-base mb-3 ${className}`}
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
      }}
    >
      {children}
    </h2>
  )
}

