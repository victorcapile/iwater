import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <section className="surface px-6 py-10 text-center sm:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
        <Icon className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy/60">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  )
}
