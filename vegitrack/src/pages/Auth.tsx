import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { PageWrapper } from '../components/layout/PageWrapper'
import { PageHeader } from '../components/layout/PageHeader'
import { SocialButton } from '../components/ui/SocialButton'
import { toast } from '../components/ui/sonner'
import googleIcon from '../assets/social/google.svg'
import facebookIcon from '../assets/social/facebook.svg'
import appleIcon from '../assets/social/apple.svg'

type AuthMode = 'signin' | 'signup'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Redirect if already logged in
  if (user) {
    const from = (location.state as { from?: string })?.from || '/start'
    navigate(from, { replace: true })
    return null
  }

  const isSignin = mode === 'signin'

  const handleSocialClick = (provider: string) => {
    toast.info(`${provider} login is not available in this demo. Please use email authentication.`)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          setError(signUpError.message)
        } else {
          setMessage('Check your email to confirm your account!')
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setError(signInError.message)
        } else {
          // Navigation will happen automatically via auth state change
          const from = (location.state as { from?: string })?.from || '/start'
          navigate(from, { replace: true })
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(isSignin ? 'signup' : 'signin')
    setError(null)
    setMessage(null)
  }

  return (
    <PageWrapper className="flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-(--color-primary)">
        <PageHeader backTo="/start" />
      </div>

      <div className="flex-1 px-6 pb-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2">
            <h1
              className="text-4xl tracking-tight"
              style={{
                fontFamily: 'var(--font-brand)',
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              <span className="text-5xl">V</span>egi<span className="text-5xl">T</span>rack
            </h1>
          </div>

          <div className="mb-8 space-y-1 text-center">
            <h2
              className="text-[32px] leading-tight"
              style={{
                fontFamily: 'var(--font-brand)',
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              {isSignin ? 'Welcome' : 'Create account'}
            </h2>
            <p
              className="text-xs"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-light)',
              }}
            >
              {isSignin ? 'Login with Email' : 'Sign up with Email'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.2px',
                }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="h-11 rounded-[10px] border-[1.5px] border-(--color-primary) text-text placeholder:text-text-light"
                style={{
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'transparent',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.2px',
                }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
                className="h-11 rounded-[10px] border-[1.5px] border-(--color-primary) text-text placeholder:text-text-light"
                style={{
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'transparent',
                }}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    toast.info('Password reset is not available in this demo. Please use email authentication.')
                  }
                  className="text-[11px] underline-offset-2"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(23, 78, 5, 0.6)',
                  }}
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-md px-3 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--color-error-surface)',
                  color: 'var(--color-error)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                className="rounded-md px-3 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--color-success-surface)',
                  color: 'var(--color-success)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="h-12 text-lg"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                backgroundColor: 'var(--color-primary)',
                color: '#e8ece3',
                borderRadius: '30px',
                marginTop: '0.5rem',
              }}
            >
              {loading ? (isSignin ? 'Signing in...' : 'Creating account...') : isSignin ? 'Log In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-xs">
            <span className="h-px flex-1 bg-primary/60" />
            <span
              className="text-[11px]"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'rgba(23, 78, 5, 0.7)',
              }}
            >
              OR
            </span>
            <span className="h-px flex-1 bg-primary/60" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <SocialButton
              label="Google"
              icon={<img src={googleIcon} alt="Google" className="h-6 w-6" />}
              onClick={() => handleSocialClick('Google')}
              disabled={loading}
            />
            <SocialButton
              label="Facebook"
              icon={<img src={facebookIcon} alt="Facebook" className="h-6 w-6" />}
              onClick={() => handleSocialClick('Facebook')}
              disabled={loading}
            />
            <SocialButton
              label="Apple"
              icon={<img src={appleIcon} alt="Apple" className="h-6 w-6" />}
              onClick={() => handleSocialClick('Apple')}
              disabled={loading}
            />
          </div>

          <p
            className="mt-6 text-center text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(23, 78, 5, 0.7)',
            }}
          >
            {isSignin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 font-semibold underline-offset-2"
              style={{ color: 'var(--color-primary)' }}
              disabled={loading}
            >
              {isSignin ? 'Register Now' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </PageWrapper>
  )
}

          

