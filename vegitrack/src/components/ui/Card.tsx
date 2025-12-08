import type { HTMLAttributes } from 'react'

type CardVariant = 'default' | 'elevated' | 'outline'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--color-card)',
  },
  elevated: {
    backgroundColor: 'var(--color-card)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  outline: {
    backgroundColor: 'transparent',
    border: '1.5px solid var(--color-primary-light)',
  },
}

export function Card({ 
  variant = 'default', 
  padding = 'md', 
  className = '', 
  style, 
  children, 
  ...props 
}: CardProps) {
  return (
    <div
      className={`${paddingStyles[padding]} ${className}`}
      style={{
        ...variantStyles[variant],
        borderRadius: 'var(--radius-card)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

