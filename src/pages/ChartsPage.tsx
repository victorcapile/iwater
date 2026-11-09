import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Beef,
  ChartNoAxesCombined,
  Droplets,
  PlusCircle,
  Shirt,
  ShoppingBag,
} from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { TrendChart } from '../components/TrendChart'
import { WaterGauge } from '../components/WaterGauge'
import { useConsumptionDays } from '../hooks/useConsumptionDays'
import { useHouseData } from '../hooks/useHouseData'
import { footprintFacts } from '../data/activities'
import { formatDurationHuman, getStatus } from '../lib/consumption'
import { getHouseAlert, getHouseGoal, getHouseMax } from '../lib/houseMath'
import {
  formatDateFull,
  formatDateLong,
  formatInteger,
  formatLiters,
} from '../lib/format'

export function ChartsPage() {
  const days = useConsumptionDays()
  const house = useHouseData()
  const goal = getHouseGoal(house.profile)
  const alert = getHouseAlert(house.profile)
  const max = getHouseMax(house.profile)

  const [selectedDate, setSelectedDate] = useSelectedDay(days)
  const selectedDay = days.find((day) => day.date === selectedDate) ?? days[0]

  if (!selectedDay) {
    return (
      <div>
        <PageHeader
          icon={ChartNoAxesCombined}
          title="Gráficos"
          description="Veja o consumo estimado pelas atividades, compare com as metas da casa e acompanhe a evolução dos últimos dias."
        />
        <EmptyState
          icon={ChartNoAxesCombined}
          title="Ainda não há dados para mostrar"
          description="Assim que você registrar um consumo, o gráfico do boneco d'água e a evolução dos últimos dias aparecem aqui."
          action={
            <Link to="/novo-consumo" className="btn-primary">
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Registrar consumo
            </Link>
          }
        />
      </div>
    )
  }

  const status = getStatus(
    selectedDay.total,
    selectedDay.entries.length > 0,
    goal,
    alert,
  )
  const sortedEntries = selectedDay.entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.gasto - a.entry.gasto)
  const biggest = sortedEntries[0]?.entry.gasto ?? 1

  const statusMessage =
    status === 'ideal'
      ? `Dentro da meta da casa de ${formatLiters(goal)} litros por dia.`
      : status === 'atencao'
        ? `Passou da meta de ${formatLiters(goal)} litros, mas ainda está abaixo do alerta de ${formatLiters(alert)} litros.`
        : `Acima do alerta de ${formatLiters(alert)} litros. Vale revisar banhos, torneiras e descargas.`

  return (
    <div>
      <PageHeader
        icon={ChartNoAxesCombined}
        title="Gráficos"
        description="Veja o consumo estimado pelas atividades, compare com as metas da casa e acompanhe a evolução dos últimos dias."
      />

      <div className="surface mb-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <label htmlFor="dia-grafico" className="text-xs font-semibold tracking-[0.14em] text-navy/55 uppercase">
          Dia analisado
        </label>
        <select
          id="dia-grafico"
          className="select-base max-w-full sm:w-auto sm:min-w-72"
          value={selectedDay.date}
          onChange={(event) => setSelectedDate(event.target.value)}
        >
          {days.map((day) => (
            <option key={day.date} value={day.date}>
              {formatDateLong(day.date)} — {formatLiters(day.total)} L
            </option>
          ))}
        </select>
      </div>

      <section className="surface mb-4 p-5 sm:p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,19rem)_1fr] md:items-center">
          <WaterGauge
            total={selectedDay.total}
            hasEntries={selectedDay.entries.length > 0}
            idealLiters={goal}
            alertLiters={alert}
            maxLiters={max}
          />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">{formatDateFull(selectedDay.date)}</p>
                <h2 className="mt-1 text-2xl font-light tracking-tight">
                  {formatLiters(selectedDay.total)}{' '}
                  <span className="text-sm font-normal text-navy/50">litros</span>
                </h2>
                <p className="mt-0.5 text-[0.68rem] text-navy/45">
                  estimativa pelas atividades registradas
                </p>
              </div>
              <StatusBadge status={status} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-navy/55">{statusMessage}</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="stat-card">
                <p className="stat-label">Meta da casa</p>
                <p className="mt-1 text-xl font-light">
                  {formatLiters(goal)}{' '}
                  <span className="text-xs font-normal text-navy/45">L</span>
                </p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Alerta</p>
                <p className="mt-1 text-xl font-light">
                  {formatLiters(alert)}{' '}
                  <span className="text-xs font-normal text-navy/45">L</span>
                </p>
              </div>
            </div>
            <Link
              to="/minha-casa"
              className="mt-3 inline-flex text-[0.7rem] font-semibold text-agua-800 underline-offset-2 hover:underline"
            >
              Meta para {house.profile.residents}{' '}
              {house.profile.residents === 1 ? 'pessoa' : 'pessoas'} · ajustar em Minha casa
            </Link>

            <div className="mt-5">
              <h3 className="text-xs font-semibold tracking-[0.14em] text-navy/55 uppercase">
                O que compôs o dia
              </h3>
              <ul className="mt-3 space-y-3">
                {sortedEntries.map(({ entry, index }) => (
                  <li key={`${entry.tipo}-${index}`}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-semibold text-navy/80">
                        {entry.tipo}
                        {typeof entry.duracao === 'number' && entry.duracao > 0 ? (
                          <span className="ml-1.5 font-normal text-navy/45">
                            {formatDurationHuman(entry.duracao)}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums">
                        {formatLiters(entry.gasto)} L
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-navy/8">
                      <div
                        className="h-full rounded-full bg-agua-600"
                        style={{ width: `${Math.max(3, (entry.gasto / biggest) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="surface mb-4 p-5 sm:p-6" aria-labelledby="tendencia-titulo">
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <h2 id="tendencia-titulo" className="text-sm font-semibold tracking-tight">
              Últimos 7 dias
            </h2>
            <p className="mt-1 text-xs text-navy/50">
              Consumo diário comparado com a meta ideal e o alerta.
            </p>
          </div>
          <p className="text-right text-[0.65rem] font-semibold text-navy/45">
            {formatInteger(days.length)}{' '}
            {days.length === 1 ? 'dia registrado' : 'dias registrados'}
          </p>
        </div>
        <TrendChart days={days} idealLiters={goal} alertLiters={alert} />
      </section>

      <section className="surface p-5 sm:p-6" aria-labelledby="pegada-titulo">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agua-600/10 text-agua-800">
            <Droplets className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="pegada-titulo" className="text-sm font-semibold tracking-tight">
              Para colocar em perspectiva
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-navy/55">
              A pegada hídrica é a água usada em toda a cadeia de produção — inclusive
              a que não vemos.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {footprintFacts.map((fact) => {
            const FactIcon =
              fact.id === 'calca-jeans'
                ? ShoppingBag
                : fact.id === 'camiseta'
                  ? Shirt
                  : Beef
            return (
              <div key={fact.id} className="stat-card">
                <FactIcon className="h-4 w-4 text-agua-800" aria-hidden="true" />
                <p className="mt-2 text-xl font-light tracking-tight">
                  {formatInteger(fact.liters)}{' '}
                  <span className="text-xs font-normal text-navy/45">L</span>
                </p>
                <p className="mt-1 text-[0.7rem] leading-snug text-navy/55">
                  para produzir {fact.label}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function useSelectedDay(days: ReturnType<typeof useConsumptionDays>) {
  const [selectedDate, setSelectedDate] = useState(days[0]?.date ?? '')

  useEffect(() => {
    if (days.length === 0) {
      if (selectedDate !== '') setSelectedDate('')
      return
    }
    if (!days.some((day) => day.date === selectedDate)) {
      setSelectedDate(days[0].date)
    }
  }, [days, selectedDate])

  return [selectedDate, setSelectedDate] as const
}
