import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function ScannerOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden rounded-lg pointer-events-none',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-green-900/10" />

      <div className="absolute w-10 h-10 border-2 border-green-700" style={{ top: '10%', left: '10%', borderRight: 'none', borderBottom: 'none' }} />
      <div className="absolute w-10 h-10 border-2 border-green-700" style={{ top: '10%', right: '10%', borderLeft: 'none', borderBottom: 'none' }} />
      <div className="absolute w-10 h-10 border-2 border-green-700" style={{ bottom: '10%', left: '10%', borderRight: 'none', borderTop: 'none' }} />
      <div className="absolute w-10 h-10 border-2 border-green-700" style={{ bottom: '10%', right: '10%', borderLeft: 'none', borderTop: 'none' }} />
    </div>
  )
}
