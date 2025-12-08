import { forwardRef, type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'white',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    border: '1.5px solid var(--color-primary)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    border: 'none',
  },
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', style, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={{
          ...variantStyles[variant],
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          borderRadius: 'var(--radius-button)',
          cursor: 'pointer',
          transition: 'opacity 0.2s, transform 0.1s',
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

