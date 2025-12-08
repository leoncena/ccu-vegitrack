import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
}

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ icon, label, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          'flex h-12 w-full items-center justify-center rounded-lg border border-transparent bg-[#e8ece3] transition-transform active:scale-[0.98]',
          className
        )}
        style={{ fontFamily: 'var(--font-body)' }}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

SocialButton.displayName = 'SocialButton'


