import { Card, CardContent } from './card'

export interface FarmerBioCardProps {
  imageUrl: string
  imageAlt: string
  farmName: string
  bio: string
}

export function FarmerBioCard({
  imageUrl,
  imageAlt,
  farmName,
  bio,
}: FarmerBioCardProps) {
  return (
    <Card>
      <CardContent style={{ padding: 'var(--spacing-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {/* Circular Profile Image */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        
        {/* Farm Name */}
        <h2
          className="font-bold text-lg"
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            textAlign: 'center',
          }}
        >
          {farmName}
        </h2>
        
        {/* Bio */}
        <p
          className="text-sm"
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {bio}
        </p>
      </CardContent>
    </Card>
  )
}
