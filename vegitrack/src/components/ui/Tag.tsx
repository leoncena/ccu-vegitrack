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
  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: color ? `${color}15` : 'var(--color-card)',
        color: color || 'var(--color-text)',
        borderRadius: '15px',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        ...style,
      }}
      {...props}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </span>
  )
}

