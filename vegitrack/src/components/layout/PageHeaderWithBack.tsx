import { useNavigate } from 'react-router-dom'
import { IconButton, BackIcon } from '../ui/IconButton'

interface PageHeaderWithBackProps {
  /** Text or ReactNode to display in the center of the header */
  title: React.ReactNode
  /** Optional callback for back button. If not provided, navigates to '/start' */
  onBack?: () => void
  /** Optional custom back route. Defaults to '/start' */
  backTo?: string
  /** Optional className for the header container */
  className?: string
  /** Optional inline styles for the header container */
  style?: React.CSSProperties
  /** Optional margin bottom. Defaults to responsive spacing */
  marginBottom?: string
  /** Optional right side content (e.g., menu button) */
  rightActions?: React.ReactNode
}

export function PageHeaderWithBack({
  title,
  onBack,
  backTo = '/start',
  className = '',
  style,
  marginBottom = 'calc(2 * 1.125em)',
  rightActions,
}: PageHeaderWithBackProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(backTo)
    }
  }

  return (
    <div
      className={`pt-6 pb-4 flex items-center justify-between relative ${className}`}
      aria-hidden
      style={{
        fontSize: '18px', // Base font size for calculation
        marginBottom,
        ...style,
      }}
    >
      <IconButton label="Go back" onClick={handleBack} className="text-(--color-primary)">
        <BackIcon size={24} />
      </IconButton>
      <div
        className="absolute left-1/2 -translate-x-1/2 text-[18px] leading-tight tracking-tight whitespace-nowrap px-2"
        style={{
          fontFamily: 'var(--font-brand)',
          color: 'var(--color-primary)',
          fontWeight: 700,
          maxWidth: 'calc(100% - 120px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </div>
      <div className="w-10 flex items-center justify-end gap-2">
        {rightActions}
      </div>
    </div>
  )
}

