import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, PageHeader } from '../components/layout'
import { Button } from '../components/ui'

// Real product UUID from the seeded database
const SAMPLE_PRODUCT_ID = '11111111-2222-3333-4444-555555555555'
// Also works with display_id
const SAMPLE_DISPLAY_ID = '3345667'

export default function Scanning() {
  const navigate = useNavigate()
  const [manualId, setManualId] = useState('')

  const handleDebugScan = () => {
    // Navigate using the real UUID from the database
    navigate(`/product/${SAMPLE_PRODUCT_ID}`)
  }

  const handleManualLookup = () => {
    if (manualId.trim()) {
      navigate(`/product/${manualId.trim()}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualLookup()
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader backTo="/start" />
      
      <div className="px-6">
        <span 
          className="text-sm opacity-70"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          hxLIDLDelft
        </span>
      </div>

      {/* Title */}
      <h1 
        className="text-center text-2xl mb-8 mt-4"
        style={{ fontFamily: 'var(--font-body)', letterSpacing: '-0.66px' }}
      >
        Scan a Product
      </h1>

      {/* Scanner area placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div 
          className="w-72 h-72 flex items-center justify-center mb-8"
          style={{ 
            backgroundColor: 'rgba(23, 78, 5, 0.1)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          {/* Scanner frame corners */}
          <div className="relative w-full h-full p-8">
            {/* Tomato icon placeholder */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-6xl opacity-50"
              style={{ color: 'var(--color-primary)' }}
            >
              🍅
            </div>
            
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: 'var(--color-primary)' }} />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: 'var(--color-primary)' }} />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: 'var(--color-primary)' }} />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: 'var(--color-primary)' }} />
          </div>
        </div>

        {/* Debug controls */}
        <div 
          className="w-full max-w-xs p-4 mb-4"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <p 
            className="text-sm mb-3 text-center font-medium"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}
          >
            Debug Mode
          </p>
          
          {/* Quick scan button */}
          <Button
            onClick={handleDebugScan}
            fullWidth
            className="mb-3"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Open Sample Product (Tomatoes)
          </Button>

          {/* Manual ID input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Try: ${SAMPLE_DISPLAY_ID}`}
              className="flex-1 px-3 py-2 text-sm"
              style={{ 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-primary)',
                fontFamily: 'var(--font-body)'
              }}
            />
            <Button
              onClick={handleManualLookup}
              variant="secondary"
              size="md"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Go
            </Button>
          </div>

          {/* Quick ID hints */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setManualId(SAMPLE_DISPLAY_ID)}
              className="text-xs px-2 py-1 opacity-70 hover:opacity-100"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)'
              }}
            >
              {SAMPLE_DISPLAY_ID}
            </button>
            <button
              onClick={() => setManualId('3345668')}
              className="text-xs px-2 py-1 opacity-70 hover:opacity-100"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)'
              }}
            >
              3345668 (Cherry)
            </button>
            <button
              onClick={() => setManualId('3345669')}
              className="text-xs px-2 py-1 opacity-70 hover:opacity-100"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)'
              }}
            >
              3345669 (Roma)
            </button>
          </div>
        </div>

        {/* Help text */}
        <p 
          className="text-center text-sm px-8 opacity-70"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          🍅 Look for this kind of QR code on product packaging or displays.
        </p>
      </div>
    </PageWrapper>
  )
}
