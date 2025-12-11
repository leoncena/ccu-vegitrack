import { Menu, X } from 'lucide-react'
import { IconButton } from '../ui/IconButton'
import { useMenu } from '../../contexts/MenuContext'

interface MenuToggleButtonProps {
  label?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MenuToggleButton({
  label = 'Menu',
  color = 'var(--color-primary)',
  size = 'md',
}: MenuToggleButtonProps) {
  const { isOpen, toggle } = useMenu()

  return (
    <IconButton
      label={label}
      onClick={toggle}
      size={size}
      style={{ color }}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </IconButton>
  )
}
