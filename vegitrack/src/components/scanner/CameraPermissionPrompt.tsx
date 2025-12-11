import { Button } from '../ui'

interface CameraPermissionPromptProps {
  onRequest: () => void
  message?: string | null
}

export function CameraPermissionPrompt({ onRequest, message }: CameraPermissionPromptProps) {
  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-3">
      <p className="text-base text-white/80">Camera access is required to scan QR codes.</p>
      {message ? <p className="text-sm text-red-200">{message}</p> : null}
      <Button onClick={onRequest} className="w-full" style={{ borderRadius: 'var(--radius-md)' }}>
        Enable Camera
      </Button>
      <p className="text-xs text-white/60">If you previously denied access, allow camera permissions in your browser settings and try again.</p>
    </div>
  )
}
