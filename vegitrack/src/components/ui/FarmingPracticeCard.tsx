import { Card, CardContent, CardHeader } from './card'
import * as LucideIcons from 'lucide-react'
import type { ComponentType } from 'react'

export interface FarmingPracticeCardProps {
  title: string
  icon?: string | ComponentType<{ size?: number; style?: React.CSSProperties }> // Emoji string or Lucide icon component
  iconType?: 'emoji' | 'lucide'
  items: string[] // Array of bullet point items
}

export function FarmingPracticeCard({
  title,
  icon,
  iconType = 'emoji',
  items
}: FarmingPracticeCardProps) {
  // Render icon based on type
  const renderIcon = () => {
    if (!icon) return null
    
    if (iconType === 'lucide') {
      // If icon is a string, try to get the Lucide icon component
      if (typeof icon === 'string') {
        const IconComponent = (LucideIcons as unknown as Record<string, ComponentType<{ size?: number; style?: React.CSSProperties }>>)[icon]
        if (IconComponent) {
          return (
            <div 
              className="shrink-0 w-10 h-10 flex items-center justify-center"
            >
              <IconComponent 
                size={20} 
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
            className="shrink-0 w-10 h-10 flex items-center justify-center"
          >
            <IconComponent 
              size={20} 
              style={{ color: 'var(--color-primary)' }}
            />
          </div>
        )
      }
    } else {
      // Emoji - ensure icon is a string
      if (typeof icon === 'string') {
        return (
          <div 
            className="shrink-0 w-10 h-10 flex items-center justify-center"
          >
            <span className="text-xl">{icon}</span>
          </div>
        )
      }
    }
    
    return null
  }

  return (
    <Card>
      <CardHeader>
        {/* Header: Title and Icon */}
        <div className="flex items-center justify-between gap-3">
          {/* Title */}
          <h3 
            className="font-bold text-sm flex-1"
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)'
            }}
          >
            {title}
          </h3>
          
          {/* Icon */}
          {renderIcon()}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Bullet points */}
        <ul 
          className="list-disc space-y-1"
          style={{ 
            paddingLeft: 'calc(var(--spacing-card) + 8px)',
            marginRight: 'var(--spacing-card)'
          }}
        >
          {items.map((item, index) => (
            <li 
              key={index}
              className="text-sm"
              style={{ 
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text)',
                lineHeight: 1.4
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

