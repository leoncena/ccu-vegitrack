import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function DebugFooter() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/start', { replace: true })
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 p-3 text-center border-t"
      style={{
        backgroundColor: 'var(--color-background)',
        borderTopColor: 'var(--color-primary-light)',
        borderTopWidth: '1px',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--color-text-light)',
        zIndex: 1000,
        maxWidth: '430px',
        margin: '0 auto',
      }}
    >
      {user ? (
        <span>
          Signed in as {user.email}{' '}
          <button
            onClick={handleLogout}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            (Click to logout)
          </button>
        </span>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  )
}

