import { Card, CardContent, CardHeader } from './card'

export interface StoryTextCardProps {
  title: string
  text: string
}

export function StoryTextCard({ title, text }: StoryTextCardProps) {
  return (
    <Card>
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
      <CardContent>
        <div
          className="text-sm"
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            lineHeight: 1.5,
          }}
        >
          <p>{text}</p>
        </div>
      </CardContent>
    </Card>
  )
}
