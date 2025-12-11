import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/Button'
import { PageWrapper, PageHeaderWithBack } from '../components/layout'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'
import { toast } from '../components/ui/sonner'
import { Spinner } from '../components/ui/spinner'

export default function UpdatePassword() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      // Log for debugging
      console.log('UpdatePassword - URL:', window.location.href)
      console.log('UpdatePassword - Session:', !!session)

      // Check for hash fragments (Supabase redirects with session tokens after verification)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      // If we have tokens in hash, set the session (Supabase already verified)
      if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setError('Invalid or expired reset link. Please request a new password reset.')
            setVerifying(false)
            return
          }

          // Session established successfully - clear hash from URL
          window.history.replaceState(null, '', window.location.pathname)
          setVerifying(false)
          return
        } catch {
          setError('Error setting up session. Please try again.')
          setVerifying(false)
          return
        }
      }

      // Check if we already have a valid session
      if (session) {
        // User has a valid recovery session
        setVerifying(false)
        return
      }

      // Wait a moment for session to load (from AuthContext)
      const checkInterval = setInterval(() => {
        if (session) {
          setVerifying(false)
          clearInterval(checkInterval)
        }
      }, 100)

      // Timeout after 2 seconds if no session
      setTimeout(() => {
        clearInterval(checkInterval)
        if (!session) {
          setError('Invalid or missing reset link. Please request a new password reset.')
          setVerifying(false)
        }
      }, 2000)

      return () => clearInterval(checkInterval)
    }

    checkSession()
  }, [session])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        toast.success('Password updated successfully!')
        navigate('/auth', { replace: true })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper className="flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <div
        className="w-full pb-12"
        style={{ paddingTop: '20px', paddingLeft: '10%', paddingRight: '10%' }}
      >
        <div className="w-full">
          <PageHeaderWithBack title="Update Password" rightActions={<MenuToggleButton size="sm" />} />

          <div className="space-y-2 text-center">
            <h1
              className="text-[32px] leading-tight"
              style={{
                fontFamily: 'var(--font-brand)',
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              New Password
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-light)',
              }}
            >
              Enter your new password below
            </p>
          </div>

          {verifying ? (
            <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: '50vh' }}>
              <Spinner className="size-6 mb-4" style={{ color: 'var(--color-primary)' }} />
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-light)' }}>
                Verifying reset link...
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="password"
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.2px',
                }}
              >
                New Password
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
                className="h-[42px] rounded-[8px] border-[1.5px] border-(--color-primary) text-text placeholder:text-text-light"
                style={{
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'transparent',
                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                  paddingLeft: 'var(--spacing-card)',
                  paddingRight: 'var(--spacing-card)',
                }}
              />
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-body)',
                  marginTop: 'calc(var(--spacing-section) * 1.2)',
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.2px',
                }}
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
                className="h-[42px] rounded-[8px] border-[1.5px] border-(--color-primary) text-text placeholder:text-text-light"
                style={{
                  fontFamily: 'var(--font-body)',
                  backgroundColor: 'transparent',
                  marginTop: 'calc(var(--spacing-card) * 0.5)',
                  paddingLeft: 'var(--spacing-card)',
                  paddingRight: 'var(--spacing-card)',
                }}
              />
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

            <div
              className="flex justify-center"
              style={{
                marginTop: 'calc(var(--spacing-section) * 2.375)',
              }}
            >
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="h-[56px] w-[216px] text-[18px]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  backgroundColor: 'var(--color-primary)',
                  color: '#e8ece3',
                  borderRadius: '30px',
                }}
              >
                {loading && <Spinner className="size-4 mr-2" />}
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

