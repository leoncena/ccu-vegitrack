import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createQRReader,
  defaultVideoConstraints,
  isFrameNotFound,
  releaseMediaStream,
  SCAN_THROTTLE_MS,
} from '../lib/qr-scanner'

export type PermissionStatus = 'unknown' | 'prompt' | 'granted' | 'denied'
export type ScannerStatus = 'idle' | 'requesting' | 'scanning' | 'stopped'

interface UseQRScannerOptions {
  onResult?: (text: string) => void
  throttleMs?: number
}

export function useQRScanner(options: UseQRScannerOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const readerRef = useRef(createQRReader())
  const streamRef = useRef<MediaStream | null>(null)
  const lastScanRef = useRef<number>(0)

  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('unknown')
  const [status, setStatus] = useState<ScannerStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(true)

  const stopScanning = useCallback(() => {
    readerRef.current.reset()
    releaseMediaStream(streamRef.current)
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setStatus('stopped')
  }, [])

  // Stop scanner on unmount
  useEffect(() => stopScanning, [stopScanning])

  // Check if a camera exists
  useEffect(() => {
    const detectDevices = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) return
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevice = devices.some((device) => device.kind === 'videoinput')
        setHasCamera(videoDevice)
        if (!videoDevice) {
          setStatus('stopped')
          setError('No camera found on this device.')
        }
      } catch (deviceError) {
        console.error('Error enumerating media devices', deviceError)
      }
    }

    void detectDevices()
  }, [])

  const attachStreamToVideo = useCallback(async (stream: MediaStream) => {
    if (!videoRef.current) return
    videoRef.current.srcObject = stream
    await videoRef.current.play().catch((playError) => {
      console.error('Error playing video element', playError)
    })
  }, [])

  const requestStream = useCallback(async () => {
    setStatus('requesting')
    setError(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setHasCamera(false)
      setPermissionStatus('denied')
      setStatus('stopped')
      throw new Error('Camera access is not supported in this browser.')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(defaultVideoConstraints)
      streamRef.current = stream
      setPermissionStatus('granted')
      await attachStreamToVideo(stream)
      return stream
    } catch (err) {
      releaseMediaStream(streamRef.current)
      streamRef.current = null

      const domError = err as DOMException
      if (domError?.name === 'NotAllowedError' || domError?.name === 'SecurityError') {
        setPermissionStatus('denied')
        setError('Camera permission denied. Please enable access in your browser settings.')
      } else if (domError?.name === 'NotFoundError') {
        setHasCamera(false)
        setError('No camera detected. Please connect a camera to scan QR codes.')
      } else {
        setPermissionStatus('prompt')
        setError('Unable to access camera. Please try again.')
      }
      setStatus('stopped')
      throw err
    }
  }, [attachStreamToVideo])

  const startDecoding = useCallback(async () => {
    if (!videoRef.current) return

    try {
      setStatus('scanning')
      await readerRef.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          const now = Date.now()
          const throttle = options.throttleMs ?? SCAN_THROTTLE_MS
          if (now - lastScanRef.current < throttle) return
          lastScanRef.current = now
          options.onResult?.(result.getText())
        }

        if (err && !isFrameNotFound(err)) {
          setError('Unable to read QR code. Adjust the camera and try again.')
        }
      })
    } catch (decodeError) {
      console.error('Failed to start QR decoding', decodeError)
      setError('Failed to start scanner.')
      setStatus('stopped')
    }
  }, [options.onResult, options.throttleMs])

  const startScanning = useCallback(async () => {
    if (!hasCamera) return
    try {
      await requestStream()
      await startDecoding()
    } catch {
      // Error state handled in requestStream/startDecoding
    }
  }, [hasCamera, requestStream, startDecoding])

  const restartScanning = useCallback(async () => {
    stopScanning()
    await startScanning()
  }, [startScanning, stopScanning])

  return {
    videoRef,
    permissionStatus,
    status,
    error,
    hasCamera,
    startScanning,
    stopScanning,
    restartScanning,
  }
}
