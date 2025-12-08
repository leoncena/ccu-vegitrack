import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * Handles Supabase auth callbacks (email confirmation, password recovery, etc.)
 * Supabase redirects here after verifying tokens, then we redirect to the appropriate page
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from URL (Supabase adds this)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        // Also check query params (some flows use these)
        const queryType = searchParams.get('type')
        const tokenHash = searchParams.get('token_hash')

        // If we have tokens in the hash, exchange them for a session
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

          // Check the type to determine where to redirect
          const authType = type || queryType

          if (authType === 'recovery') {
            // Password recovery - redirect to update password page
            navigate('/auth/update-password', { replace: true })
          } else if (authType === 'email') {
            // Email confirmation - redirect to auth page with success
            navigate('/auth?confirmed=true', { replace: true })
          } else {
            // Default: redirect to start page
            navigate('/start', { replace: true })
          }
        } else if (tokenHash) {
          // If we have token_hash but no tokens, Supabase needs to verify it
          // This should be handled by Supabase automatically, but if not, redirect to update password
          if (queryType === 'recovery') {
            navigate('/auth/update-password', { replace: true })
          } else {
            navigate('/auth?error=invalid_token', { replace: true })
          }
        } else {
          // No auth parameters found
          navigate('/auth?error=missing_token', { replace: true })
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

