import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, MapPin } from 'lucide-react'
import { Combobox, type ComboboxOption } from '../components/ui/combobox'
import { Button } from '../components/ui/Button'
import { IconButton } from '../components/ui/IconButton'

// Import produce icons
import carrotIcon from '../assets/wallpaper/carrot.svg'
import asparagusIcon from '../assets/wallpaper/asparagus.svg'
import lemonIcon from '../assets/wallpaper/Lemon.svg'
import tomatoIcon from '../assets/wallpaper/tomato.svg'

// Mock stores data
const MOCK_STORES = [
  { id: '1', name: 'Continente - Rua da Palma', distance_m: 250 },
  { id: '2', name: 'Pingo Doce - Chão do Loureiro', distance_m: 270 },
  { id: '3', name: 'My Auchan - Largo da Graça', distance_m: 850 },
  { id: '4', name: 'Continente Bom Dia - Chiado', distance_m: 550 },
]

export default function Start() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [selectedStore, setSelectedStore] = useState<string>(MOCK_STORES[0]?.id || '')

  const handleLogout = async () => {
    await signOut()
    navigate('/start', { replace: true })
  }

  const storeOptions: ComboboxOption[] = MOCK_STORES.map(store => ({
    value: store.id,
    label: `${store.name} (${store.distance_m}m)`,
  }))

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: 'var(--color-background)',
        paddingLeft: 'var(--spacing-page)',
        paddingRight: 'var(--spacing-page)',
        paddingTop: 'var(--spacing-page)',
        paddingBottom: 'calc(3 * var(--spacing-card) + env(safe-area-inset-bottom))',
      }}
    >
      {/* Header */}
      <div className="flex justify-end mb-6">
        <IconButton label="Menu" style={{ color: 'var(--color-primary)' }}>
          <Menu size={24} />
        </IconButton>
      </div>

      {/* Logo */}
      <div className="text-center mb-6">
        <h1 
          className="text-4xl tracking-tight"
          style={{ 
            fontFamily: 'var(--font-brand)', 
            color: 'var(--color-primary)',
            fontWeight: 700 
          }}
        >
          VegiTrack
        </h1>
        <p 
          className="text-sm"
          style={{ 
            fontFamily: 'var(--font-body)', 
            color: 'var(--color-primary)',
            marginTop: 'var(--spacing-card)',
            marginBottom: 'calc(2 * var(--spacing-card))',
          }}
        >
          Know your veggies
        </p>
      </div>

      {/* Veggie icons row */}
      <div className="flex justify-center gap-4 mb-6">
        <img src={carrotIcon} alt="Carrot" className="h-12 w-auto" />
        <img src={asparagusIcon} alt="Asparagus" className="h-12 w-auto" />
        <img src={lemonIcon} alt="Lemon" className="h-12 w-auto" />
        <img src={tomatoIcon} alt="Tomato" className="h-12 w-auto" />
      </div>

      {/* Descriptive text */}
      <p 
        className="text-center"
        style={{ 
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text)',
          lineHeight: '1.5',
          marginTop: 'calc(2 * var(--spacing-card))',
          marginBottom: 'calc(2 * var(--spacing-card))',
        }}
      >
        Scan fresh fruits and vegetables to explore its Food Passport – origin, transport, quality and sustainability aspects.
      </p>

      {/* Store Selection */}
      <div className="mb-6">
        <p 
          className="text-sm mb-2"
          style={{ 
            fontFamily: 'var(--font-body)', 
            color: 'var(--color-primary)' 
          }}
        >
          Select your Store:
        </p>
        
        <Combobox
          options={storeOptions}
          value={selectedStore}
          onValueChange={setSelectedStore}
          placeholder="Select a store..."
          searchPlaceholder="Search stores..."
          emptyText="No store found."
          rightIcon={MapPin}
          getDisplayValue={(option) => {
            if (!option) return ''
            const store = MOCK_STORES.find(s => s.id === option.value)
            return store ? store.name : option.label
          }}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Start Scanning Button */}
      <div className="flex justify-center" style={{ marginBottom: 'var(--spacing-card)' }}>
        <Button
          onClick={() => navigate('/scan')}
          variant="default"
          className="h-[56px] w-[216px] text-[18px]"
        >
          Start Scanning
        </Button>
      </div>

      {/* Login/User info */}
      {user ? (
        <div className="text-center">
          <p 
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--color-text-light)',
            }}
          >
            Signed in as {user.email}{' '}
            <button
              onClick={handleLogout}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              (Click to logout)
            </button>
          </p>
        </div>
      ) : (
        <button
          onClick={() => navigate('/auth', { state: { from: '/start' } })}
          className="text-center underline"
          style={{ 
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-text)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Login/Register
        </button>
      )}
    </div>
  )
}

