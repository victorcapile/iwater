import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

interface IconTileProps {
  to: string
  icon: LucideIcon
  label: string
  featured?: boolean
  wide?: boolean
}

export function IconTile({ to, icon: Icon, label, featured, wide }: IconTileProps) {
  return (
    <Link
      to={to}
      className={clsx('tile group', featured && 'tile-featured', wide && 'col-span-2')}
    >
      <Icon className="tile-icon" aria-hidden="true" />
      <span className="tile-label">{label}</span>
    </Link>
  )
}
