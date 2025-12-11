import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Import veggie icons for background
import carrotIcon from '../assets/wallpaper/carrot.svg'
import asparagusIcon from '../assets/wallpaper/asparagus.svg'
import lemonIcon from '../assets/wallpaper/Lemon.svg'
import tomatoIcon from '../assets/wallpaper/tomato.svg'
import strawberryIcon from '../assets/wallpaper/strawberry.svg'
import caleIcon from '../assets/wallpaper/cale.svg'
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
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: '#fffefc', width: '100%' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'calc(var(--spacing-section) * 1.25)',
          right: 'calc(var(--spacing-section) * 1.25)',
          zIndex: 20,
        }}
      >
        <MenuToggleButton />
      </div>
      {/* Background vegetable pattern - reduced opacity to not interfere with text */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.2, zIndex: 0 }}>
        {/* Tomatoes - actual size: 40x39 */}
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '5%', top: '8%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '62%', top: '25%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '25%', top: '40%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '13%', top: '108%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '93%', top: '86%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '87%', top: '150%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '28%', top: '211%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '-2%', top: '183%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '62%', top: '205%', width: '40px', height: '39px' }} />
        <img src={tomatoIcon} alt="" style={{ position: 'absolute', left: '64%', top: '121%', width: '40px', height: '39px' }} />

        {/* Lemons - actual size: 52x51 */}
        <img src={lemonIcon} alt="" style={{ position: 'absolute', left: '47%', top: '9%', width: '52px', height: '51px', transform: 'rotate(180deg) scaleY(-1)' }} />
        <img src={lemonIcon} alt="" style={{ position: 'absolute', left: '83%', top: '34%', width: '52px', height: '51px' }} />
        <img src={lemonIcon} alt="" style={{ position: 'absolute', left: '-1%', top: '116%', width: '52px', height: '51px' }} />
        <img src={lemonIcon} alt="" style={{ position: 'absolute', left: '37%', top: '179%', width: '52px', height: '51px' }} />
        <img src={lemonIcon} alt="" style={{ position: 'absolute', left: '51%', top: '135%', width: '52px', height: '51px' }} />
        <img src={lemonIcon} alt="" style={{ position: 'absolute', left: '3%', top: '161%', width: '52px', height: '51px', transform: 'rotate(180deg) scaleY(-1)' }} />

        {/* Asparagus - actual size: 27x77 */}
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '65%', top: '-4%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '21%', top: '84%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '88%', top: '111%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '88%', top: '168%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '15%', top: '190%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '47%', top: '208%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '45%', top: '150%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '15%', top: '22%', width: '27px', height: '77px' }} />
        <img src={asparagusIcon} alt="" style={{ position: 'absolute', left: '70%', top: '37%', width: '27px', height: '77px' }} />

        {/* Strawberries - actual size: 23x29 */}
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '77%', top: '16%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '30%', top: '156%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '3%', top: '99%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '47%', top: '124%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '79%', top: '135%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '80%', top: '191%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '84%', top: '98%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '3%', top: '33%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '35%', top: '25%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '83%', top: '51%', width: '23px', height: '29px' }} />
        <img src={strawberryIcon} alt="" style={{ position: 'absolute', left: '20%', top: '59%', width: '23px', height: '29px' }} />

        {/* Carrots - actual size: 29x80 */}
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '88%', top: '3%', width: '29px', height: '80px' }} />
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '8%', top: '73%', width: '29px', height: '80px' }} />
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '48%', top: '31%', width: '29px', height: '80px' }} />
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '68%', top: '95%', width: '29px', height: '80px' }} />
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '4%', top: '205%', width: '29px', height: '80px' }} />
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '69%', top: '146%', width: '29px', height: '80px' }} />
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '23%', top: '170%', width: '29px', height: '80px' }} />
        <img src={carrotIcon} alt="" style={{ position: 'absolute', left: '30%', top: '113%', width: '29px', height: '80px' }} />

        {/* Lettuce/Cabbage (cale) - actual size: 77x84 */}
        <img src={caleIcon} alt="" style={{ position: 'absolute', left: '24%', top: '-4%', width: '77px', height: '84px' }} />
        <img src={caleIcon} alt="" style={{ position: 'absolute', left: '43%', top: '96%', width: '77px', height: '84px' }} />
        <img src={caleIcon} alt="" style={{ position: 'absolute', left: '92%', top: '110%', width: '77px', height: '84px' }} />
        <img src={caleIcon} alt="" style={{ position: 'absolute', left: '-3%', top: '49%', width: '77px', height: '84px' }} />
        <img src={caleIcon} alt="" style={{ position: 'absolute', left: '80%', top: '64%', width: '77px', height: '84px' }} />
      </div>

      {/* Logo - centered, on one line matching Figma */}
      <div 
        className="absolute text-center z-10"
        style={{ 
          fontFamily: 'var(--font-brand)', 
          color: '#174e05',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', lineHeight: '1' }}>
          <span style={{ fontSize: '90px', fontWeight: 700, letterSpacing: '-2.7px' }}>V</span>
          <span style={{ fontSize: '70px', fontWeight: 700, letterSpacing: '-2.1px' }}>egi</span>
          <span style={{ fontSize: '90px', fontWeight: 700, letterSpacing: '-4.5px' }}>T</span>
          <span style={{ fontSize: '70px', fontWeight: 700, letterSpacing: '-3.5px' }}>rack</span>
        </div>
      </div>

      {/* Tagline - bottom, matching Figma */}
      <div 
        className="absolute text-center z-10"
        style={{ 
          fontFamily: 'var(--font-body)', 
          color: '#174e05',
          fontSize: '20px',
          fontWeight: 600,
          bottom: 'calc(var(--spacing-section) * 8.5)', // ~136px from bottom, matching Figma positioning
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Know your veggies
      </div>

      {/* Tap to continue - below tagline */}
      <button
        onClick={() => navigate('/start')}
        className="absolute bottom-8 left-0 right-0 text-center cursor-pointer z-10"
        style={{ 
          fontFamily: 'var(--font-body)', 
          color: '#174e05',
          background: 'none',
          border: 'none',
          fontSize: '16px',
          fontWeight: 400,
        }}
      >
        Tap to continue
      </button>
    </div>
  )
}

