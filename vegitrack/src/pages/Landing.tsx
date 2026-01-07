import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Import veggie icons for background
import carrotIcon from '../assets/wallpaper/carrot.svg'
import asparagusIcon from '../assets/wallpaper/asparagus.svg'
import lemonIcon from '../assets/wallpaper/Lemon.svg'
import tomatoIcon from '../assets/wallpaper/tomato.svg'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'

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
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{ 
        backgroundColor: '#297528ff', // Green passport cover to match branding
        width: '100%',
        padding: 'var(--spacing-page)',
        color: '#E8E1D4', // Gold/Cream text
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'calc(var(--spacing-section) * 1.25)',
          right: 'calc(var(--spacing-section) * 1.25)',
          zIndex: 20,
        }}
      >
        <MenuToggleButton color="#E8E1D4" />
      </div>

      {/* Passport Cover Border */}
      <div 
        className="absolute inset-4 border-2 border-[#E8E1D4] rounded-[var(--radius-card)] pointer-events-none"
        style={{ opacity: 0.5 }}
      />

      {/* Golden Icons Watermark */}
      <div 
        className="z-10 flex pointer-events-none"
        style={{ 
          opacity: 0.9,
          gap: 'var(--spacing-page)',
          marginBottom: 'calc(var(--spacing-section) * 2)'
        }}
      >
         <img src={carrotIcon} alt="" className="w-12 h-12" style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(13%) saturate(343%) hue-rotate(346deg) brightness(98%) contrast(92%)' }} />
         <img src={tomatoIcon} alt="" className="w-12 h-12" style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(13%) saturate(343%) hue-rotate(346deg) brightness(98%) contrast(92%)' }} />
         <img src={asparagusIcon} alt="" className="w-12 h-12" style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(13%) saturate(343%) hue-rotate(346deg) brightness(98%) contrast(92%)' }} />
         <img src={lemonIcon} alt="" className="w-12 h-12" style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(13%) saturate(343%) hue-rotate(346deg) brightness(98%) contrast(92%)' }} />
      </div>

      {/* Top Text */}
      <div 
        className="z-10 text-center"
        style={{ marginBottom: 'calc(var(--spacing-page) * 2)' }}
      >
        <h2 
          style={{ 
            fontFamily: 'var(--font-brand)', 
            fontSize: '24px', 
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontWeight: 700,
            opacity: 0.9,
          }}
        >
          VegiTrack
        </h2>
      </div>

      {/* Main Title */}
      <div className="z-10 text-center">
        <h1 
          style={{ 
            fontFamily: 'var(--font-brand)', 
            fontSize: '32px', 
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Vegetable<br/>Passport
        </h1>
      </div>

      {/* Tap to continue */}
      <button
        onClick={() => navigate('/start')}
        className="absolute bottom-12 left-0 right-0 text-center cursor-pointer z-10"
        style={{ 
          fontFamily: 'var(--font-body)', 
          color: '#E8E1D4',
          background: 'none',
          border: 'none',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}
      >
        Tap to open
      </button>
    </div>
  )
}

