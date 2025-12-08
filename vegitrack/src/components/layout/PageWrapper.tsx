import type { HTMLAttributes } from 'react'

type PageBackground = 'default' | 'surface'

interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  /** Background color variant */
  background?: PageBackground
  /** Add bottom padding for safe area */
  safeBottom?: boolean
}

const backgrounds: Record<PageBackground, string> = {
  default: 'var(--color-background)',
  surface: 'var(--color-surface)',
}

export function PageWrapper({
  background = 'default',
  safeBottom = true,
  className = '',
  style,
  children,
  ...props
}: PageWrapperProps) {
  return (
    <div
      className={`min-h-screen ${safeBottom ? 'pb-8' : ''} ${className}`}
      style={{
        backgroundColor: backgrounds[background],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

