import { Card, CardContent, CardFooter, CardHeader } from './card'

export interface CertificationInfo {
  label: string
  value: string
}

export interface CertificationCardProps {
  logo?: string // Emoji or image URL
  logoType?: 'emoji' | 'image'
  name: string
  code?: string // Optional code like "(PT-BIO-09)"
  info?: string // Optional info like "Last audit: 2025-03-05" or "Algarve, Portugal"
  description: string
  footerItems?: CertificationInfo[] // Array of label-value pairs for footer
}

export function CertificationCard({
  logo,
  logoType = 'emoji',
  name,
  code,
  info,
  description,
  footerItems = []
}: CertificationCardProps) {
  return (
    <Card>
      <CardHeader>
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Logo */}
          {logo && (
            <div 
              className="shrink-0 w-10 h-10 flex items-center justify-center"
            >
              {logoType === 'emoji' ? (
                <span 
                  className="text-xl"
                  style={logo === '✓' ? { color: 'var(--color-primary)' } : undefined}
                >
                  {logo}
                </span>
              ) : (
                <img 
                  src={logo} 
                  alt={`${name} logo`}
                  className="w-8 h-8 object-contain"
                />
              )}
            </div>
          )}
          
          {/* Name and Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 
                className="font-bold text-sm"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text)'
                }}
              >
                {name}
              </h3>
              {code && (
                <span 
                  className="text-xs"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-light)'
                  }}
                >
                  {code}
                </span>
              )}
            </div>
            {info && (
              <p 
                className="text-xs mt-1"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-light)'
                }}
              >
                {info}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Content: Description */}
        <p 
          className="text-sm"
          style={{ 
            fontFamily: 'var(--font-body)',
            lineHeight: 1.5,
            color: 'var(--color-text)'
          }}
        >
          {description}
        </p>
      </CardContent>
      
      {/* Footer: IDs and additional info */}
      {footerItems.length > 0 && (
        <CardFooter className="flex-col items-start">
          <div className="space-y-1 w-full">
            {footerItems.map((item, index) => (
              <p 
                key={index}
                className="text-xs"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-light)',
                  lineHeight: 1.4
                }}
              >
                <span className="font-medium">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

