import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Mock stores data
const MOCK_STORES = [
  { id: '1', name: 'hxContinenteRuaDaPalma', distance_m: 67 },
  { id: '2', name: 'hxPingoDoceChaoDoLoureiro', distance_m: 67 },
  { id: '3', name: 'hxMyAuchanLargoDaGraca', distance_m: 67 },
  { id: '4', name: 'hxContinenteBomDiaChiado', distance_m: 67 },
]

export default function Start() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [showStores, setShowStores] = useState(false)

  const selectedStoreData = MOCK_STORES.find(s => s.id === selectedStore)

  const handleLogout = async () => {
    await signOut()
    navigate('/start', { replace: true })
  }

  return (
    <div 
      className="min-h-screen flex flex-col px-6 pt-16"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Header */}
      <div className="flex justify-end mb-8">
        <button className="p-2" style={{ color: 'var(--color-primary)' }}>
          {/* Menu icon placeholder */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
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
          <span className="text-5xl">V</span>egi<span className="text-5xl">T</span>rack
        </h1>
        <p 
          className="text-sm mt-1"
          style={{ 
            fontFamily: 'var(--font-body)', 
            color: 'var(--color-primary)' 
          }}
        >
          Know your veggies
        </p>
      </div>

      {/* Veggie icons row placeholder */}
      <div className="flex justify-center gap-2 mb-8 h-12">
        {/* TODO: Add veggie icons */}
      </div>

      {/* Store Selection */}
      <div className="mb-8">
        <p 
          className="text-sm mb-2"
          style={{ 
            fontFamily: 'var(--font-body)', 
            color: 'var(--color-primary)' 
          }}
        >
          Select your Store:
        </p>
        
        <button
          onClick={() => setShowStores(!showStores)}
          className="w-full p-3 text-left flex justify-between items-center"
          style={{ 
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)'
          }}
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {selectedStoreData?.name || 'Select a store...'}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Store dropdown */}
        {showStores && (
          <div 
            className="mt-1 overflow-hidden"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {MOCK_STORES.map(store => (
              <button
                key={store.id}
                onClick={() => {
                  setSelectedStore(store.id)
                  setShowStores(false)
                }}
                className="w-full p-3 text-left flex justify-between items-center hover:opacity-80"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  borderBottom: '1px solid var(--color-surface)'
                }}
              >
                <span>{store.name}</span>
                <span className="text-xs opacity-60">{store.distance_m}m</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Start Scanning Button */}
      <button
        onClick={() => navigate('/scan')}
        className="w-full py-4 mb-4"
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-card)',
          borderRadius: 'var(--radius-button)',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Start Scanning
      </button>

      {/* Login/User info */}
      {user ? (
        <div className="mb-8 text-center">
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
          className="mb-8 underline"
          style={{ 
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-text)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Login/Register
        </button>
      )}
    </div>
  )
}

