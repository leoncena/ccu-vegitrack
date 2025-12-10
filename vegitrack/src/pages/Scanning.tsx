import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeaderWithBack, DebugFooter } from '../components/layout'
import { Button } from '../components/ui'
import { Combobox, type ComboboxOption } from '../components/ui/combobox'
import qrSampleImage from '../assets/scanner/qr_sample.svg'
import tomatoQrImage from '../assets/scanner/tomato_qr.svg'

// Available products for selection
const PRODUCT_OPTIONS: ComboboxOption[] = [
  { value: '11111111-2222-3333-4444-555555555555', label: 'Cluster Tomatoes (3345667)' },
  { value: '22222222-3333-4444-5555-666666666666', label: 'Cherry Tomatoes (3345668)' },
  { value: '33333333-4444-5555-6666-777777777777', label: 'Roma Tomatoes (3345669)' },
]

export default function Scanning() {
  const navigate = useNavigate()
  const [selectedProductId, setSelectedProductId] = useState<string>('')

  const handleOpenProduct = () => {
    if (selectedProductId) {
      navigate(`/product/${selectedProductId}`)
    }
  }

  return (
    <div 
      className="min-h-screen pb-8"
      style={{ 
        backgroundColor: 'var(--color-background)', 
        paddingTop: '20px',
        paddingBottom: '60px',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      {/* Header - using PageHeaderWithBack like detail pages */}
      <PageHeaderWithBack 
        title={
          <span style={{ color: 'var(--color-text-light)' }}>
            hxLIDLDelft
          </span>
        }
        backTo="/start"
        marginBottom={`calc(2 * 1.125em - var(--spacing-card))`}
      />

      {/* Title */}
      <h1 
        className="text-center"
        style={{ 
          fontFamily: 'var(--font-body)',
          fontSize: '24px',
          fontWeight: 500,
          letterSpacing: '-0.66px',
          color: 'var(--color-text)',
          marginBottom: 'calc(2 * var(--spacing-card))'
        }}
      >
        Scan a Product
      </h1>

      <div className="flex-1 flex flex-col items-center">
        {/* Scanner frame */}
        <div 
          className="w-full max-w-xs flex items-center justify-center relative"
          style={{ 
            aspectRatio: '1',
            backgroundColor: 'var(--color-background-frame)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'calc(2 * var(--spacing-card))',
            padding: 'calc(var(--spacing-card) * 2)'
          }}
        >
          {/* Overlay with 10% opacity green fill */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'rgba(23, 78, 5, 0.1)',
              borderRadius: 'var(--radius-md)',
              zIndex: 0
            }}
          />

          {/* Tomato QR code in the center */}
          <img 
            src={tomatoQrImage} 
            alt="Tomato QR code" 
            className="absolute"
            style={{ 
              width: '58px',
              height: '56px',
              zIndex: 2
            }}
          />
          
          {/* Corner brackets - centered scanning frame in the middle (70% from center) */}
          <div 
            className="absolute w-8 h-8 border-t-2 border-l-2" 
            style={{ 
              borderColor: 'var(--color-primary)',
              top: 'calc(50% - 70px)',
              left: 'calc(50% - 70px)',
              zIndex: 1
            }} 
          />
          <div 
            className="absolute w-8 h-8 border-t-2 border-r-2" 
            style={{ 
              borderColor: 'var(--color-primary)',
              top: 'calc(50% - 70px)',
              left: 'calc(50% + 38px)',
              zIndex: 1
            }} 
          />
          <div 
            className="absolute w-8 h-8 border-b-2 border-l-2" 
            style={{ 
              borderColor: 'var(--color-primary)',
              top: 'calc(50% + 38px)',
              left: 'calc(50% - 70px)',
              zIndex: 1
            }} 
          />
          <div 
            className="absolute w-8 h-8 border-b-2 border-r-2" 
            style={{ 
              borderColor: 'var(--color-primary)',
              top: 'calc(50% + 38px)',
              left: 'calc(50% + 38px)',
              zIndex: 1
            }} 
          />
        </div>

        {/* Info div with QR sample image and text */}
        <div 
          className="w-full max-w-xs flex items-center gap-3"
          style={{ 
            marginBottom: 'calc(2 * var(--spacing-card))'
          }}
        >
          <img 
            src={qrSampleImage} 
            alt="QR code example" 
            style={{ 
              width: '67px',
              height: '67px',
              flexShrink: 0
            }}
          />
          <p 
            className="text-sm flex-1"
            style={{ 
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)'
            }}
          >
            🍅 Look for this kind of QR code on product packaging or displays.
          </p>
        </div>

        {/* Debug Mode Section */}
        <div 
          className="w-full max-w-xs"
          style={{ 
            padding: 'calc(var(--spacing-card) * 1.5)',
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-card)'
          }}
        >
          <p 
            className="text-sm mb-3 text-center font-medium"
            style={{ 
              fontFamily: 'var(--font-body)', 
              color: 'var(--color-primary)'
            }}
          >
            Find your product without QR code
          </p>
          
          {/* Product selection combobox */}
          <div style={{ marginBottom: 'var(--spacing-card)' }}>
            <Combobox
              options={PRODUCT_OPTIONS}
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              placeholder="Select a product..."
              searchPlaceholder="Search products..."
              emptyText="No products found."
            />
          </div>

          {/* Open selected product button */}
          <Button
            onClick={handleOpenProduct}
            className="w-full"
            disabled={!selectedProductId}
            style={{ 
              borderRadius: 'var(--radius-md)'
            }}
          >
            Open selected product
          </Button>
        </div>
      </div>
      
      {/* Debug Footer */}
      <DebugFooter />
    </div>
  )
}
