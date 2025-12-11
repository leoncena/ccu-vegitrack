import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/Button'
import { PageWrapper, PageHeaderWithBack } from '../components/layout'
import { MenuToggleButton } from '../components/layout/MenuToggleButton'
import { toast } from '../components/ui/sonner'
import { Spinner } from '../components/ui/spinner'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      // Use current origin with callback path
      // Supabase will redirect here after verifying the token
      const redirectTo = `${window.location.origin}/auth/callback?next=/auth/update-password`.trim()
      
      console.log('Sending password reset with redirectTo:', redirectTo)
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setMessage('Check your email for the password reset link!')
        toast.success('Password reset email sent! Please also check the spam folder and wait some minutes. Some emails can take longer to arrive.')
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
          <PageHeaderWithBack title="Reset Password" rightActions={<MenuToggleButton size="sm" />} />

          <div className="space-y-2 text-center">
            <h1
              className="text-[32px] leading-tight"
              style={{
                fontFamily: 'var(--font-brand)',
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              Forgot Password?
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-light)',
              }}
            >
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>

          <p
            className="text-center text-xs"
            style={{
              marginTop: 'calc(var(--spacing-section) * 1.2)',
              fontFamily: 'var(--font-body)',
              color: 'rgba(23, 78, 5, 0.7)',
            }}
          >
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="ml-1 font-semibold underline-offset-2"
              style={{ color: 'var(--color-primary)' }}
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </PageWrapper>
  )
}

