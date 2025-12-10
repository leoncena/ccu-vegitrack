import { Card, CardContent, CardHeader } from './card'

export interface StoryCardProps {
  title: string
  paragraphs: string[]
}

export function StoryCard({ title, paragraphs }: StoryCardProps) {
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
          className="text-sm space-y-3"
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            lineHeight: 1.5,
          }}
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
