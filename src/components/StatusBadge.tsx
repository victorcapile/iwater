import clsx from 'clsx'
import type { ConsumptionStatus } from '../lib/consumption'

const statusConfig: Record<
  ConsumptionStatus,
  { label: string; className: string }
> = {
  'sem-registro': {
    label: 'Sem registro',
    className: 'status-sem-registro',
  },
  ideal: {
    label: 'Dentro da meta',
    className: 'status-ideal',
  },
  atencao: {
    label: 'Atenção',
    className: 'status-atencao',
  },
  acima: {
    label: 'Acima do ideal',
    className: 'status-acima',
  },
}

export function StatusBadge({
  status,
  className,
}: {
  status: ConsumptionStatus
  className?: string
}) {
  const config = statusConfig[status]
  return (
    <span className={clsx('status-pill', config.className, className)}>
      {config.label}
    </span>
  )
}
