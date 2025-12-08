import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl tracking-tight mb-2"
            style={{ 
              fontFamily: 'var(--font-brand)', 
              color: 'var(--color-primary)',
              fontWeight: 700 
            }}
          >
            <span className="text-5xl">V</span>egi<span className="text-5xl">T</span>rack
          </h1>
          <p 
            className="text-sm"
            style={{ 
              fontFamily: 'var(--font-body)', 
              color: 'var(--color-primary)' 
            }}
          >
            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Auth Card */}
        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text)'
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
                style={{
                  fontFamily: 'var(--font-body)',
                  borderColor: 'var(--color-primary-light)',
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="password"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text)'
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
                style={{
                  fontFamily: 'var(--font-body)',
                  borderColor: 'var(--color-primary-light)',
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div 
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              style={{
                marginTop: '1rem',
              }}
            >
              {loading 
                ? (mode === 'signin' ? 'Signing in...' : 'Signing up...')
                : (mode === 'signin' ? 'Sign In' : 'Sign Up')
              }
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError(null)
                setMessage(null)
              }}
              disabled={loading}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
              }}
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </Card>

        {/* Back to Start */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/start')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--color-text-light)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ← Back to Start
          </button>
        </div>
      </div>
    </div>
  )
}

