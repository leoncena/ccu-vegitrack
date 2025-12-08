// Vegetable icon components for the landing page background
// Using actual SVG assets from the wallpaper folder

import carrotSvg from '../../assets/wallpaper/carrot.svg'
import tomatoSvg from '../../assets/wallpaper/tomato.svg'
import strawberrySvg from '../../assets/wallpaper/strawberry.svg'
import asparagusSvg from '../../assets/wallpaper/asparagus.svg'
import caleSvg from '../../assets/wallpaper/cale.svg'
import lemonSvg from '../../assets/wallpaper/Lemon.svg'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

export function Carrot({ className = '', style }: IconProps) {
  return (
    <img
      src={carrotSvg}
      alt="Carrot"
      className={className}
      style={style}
    />
  )
}

export function Tomato({ className = '', style }: IconProps) {
  return (
    <img
      src={tomatoSvg}
      alt="Tomato"
      className={className}
      style={style}
    />
  )
}

export function Strawberry({ className = '', style }: IconProps) {
  return (
    <img
      src={strawberrySvg}
      alt="Strawberry"
      className={className}
      style={style}
    />
  )
}

export function Asparagus({ className = '', style }: IconProps) {
  return (
    <img
      src={asparagusSvg}
      alt="Asparagus"
      className={className}
      style={style}
    />
  )
}

export function Lettuce({ className = '', style }: IconProps) {
  return (
    <img
      src={caleSvg}
      alt="Lettuce"
      className={className}
      style={style}
    />
  )
}

export function Lemon({ className = '', style }: IconProps) {
  return (
    <img
      src={lemonSvg}
      alt="Lemon"
      className={className}
      style={style}
    />
  )
}

