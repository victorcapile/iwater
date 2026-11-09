import { Link } from 'react-router-dom'
import {
  BookOpen,
  ChartNoAxesCombined,
  Droplets,
  HelpCircle,
  House,
  Lightbulb,
  PlusCircle,
} from 'lucide-react'
import clsx from 'clsx'
import { HouseSnapshot } from '../components/HouseSnapshot'
import { IconTile } from '../components/IconTile'
import { StatusBadge } from '../components/StatusBadge'
import { useConsumptionDays } from '../hooks/useConsumptionDays'
import { useHouseData } from '../hooks/useHouseData'
import { getStatus, type ConsumptionStatus } from '../lib/consumption'
import { getHouseAlert, getHouseGoal, getHouseMax } from '../lib/houseMath'
import { formatDateLong, formatInteger, formatLiters, todayKey } from '../lib/format'

const progressColor: Record<ConsumptionStatus, string> = {
  'sem-registro': 'bg-agua-500',
  ideal: 'bg-ideal',
  atencao: 'bg-warning',
  acima: 'bg-danger',
}

export function HomePage() {
  const days = useConsumptionDays()
  const house = useHouseData()
  const today = todayKey()
  const todayRecord = days.find((day) => day.date === today)
  const total = todayRecord?.total ?? 0
  const hasEntries = Boolean(todayRecord?.entries.length)
  const goal = getHouseGoal(house.profile)
  const alert = getHouseAlert(house.profile)
  const max = getHouseMax(house.profile)
  const status = getStatus(total, hasEntries, goal, alert)
  const progress = Math.min(100, Math.max(0, (total / max) * 100))

  const recent = days.slice(0, 7)
  const average = recent.length
    ? recent.reduce((sum, day) => sum + day.total, 0) / recent.length
    : 0

  return (
    <div>
      <section className="mb-6 sm:mb-8">
        <p className="max-w-xl text-base leading-relaxed text-navy/70 sm:text-lg">
          Acompanhe o consumo da sua casa em litros e reais — e descubra o que dá para
          economizar no dia a dia.
        </p>
      </section>

      <section className="surface mb-4 overflow-hidden p-5 sm:p-6" aria-labelledby="resumo-hoje">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{formatDateLong(today)} · atividades</p>
            <h2 id="resumo-hoje" className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-light tracking-[-0.04em] sm:text-5xl">
                {formatLiters(total)}
              </span>
              <span className="text-sm font-semibold text-navy/50">litros</span>
            </h2>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-5">
          <div
            className="relative h-3 overflow-hidden rounded-full bg-navy/8"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={Math.min(total, max)}
            aria-label="Consumo de hoje em relação às metas"
          >
            <div
              className={clsx(
                'h-full rounded-full transition-[width] duration-700 ease-out',
                progressColor[status],
              )}
              style={{ width: `${progress}%` }}
            />
            <span
              className="absolute inset-y-0 w-px bg-navy/35"
              style={{ left: `${(goal / max) * 100}%` }}
              aria-hidden="true"
            />
            <span
              className="absolute inset-y-0 w-px bg-danger/50"
              style={{ left: `${(alert / max) * 100}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-2 flex justify-between gap-2 text-[0.65rem] font-semibold text-navy/45">
            <span>0 L</span>
            <span>ideal {formatLiters(goal)} L</span>
            <span>alerta {formatLiters(alert)} L</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {hasEntries ? (
            <>
              <Link to="/historico" className="btn-secondary">
                Ver histórico
              </Link>
              <Link to="/graficos" className="btn-ghost">
                Abrir gráficos
              </Link>
            </>
          ) : (
            <>
              <Link to="/novo-consumo" className="btn-primary">
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                Registrar meu primeiro consumo
              </Link>
              <Link to="/curiosidades" className="btn-ghost">
                Ver curiosidades
              </Link>
            </>
          )}
        </div>
      </section>

      <HouseSnapshot {...house} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Resumo dos últimos dias">
        <div className="stat-card">
          <p className="stat-label">Dias registrados</p>
          <p className="stat-value">{days.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Média recente</p>
          <p className="stat-value">
            {formatLiters(average)} <span className="text-sm font-normal text-navy/45">L</span>
          </p>
        </div>
        <div className="stat-card col-span-2 sm:col-span-1">
          <p className="stat-label">Meta da casa</p>
          <p className="stat-value">
            {formatInteger(goal)}{' '}
            <span className="text-sm font-normal text-navy/45">L/dia</span>
          </p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            {house.profile.residents}{' '}
            {house.profile.residents === 1 ? 'pessoa' : 'pessoas'} ×{' '}
            {house.profile.goalPerPerson} L
          </p>
        </div>
      </div>

      <nav aria-label="Seções do iWater">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <IconTile to="/graficos" icon={ChartNoAxesCombined} label="Gráficos" />
          <IconTile to="/curiosidades" icon={Lightbulb} label="Curiosidades" />
          <IconTile
            to="/novo-consumo"
            icon={PlusCircle}
            label="Novo consumo"
            featured
            wide
          />
          <IconTile to="/minha-casa" icon={House} label="Minha casa" wide />
          <IconTile to="/historico" icon={BookOpen} label="Histórico" />
          <IconTile to="/sobre" icon={HelpCircle} label="Sobre" />
        </div>
      </nav>

      <div className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-navy/50">
        <Droplets className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>Seus registros ficam salvos apenas neste navegador. Nenhum dado sai do seu dispositivo.</p>
      </div>
    </div>
  )
}
