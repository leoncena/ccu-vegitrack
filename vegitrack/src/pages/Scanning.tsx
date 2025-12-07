import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Sample product ID for debug mode
const SAMPLE_PRODUCT_ID = 'sample-tomatoes-001'

export default function Scanning() {
  const navigate = useNavigate()
  const [manualId, setManualId] = useState('')

  const handleDebugScan = () => {
    navigate(`/product/${SAMPLE_PRODUCT_ID}`)
  }

  const handleManualLookup = () => {
    if (manualId.trim()) {
      navigate(`/product/${manualId.trim()}`)
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-16 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span 
          className="text-base"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          My Auchan - Largo da Graça
        </span>
      </div>

      {/* Title */}
      <h1 
        className="text-center text-2xl mb-8"
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
          <button
            onClick={handleDebugScan}
            className="w-full py-3 mb-3"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Open Sample Product (Tomatoes)
          </button>

          {/* Manual ID input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Enter product ID..."
              className="flex-1 px-3 py-2 text-sm"
              style={{ 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-primary)',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button
              onClick={handleManualLookup}
              className="px-4 py-2"
              style={{ 
                backgroundColor: 'var(--color-primary-light)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Go
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
    </div>
  )
}

