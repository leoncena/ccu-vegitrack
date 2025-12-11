import { useNavigate, Link } from 'react-router-dom'
import { PageWrapper, PageHeaderWithBack } from '../components/layout'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '../components/ui/sonner'
import { useTranslation } from '../lib/i18n'

export default function MyAccount() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleDelete = () => {
    toast.info(t('account.deleteAccountDisabled'))
  }

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
          title={t('account.title')}
          backTo="/start"
          rightActions={<MenuToggleButton size="sm" />}
          marginBottom={`calc(var(--spacing-section) * 1.5)`}
        />

        {!user ? (
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
              {t('account.loggedOutTitle')}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--color-text)',
                opacity: 0.8,
              }}
            >
              {t('account.loggedOutBody')}
            </p>
            <div>
              <Button
                asChild
                style={{
                  borderRadius: 'var(--radius-button)',
                  minHeight: 'calc(var(--spacing-section) * 3.5)',
                  paddingInline: 'calc(var(--spacing-card) * 1.6)',
                  fontSize: '14px',
                  lineHeight: 1.2,
                }}
              >
                <Link to="/auth" state={{ from: '/account' }}>
                  {t('account.loginCta')}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(var(--spacing-section) * 1.25)',
            }}
          >
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-card) * 0.4)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}
                >
                  {t('account.detailsTitle')}
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(var(--spacing-card) * 0.5)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--color-text)',
                  }}
                >
                  <span><strong>{t('account.email')}</strong> {user.email}</span>
                  <span><strong>{t('account.userId')}</strong> {user.id}</span>
                </div>
              </div>
            </div>

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
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                {t('account.securityTitle')}
              </span>
              <Button
                className="h-[44px] text-[14px]"
                style={{ borderRadius: 'var(--radius-md)' }}
                onClick={() => navigate('/auth/update-password')}
              >
                {t('account.changePassword')}
              </Button>
              <Button
                variant="destructive"
                className="h-[44px] text-[14px]"
                style={{ borderRadius: 'var(--radius-md)' }}
                onClick={handleDelete}
              >
                {t('account.deleteAccount')}
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outline"
                className="h-[44px] text-[14px]"
                style={{ borderRadius: 'var(--radius-button)', width: '100%', maxWidth: '320px' }}
                onClick={async () => {
                  await signOut()
                  navigate('/start', { replace: true })
                }}
              >
                {t('account.logout')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
