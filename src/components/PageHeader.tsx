import type { LucideIcon } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  description?: string
  backTo?: string
  backLabel?: string
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  backTo = '/',
  backLabel = 'Início',
}: PageHeaderProps) {
  return (
    <div className="mb-7 sm:mb-9">
      <Link to={backTo} className="back-link">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="mt-6 flex items-start gap-3.5 sm:gap-4">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-white/30 text-navy/80 sm:h-14 sm:w-14">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.35} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="page-title">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy/65 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
