import type { ToasterProps } from 'sonner'
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

const sharedToastStyles = {
  style: {
    background: 'var(--color-card)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    fontFamily: 'var(--font-body)',
  },
  className: 'shadow-sm',
}

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-center"
      theme="light"
      closeButton={false}
      duration={3000}
      toastOptions={sharedToastStyles}
      {...props}
    />
  )
}

export const toast = sonnerToast


