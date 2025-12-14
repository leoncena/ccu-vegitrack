import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MapPin } from 'lucide-react'
import { Combobox, type ComboboxOption } from '../components/ui/combobox'
import { Button } from '../components/ui/Button'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'
import { useTranslation } from '../lib/i18n'
import { getAllStores } from '../lib/api'
import type { Store } from '../types/database'

// Import produce icons
import carrotIcon from '../assets/wallpaper/carrot.svg'
import asparagusIcon from '../assets/wallpaper/asparagus.svg'
import lemonIcon from '../assets/wallpaper/Lemon.svg'
import tomatoIcon from '../assets/wallpaper/tomato.svg'

export default function Start() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useTranslation()
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')

  useEffect(() => {
    async function loadStores() {
      try {
        const data = await getAllStores()
        setStores(data)
        if (data.length > 0) {
          setSelectedStore(data[0].id)
        }
      } catch (error) {
        console.error('Error loading stores:', error)
      }
    }
    loadStores()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/start', { replace: true })
  }

  const storeOptions: ComboboxOption[] = stores.map(store => ({
    value: store.id,
    label: `${store.name}${store.distance_m ? ` (${store.distance_m}m)` : ''}`,
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
        <MenuToggleButton color="var(--color-primary)" />
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
          {t('start.title')}
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
          {t('start.tagline')}
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
        {t('start.description')}
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
          {t('start.selectStore')}
        </p>
        
        <Combobox
          options={storeOptions}
          value={selectedStore}
          onValueChange={setSelectedStore}
          placeholder={t('start.storePlaceholder')}
          searchPlaceholder={t('start.storeSearchPlaceholder')}
          emptyText={t('start.storeEmpty')}
          rightIcon={MapPin}
          getDisplayValue={(option) => {
            if (!option) return ''
            const store = stores.find(s => s.id === option.value)
            return store ? store.name : option.label
          }}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Start Scanning Button and Login/User info */}
      <div style={{ marginBottom: 'calc(3 * var(--spacing-card))' }}>
        {/* Start Scanning Button */}
        <div className="flex justify-center" style={{ marginBottom: 'var(--spacing-card)' }}>
          <Button
            onClick={() => navigate('/scan')}
            variant="default"
            className="h-[56px] w-[216px] text-[18px]"
          >
            {t('start.cta')}
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
              {t('start.signedInAs', { email: user.email })}{' '}
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
                {t('start.logout')}
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
            {t('start.loginRegister')}
          </button>
        )}
      </div>
    </div>
  )
}

