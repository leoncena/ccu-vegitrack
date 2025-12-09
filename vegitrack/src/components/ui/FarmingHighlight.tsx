import * as LucideIcons from 'lucide-react'
import type { ComponentType } from 'react'

export interface FarmingHighlightProps {
  icon?: string | ComponentType<{ size?: number; style?: React.CSSProperties }>
  iconType?: 'emoji' | 'lucide' | 'image'
  title: string
}

export function FarmingHighlight({
  icon,
  iconType = 'emoji',
  title
}: FarmingHighlightProps) {
  // Render icon based on type
  const renderIcon = () => {
    if (!icon) return null
    
    const iconHeight = '48px' // Fixed height for all icons
    
    if (iconType === 'lucide') {
      // If icon is a string, try to get the Lucide icon component
      if (typeof icon === 'string') {
        const IconComponent = (LucideIcons as unknown as Record<string, ComponentType<{ size?: number; style?: React.CSSProperties }>>)[icon]
        if (IconComponent) {
          return (
            <div 
              className="flex items-start justify-center"
              style={{ height: iconHeight }}
            >
              <IconComponent 
                size={48} 
                style={{ color: 'var(--color-primary)' }}
              />
            </div>
          )
        }
      } else if (icon) {
        // If icon is already a component
        const IconComponent = icon
        return (
          <div 
            className="flex items-start justify-center"
            style={{ height: iconHeight }}
          >
            <IconComponent 
              size={48} 
              style={{ color: 'var(--color-primary)' }}
            />
          </div>
        )
      }
    } else if (iconType === 'image') {
      // Image
      if (typeof icon === 'string') {
        return (
          <div 
            className="flex items-start justify-center"
            style={{ height: iconHeight }}
          >
            <img 
              src={icon} 
              alt={title}
              style={{ 
                height: iconHeight,
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        )
      }
    } else {
      // Emoji
      if (typeof icon === 'string') {
        return (
          <div 
            className="flex items-start justify-center"
            style={{ height: iconHeight }}
          >
            <span className="text-4xl" style={{ lineHeight: 1 }}>{icon}</span>
          </div>
        )
      }
    }
    
    return null
  }

  return (
    <div 
      className="flex flex-col items-center w-full"
    >
      {/* Icon - fixed height, aligned to top */}
      {renderIcon()}
      
      {/* Spacing between icon and text */}
      <div style={{ height: 'calc(0.5 * var(--spacing-card))' }} />
      
      {/* Title text - aligned to top of text */}
      <p 
        className="text-xs text-center"
        style={{ 
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
          lineHeight: 1.4,
          margin: 0
        }}
      >
        {title}
      </p>
    </div>
  )
}

