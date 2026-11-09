import { getDaysInMonth, parseISO } from 'date-fns'
import {
  ChartNoAxesCombined,
  Droplets,
  ReceiptText,
  Users,
} from 'lucide-react'
import type { DayRecord } from '../../lib/storage'
import type { HouseProfile, MeterReading, WaterBill } from '../../lib/house'
import { StatusBadge } from '../StatusBadge'
import { getStatus } from '../../lib/consumption'
import {
  getActivityMonthSummary,
  getAveragePerPersonPerDay,
  getBillForMonth,
  getEffectiveCostPerM3,
  getHouseAlert,
  getHouseGoal,
  getMeterMonthSummary,
  getPreviousMonthKey,
} from '../../lib/houseMath'
import {
  currentMonthKey,
  formatCurrency,
  formatLiters,
  formatM3,
  formatMonth,
} from '../../lib/format'
import clsx from 'clsx'

interface MonthSummaryProps {
  profile: HouseProfile
  readings: MeterReading[]
  bills: WaterBill[]
  activityDays: DayRecord[]
  month: string
  months: string[]
  onMonthChange: (month: string) => void
}

const statusProgressColor = {
  'sem-registro': 'bg-agua-500',
  ideal: 'bg-ideal',
  atencao: 'bg-warning',
  acima: 'bg-danger',
} as const

