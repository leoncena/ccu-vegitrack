import { Card, CardContent, CardHeader } from './card'

export interface StoryBulletCardProps {
  title: string
  items: string[]
  showBullets?: boolean
  itemClassName?: string
}

export function StoryBulletCard({ 
  title, 
  items, 
  showBullets = true,
  itemClassName = 'text-sm',
}: StoryBulletCardProps) {
  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader>
        <h3
          className="font-bold text-sm"
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            marginBottom: '8px',
          }}
        >
          {title}
        </h3>
      </CardHeader>
      <CardContent style={{ flex: 1 }}>
        <ul
          className={showBullets ? 'list-disc space-y-1' : 'space-y-2'}
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            paddingLeft: showBullets ? 'calc(var(--spacing-card) + 8px)' : '16px',
            marginRight: showBullets ? 'var(--spacing-card)' : undefined,
          }}
        >
          {items.map((item, index) => (
            <li key={index} className={itemClassName} style={{ lineHeight: 1.4 }}>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
