import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'

export const SCAN_THROTTLE_MS = 120 // ~10fps

export type QRCodeReader = BrowserMultiFormatReader

export function createQRReader() {
  return new BrowserMultiFormatReader()
}

export function releaseMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop())
}

export function isFrameNotFound(error: unknown) {
  return error instanceof NotFoundException
}

export const defaultVideoConstraints: MediaStreamConstraints = {
  video: {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  audio: false,
}
