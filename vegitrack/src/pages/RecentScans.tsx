import { Link } from 'react-router-dom'
import { PageWrapper, PageHeaderWithBack } from '../components/layout'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { useUserData } from '../contexts/UserDataContext'
import { useTranslation } from '../lib/i18n'

export default function RecentScans() {
  const { user } = useAuth()
  const { recentProducts } = useUserData()
  const { t } = useTranslation()
  const items = recentProducts.slice(0, 5)

  return (
    <PageWrapper
      className="flex flex-col"
      style={{ backgroundColor: 'var(--color-surface-light-green-back)' }}
    >
      <div
        className="w-full"
        style={{ paddingTop: 'calc(var(--spacing-section) * 1.25)', paddingLeft: '10%', paddingRight: '10%' }}
      >
        <PageHeaderWithBack
          title={t('recent.title')}
          backTo="/start"
          rightActions={<MenuToggleButton size="sm" />}
          marginBottom={`calc(var(--spacing-section) * 1.5)`}
        />

        {!user && (
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              borderRadius: 'var(--radius-card)',
              padding: 'calc(var(--spacing-section) * 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(var(--spacing-card) * 0.75)',
              boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color-text)',
              }}
            >
              {t('recent.loginTitle')}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--color-text)',
                opacity: 0.8,
              }}
            >
              {t('recent.loginBody')}
            </p>
            <div>
              <Button
                asChild
                style={{
                  borderRadius: 'var(--radius-button)',
                  minHeight: 'calc(var(--spacing-section) * 3.5)',
                  paddingInline: 'calc(var(--spacing-card) * 1.5)',
                  fontSize: '14px',
                  lineHeight: 1.2,
                }}
              >
                <Link to="/auth" state={{ from: '/recent-scans' }}>
                  {t('recent.loginCta')}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {user && (
          <div
            className="flex flex-col"
            style={{ gap: 'calc(var(--spacing-section) * 0.9)' }}
          >
            {items.length === 0 && (
              <div
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'calc(var(--spacing-section) * 1)',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text)',
                }}
              >
                  {t('recent.empty')}
              </div>
            )}

            {items.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'calc(var(--spacing-section) * 0.9)',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 'calc(var(--spacing-card) * 1)',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    width: 'calc(var(--spacing-section) * 4)',
                    height: 'calc(var(--spacing-section) * 4)',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--color-surface)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '24px' }}>🍅</span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.25)' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                    }}
                  >
                    {item.name}
                  </span>
                  {item.displayId && (
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        color: 'var(--color-text)',
                        opacity: 0.7,
                      }}
                    >
                      ID {item.displayId}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
