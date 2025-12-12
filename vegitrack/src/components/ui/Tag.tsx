import type { HTMLAttributes } from 'react'

type TagSize = 'sm' | 'md'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string
  size?: TagSize
  icon?: string
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
}

export function Tag({ 
  color, 
  size = 'md', 
  icon, 
  className = '', 
  style, 
  children, 
  ...props 
}: TagProps) {
  const background = color ? `${color}1A` : 'var(--color-card)'
  const textColor = color || 'var(--color-text)'
  const borderColor = color ? `${color}80` : 'rgba(0,0,0,0.08)'
  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: background,
        color: textColor,
        borderRadius: '15px',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        border: `1px solid ${borderColor}`,
        letterSpacing: '-0.1px',
        ...style,
      }}
      {...props}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </span>
  )
}