export function MonthSummary({
  profile,
  readings,
  bills,
  activityDays,
  month,
  months,
  onMonthChange,
}: MonthSummaryProps) {
  const today = new Date()
  const currentMonth = currentMonthKey()
  const meter = getMeterMonthSummary(readings, month, today)
  const bill = getBillForMonth(bills, month)
  const activity = getActivityMonthSummary(activityDays, month)
  const goal = getHouseGoal(profile)
  const alert = getHouseAlert(profile)
  const effectiveCostPerM3 = getEffectiveCostPerM3(bills)

  const realM3 = meter.m3 > 0 ? meter.m3 : bill?.consumptionM3 ?? 0
  const hasRealData = realM3 > 0
  const costPerM3 =
    bill && bill.consumptionM3 > 0
      ? bill.totalBRL / bill.consumptionM3
      : effectiveCostPerM3
  const cost = bill?.totalBRL ?? (realM3 > 0 && costPerM3 > 0 ? realM3 * costPerM3 : null)
  const latestBill = [...bills].sort((a, b) => b.month.localeCompare(a.month))[0]
  const isEstimatedCost = !bill && cost !== null
  const days =
    meter.days > 0
      ? meter.days
      : month === currentMonth
        ? today.getDate()
        : getDaysInMonth(parseISO(`${month}-01`))

  const averagePerPerson = hasRealData
    ? getAveragePerPersonPerDay(realM3, profile.residents, days)
    : 0
  const status = getStatus(
    averagePerPerson,
    hasRealData,
    profile.goalPerPerson,
    profile.goalPerPerson * 1.25,
  )
  const perPersonMax = Math.round(profile.goalPerPerson * 1.375)
  const progress = Math.min(
    100,
    Math.max(0, (averagePerPerson / Math.max(1, perPersonMax)) * 100),
  )

  const projectedM3 = meter.projectedM3
  const projectedCost =
    projectedM3 !== null && costPerM3 > 0 ? projectedM3 * costPerM3 : null

  const previousMonth = getPreviousMonthKey(month)
  const previousMeter = getMeterMonthSummary(readings, previousMonth, today)
  const previousBill = getBillForMonth(bills, previousMonth)
  const previousM3 =
    previousMeter.m3 > 0 ? previousMeter.m3 : previousBill?.consumptionM3 ?? 0
  const delta =
    previousM3 > 0 && realM3 > 0
      ? ((realM3 - previousM3) / previousM3) * 100
      : null

  return (
    <section className="surface p-5 sm:p-6" aria-labelledby="resumo-mensal-titulo">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Resumo mensal</p>
          <h2 id="resumo-mensal-titulo" className="mt-1 text-xl font-semibold tracking-tight">
            {formatMonth(month)}
          </h2>
          <p className="mt-1 text-xs text-navy/50">
            Meta da casa: {formatLiters(goal)} L/dia para {profile.residents}{' '}
            {profile.residents === 1 ? 'pessoa' : 'pessoas'}.
          </p>
        </div>
        <select
          className="select-base max-w-full sm:w-auto sm:min-w-52"
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          aria-label="Mês do resumo"
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {formatMonth(option)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <div className="stat-card">
          <Droplets className="h-4 w-4 text-agua-800" aria-hidden="true" />
          <p className="stat-label mt-2">Consumo real</p>
          <p className="stat-value">
            {hasRealData ? formatM3(realM3) : '—'}
            {hasRealData ? (
              <span className="text-xs font-normal text-navy/45"> m³</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            {hasRealData
              ? `${formatM3(realM3 / Math.max(1, days))} m³/dia`
              : 'Sem leitura no mês'}
          </p>
        </div>

        <div className="stat-card">
          <ReceiptText className="h-4 w-4 text-agua-800" aria-hidden="true" />
          <p className="stat-label mt-2">
            {isEstimatedCost ? 'Conta estimada' : 'Conta'}
          </p>
          <p className="stat-value">{cost !== null ? formatCurrency(cost) : '—'}</p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            {costPerM3 > 0
              ? `${formatCurrency(costPerM3)}/m³${
                  isEstimatedCost && latestBill
                    ? ` · tarifa de ${formatMonth(latestBill.month)}`
                    : ''
                }`
              : 'Sem conta cadastrada'}
          </p>
        </div>

        <div className="stat-card">
          <Users className="h-4 w-4 text-agua-800" aria-hidden="true" />
          <p className="stat-label mt-2">Média por pessoa</p>
          <p className="stat-value">
            {formatLiters(averagePerPerson)}
            <span className="text-xs font-normal text-navy/45"> L</span>
          </p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            meta {formatLiters(profile.goalPerPerson)} L/dia
          </p>
        </div>

        <div className="stat-card">
          <ChartNoAxesCombined className="h-4 w-4 text-agua-800" aria-hidden="true" />
          <p className="stat-label mt-2">Projeção do mês</p>
          <p className="stat-value">
            {projectedM3 !== null ? formatM3(projectedM3) : '—'}
            {projectedM3 !== null ? (
              <span className="text-xs font-normal text-navy/45"> m³</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            {projectedCost !== null
              ? `≈ ${formatCurrency(projectedCost)}`
              : month === currentMonth
                ? 'Aguardando leituras'
                : 'Mês fechado'}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[0.68rem] font-semibold tracking-[0.12em] text-navy/50 uppercase">
            Média por pessoa vs. meta
          </span>
          <StatusBadge status={status} />
        </div>
        <div
          className="relative mt-2 h-3 overflow-hidden rounded-full bg-navy/8"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={perPersonMax}
          aria-valuenow={Math.min(averagePerPerson, perPersonMax)}
          aria-label="Média por pessoa em relação à meta diária"
        >
          <div
            className={clsx(
              'h-full rounded-full transition-[width] duration-700 ease-out',
              statusProgressColor[status],
            )}
            style={{ width: `${progress}%` }}
          />
          <span
            className="absolute inset-y-0 w-px bg-navy/30"
            style={{ left: `${(profile.goalPerPerson / Math.max(1, perPersonMax)) * 100}%` }}
            aria-hidden="true"
          />
          <span
            className="absolute inset-y-0 w-px bg-danger/45"
            style={{
              left: `${((profile.goalPerPerson * 1.25) / Math.max(1, perPersonMax)) * 100}%`,
            }}
            aria-hidden="true"
          />
        </div>
        <div className="mt-2 flex justify-between gap-2 text-[0.65rem] font-semibold text-navy/45">
          <span>0 L</span>
          <span>meta {formatLiters(profile.goalPerPerson)} L</span>
          <span>alerta {formatLiters(alert / Math.max(1, profile.residents))} L</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] text-navy/50">
        <span>
          Hidrômetro: {hasRealData ? `${formatM3(realM3)} m³ no mês` : 'sem leitura'}
        </span>
        <span>
          Atividades: {formatLiters(activity.liters)} L estimados
          {activity.days > 0
            ? ` em ${activity.days} ${activity.days === 1 ? 'dia' : 'dias'}`
            : ''}
        </span>
        {delta !== null ? (
          <span className={delta <= 0 ? 'font-semibold text-ideal' : 'font-semibold text-danger'}>
            {Math.abs(delta).toFixed(0)}% {delta <= 0 ? 'menos' : 'mais'} que{' '}
            {formatMonth(previousMonth)}
          </span>
        ) : null}
      </div>

      {!hasRealData ? (
        <p className="mt-3 rounded-xl bg-agua-600/8 p-3 text-xs leading-relaxed text-navy/60">
          Adicione uma leitura do hidrômetro para ver o consumo real, a média por pessoa
          e a projeção da conta.
        </p>
      ) : activity.liters > 0 ? (
        <p className="mt-3 text-[0.68rem] leading-relaxed text-navy/45">
          O consumo real vem do hidrômetro; as atividades são uma estimativa para
          entender os hábitos.
        </p>
      ) : null}
    </section>
  )
}
