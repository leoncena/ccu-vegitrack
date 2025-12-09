import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle Supabase auth redirects that might land on the root URL
    // Check for hash fragments with auth tokens
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')

    console.log('Landing page - checking for auth redirect:', {
      hasHash: !!window.location.hash,
      hasTokens: !!(accessToken && refreshToken),
      type,
    })

    if (accessToken && refreshToken) {
      // Supabase has redirected here with session tokens
      console.log('Setting session from hash fragments')
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          console.error('Error setting session:', error)
          navigate('/auth?error=session_error', { replace: true })
          return
        }
        
        // Redirect based on type
        if (type === 'recovery') {
          console.log('Recovery flow - redirecting to update password')
          navigate('/auth/update-password', { replace: true })
        } else {
          console.log('Standard flow - redirecting to start')
          navigate('/start', { replace: true })
        }
      })
    }
  }, [navigate])

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 
          className="text-7xl tracking-tight"
          style={{ 
            fontFamily: 'var(--font-brand)', 
            color: 'var(--color-primary)',
            fontWeight: 700 
          }}
        >
          <span className="text-8xl">V</span>egi
          <span className="text-8xl">T</span>rack
        </h1>
        <p 
          className="text-xl mt-4"
          style={{ 
            fontFamily: 'var(--font-body)', 
            color: 'var(--color-primary)',
            fontWeight: 600 
          }}
        >
          Know your veggies
        </p>
      </div>

      {/* Veggie illustrations placeholder */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {/* TODO: Add veggie illustrations */}
      </div>

      {/* Tap to continue */}
      <button
        onClick={() => navigate('/start')}
        className="absolute bottom-20 left-0 right-0 text-center cursor-pointer"
        style={{ 
          fontFamily: 'var(--font-body)', 
          color: 'var(--color-primary)',
          background: 'none',
          border: 'none'
        }}
      >
        Tap to continue
      </button>
    </div>
  )
}

