import { useEffect, useMemo, useState } from 'react'
import { Spinner } from '../ui'
import { ScannerOverlay } from './ScannerOverlay'
import { CameraPermissionPrompt } from './CameraPermissionPrompt'
import { ScanError } from './ScanError'
import { useQRScanner } from '../../hooks/useQRScanner'

interface QRScannerProps {
  onScan: (text: string) => void
  isLoading?: boolean
}

export function QRScanner({ onScan, isLoading }: QRScannerProps) {
  const [showError, setShowError] = useState<string | null>(null)

  const {
    videoRef,
    permissionStatus,
    status,
    error,
    hasCamera,
    startScanning,
    restartScanning,
  } = useQRScanner({ onResult: onScan })

  useEffect(() => {
    // Auto-start when component mounts
    void startScanning()
  }, [startScanning])

  useEffect(() => {
    if (error) setShowError(error)
  }, [error])

  const stateContent = useMemo(() => {
    if (!hasCamera) {
      return <ScanError message={showError || 'No camera found on this device.'} onRetry={restartScanning} />
    }

    if (permissionStatus === 'denied') {
      return <CameraPermissionPrompt onRequest={restartScanning} message={showError} />
    }

    if (status === 'requesting' || permissionStatus === 'prompt') {
      return <CameraPermissionPrompt onRequest={restartScanning} message={showError} />
    }

    if (status === 'stopped' && showError) {
      return <ScanError message={showError} onRetry={restartScanning} />
    }

    return null
  }, [hasCamera, permissionStatus, restartScanning, showError, status])

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-sm aspect-square relative rounded-lg overflow-hidden bg-black/30 border border-green-800">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          autoPlay
        />
        <ScannerOverlay />
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Spinner className="text-white" />
          </div>
        ) : null}
      </div>

      <div className="mt-4 w-full max-w-sm text-center text-white/80">
        <p className="text-sm">Position the QR code within the frame</p>
        <p className="text-xs text-white/60">The camera will scan automatically</p>
      </div>

      {stateContent ? <div className="mt-4 w-full">{stateContent}</div> : null}
    </div>
  )
}
