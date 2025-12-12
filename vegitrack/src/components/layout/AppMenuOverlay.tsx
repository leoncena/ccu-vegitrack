import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MenuToggleButton } from './MenuToggleButton'
import { useMenu, type LanguageOption } from '../../contexts/MenuContext'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from '../../lib/i18n'

interface NavItem {
  label: string
  to?: string
  onClick?: () => void
  trailingIcon?: React.ReactNode
}

export function AppMenuOverlay() {
  const { isOpen, close, language, setLanguage } = useMenu()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const isProductOrRecipeRoute = useMemo(
    () => location.pathname.startsWith('/product'),
    [location.pathname],
  )

  useEffect(() => {
    if (isProductOrRecipeRoute && isOpen) {
      close()
    }
  }, [close, isOpen, isProductOrRecipeRoute])

  const navItems: NavItem[] = useMemo(
    () => [
      { label: t('menu.blockchainAssurance') ?? 'Blockchain assurance', to: '/blockchain/assurance' },
      { label: t('menu.recentScans'), to: '/recent-scans' },
      { label: t('menu.favorites'), to: '/favorites' },
      { label: t('menu.myAccount'), to: '/account' },
      { label: 'Admin mode', to: '/admin' },
    ],
    [t],
  )

  const languages: LanguageOption[] = ['en-US', 'pt-PT', 'de-DE', 'sv-SE']

  const languageDisplayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([language], { type: 'language' })
    } catch (error) {
      console.warn('Language display names not supported', error)
      return null
    }
  }, [language])

  const fallbackLanguageLabels: Record<LanguageOption, string> = {
    'en-US': 'English (US)',
    'pt-PT': 'Português (Portugal)',
    'de-DE': 'Deutsch',
    'sv-SE': 'Svenska',
  }

  const getLanguageLabel = (code: LanguageOption) => languageDisplayNames?.of(code) ?? fallbackLanguageLabels[code]

  if (!isOpen || isProductOrRecipeRoute) {
    return null
  }

  const handleLogout = async () => {
    await signOut()
    close()
    navigate('/auth', { replace: true })
  }

  const overlay = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 60,
      }}
      onClick={close}
    >
      <div
        role="dialog"
        aria-label="Main menu"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(320px, calc(100vw - calc(var(--spacing-section) * 1.2) * 2))',
          minWidth: '232px',
          maxWidth: 'calc(var(--spacing-page) * 12)',
          maxHeight: 'calc(100vh - calc(var(--spacing-section) * 1.2) * 2)',
          backgroundColor: '#C3CBBC',
          margin: 'calc(var(--spacing-section) * 0.6)',
          padding: 'calc(var(--spacing-section) * 1.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(var(--spacing-card) * 1.5)',
          boxShadow: '-12px 0 32px rgba(0,0,0,0.12)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '20px',
              fontWeight: 400,
              color: 'black',
            }}
          >
            {t('menu.title')}
          </div>
          <MenuToggleButton label="Close menu" />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-section) * 0.9)' }}>
          {navItems.map((item) => {
            const content = (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  color: 'black',
                }}
              >
                <span>{item.label}</span>
                {item.trailingIcon}
              </div>
            )

            if (item.to) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={close}
                  style={{
                    textDecoration: 'none',
                    padding: 'calc(var(--spacing-card) * 0.6) 0',
                  }}
                >
                  {content}
                </Link>
              )
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.onClick?.()
                  close()
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 'calc(var(--spacing-card) * 0.6) 0',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {content}
              </button>
            )
          })}
        </nav>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(var(--spacing-card) * 0.9)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'black',
            }}
          >
            {t('menu.language')}
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.35)' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'black',
              }}
            >
              {getLanguageLabel(language)}
            </span>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as LanguageOption)}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  border: '1px solid rgba(23, 78, 5, 0.35)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'calc(var(--spacing-card) * 0.9) calc(var(--spacing-card) * 1)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'black',
                  appearance: 'none',
                }}
              >
                {languages.map((code) => (
                  <option key={code} value={code}>
                    {getLanguageLabel(code)}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  right: 'calc(var(--spacing-card) * 1)',
                  pointerEvents: 'none',
                  color: 'black',
                  fontSize: '16px',
                }}
              >
                ▼
              </span>
            </div>
          </label>
        </div>

        <div style={{ marginTop: 'auto' }}>
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'black',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {t('menu.logout')}
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={close}
              style={{
                color: 'black',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                textDecoration: 'underline',
              }}
            >
              {t('menu.login')}
            </Link>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
