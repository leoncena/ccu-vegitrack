import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * Handles Supabase auth callbacks (email confirmation, password recovery, etc.)
 * Based on Supabase docs: https://supabase.com/docs/guides/auth/auth-email-templates
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log the full URL for debugging
        console.log('Auth callback URL:', window.location.href)
        console.log('Search params:', Object.fromEntries(searchParams.entries()))
        console.log('Hash:', window.location.hash)

        // Get token_hash and type from URL query params
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type') as EmailOtpType | null
        const next = searchParams.get('next') || '/start'

        if (tokenHash && type) {
          // Verify the OTP token according to Supabase docs
          const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash: tokenHash,
          })

          if (error) {
            console.error('Error verifying OTP:', error)
            navigate('/auth?error=invalid_token', { replace: true })
            return
          }

          // After successful verification, redirect based on type
          if (type === 'recovery') {
            // Password recovery - redirect to update password page (or use next param)
            const nextUrl = searchParams.get('next') || '/auth/update-password'
            navigate(nextUrl, { replace: true })
          } else if (type === 'email') {
            // Email confirmation - redirect to auth page with success
            navigate('/auth?confirmed=true', { replace: true })
          } else {
            // Default: redirect to next URL or start page
            navigate(next, { replace: true })
          }
        } else {
          // Check hash params (PKCE flow) - Supabase often uses hash fragments
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          const hashType = hashParams.get('type')

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (sessionError) {
              console.error('Error setting session:', sessionError)
              navigate('/auth?error=invalid_token', { replace: true })
              return
            }

            // Check if this is a recovery flow
            if (hashType === 'recovery') {
              navigate('/auth/update-password', { replace: true })
            } else {
              const nextUrl = searchParams.get('next') || '/start'
              navigate(nextUrl, { replace: true })
            }
          } else {
            // No auth parameters found - might be direct redirect to update-password
            // Check if we're already at update-password or should redirect there
            if (window.location.pathname.includes('update-password')) {
              // Already at update-password, let it handle the verification
              return
            }
            
            // No auth parameters found
            console.warn('No auth parameters found in callback URL')
            navigate('/auth?error=missing_token', { replace: true })
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/auth?error=callback_error', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  // Show loading state while processing
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-body)',
      }}
    >
      <p>Processing...</p>
    </div>
  )
}

