import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/Button'
import { PageWrapper, PageHeaderWithBack } from '../components/layout'
import { toast } from '../components/ui/sonner'

export default function UpdatePassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we have the required hash params from email link
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (!tokenHash || type !== 'recovery') {
      setError('Invalid or missing reset link. Please request a new password reset.')
    }
  }, [searchParams])

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
          <PageHeaderWithBack title="Update Password" />

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
                variant="primary"
                fullWidth={false}
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
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

