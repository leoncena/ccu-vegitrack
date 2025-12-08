import { useNavigate } from 'react-router-dom'
import { IconButton, BackIcon, CloseIcon, BookmarkIcon } from '../ui/IconButton'

interface PageHeaderProps {
  /** Custom back destination, or -1 to go back in history */
  backTo?: string | number
  /** Show close button instead of back arrow */
  closeButton?: boolean
  /** Center content (e.g., product ID) */
  center?: React.ReactNode
  /** Show bookmark button */
  showBookmark?: boolean
  /** Bookmark filled state */
  isBookmarked?: boolean
  /** Bookmark click handler */
  onBookmarkClick?: () => void
  /** Right side actions */
  rightActions?: React.ReactNode
}

export function PageHeader({
  backTo = -1,
  closeButton = false,
  center,
  showBookmark = false,
  isBookmarked = false,
  onBookmarkClick,
  rightActions,
}: PageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (typeof backTo === 'number') {
      navigate(backTo)
    } else {
      navigate(backTo)
    }
  }

  return (
    <div className="flex items-center justify-between px-6 pt-14 pb-4">
      <IconButton label={closeButton ? 'Close' : 'Go back'} onClick={handleBack}>
        {closeButton ? <CloseIcon /> : <BackIcon />}
      </IconButton>

      {center && (
        <span className="text-sm opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
          {center}
        </span>
      )}

      <div className="flex items-center gap-2">
        {showBookmark && (
          <IconButton label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'} onClick={onBookmarkClick}>
            <BookmarkIcon filled={isBookmarked} />
          </IconButton>
        )}
        {rightActions}
        {!showBookmark && !rightActions && <div className="w-10" />}
      </div>
    </div>
  )
}

