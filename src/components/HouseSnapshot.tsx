import { Link } from 'react-router-dom'
import { ArrowRight, Droplets, ReceiptText } from 'lucide-react'
import type { HouseState } from '../hooks/useHouseData'
import {
  getEffectiveCostPerM3,
  getLatestMeterInterval,
  getMeterMonthSummary,
} from '../lib/houseMath'
import {
  currentMonthKey,
  formatCurrency,
  formatDateFull,
  formatM3,
  formatMonth,
} from '../lib/format'

export function HouseSnapshot({ profile, readings, bills }: HouseState) {
  if (readings.length === 0 && bills.length === 0) return null

  const latestReading = readings[0] ?? null
  const latestInterval = getLatestMeterInterval(readings)
  const latestBill = bills[0] ?? null
  const currentMonth = currentMonthKey()
  const currentMeter = getMeterMonthSummary(readings, currentMonth)
  const hasCurrentMeter = currentMeter.intervals.length > 0
  const costPerM3 = getEffectiveCostPerM3(bills)
  const estimatedCost =
    hasCurrentMeter && costPerM3 > 0 ? currentMeter.m3 * costPerM3 : null

  return (
    <section className="surface mb-6 p-5 sm:p-6" aria-labelledby="casa-resumo-titulo">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Minha casa</p>
          <h2 id="casa-resumo-titulo" className="mt-1 text-lg font-semibold tracking-tight">
            Consumo real e conta
          </h2>
          <p className="mt-1 text-xs text-navy/50">
            Meta atual: {profile.residents} × {profile.goalPerPerson} L/dia.
          </p>
        </div>
        <Link to="/minha-casa" className="btn-ghost px-3">
          Abrir
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="stat-card">
          <Droplets className="h-4 w-4 text-agua-800" aria-hidden="true" />
          <p className="stat-label mt-2">Última leitura</p>
          <p className="stat-value">
            {latestReading ? formatM3(latestReading.reading) : '—'}
            {latestReading ? (
              <span className="text-xs font-normal text-navy/45"> m³</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            {latestReading ? formatDateFull(latestReading.date) : 'Sem leitura'}
            {latestInterval
              ? ` · ${formatM3(latestInterval.m3)} m³ no período`
              : ''}
          </p>
        </div>

        <div className="stat-card">
          <Droplets className="h-4 w-4 text-agua-800" aria-hidden="true" />
          <p className="stat-label mt-2">Mês atual</p>
          <p className="stat-value">
            {hasCurrentMeter ? formatM3(currentMeter.m3) : '—'}
            {hasCurrentMeter ? (
              <span className="text-xs font-normal text-navy/45"> m³</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            {estimatedCost !== null
              ? `≈ ${formatCurrency(estimatedCost)} pela tarifa atual`
              : hasCurrentMeter
                ? 'Adicione uma conta para estimar R$'
                : 'Sem leitura neste mês'}
          </p>
        </div>

        <div className="stat-card">
          <ReceiptText className="h-4 w-4 text-agua-800" aria-hidden="true" />
          <p className="stat-label mt-2">Conta mais recente</p>
          <p className="stat-value">
            {latestBill ? formatCurrency(latestBill.totalBRL) : '—'}
          </p>
          <p className="mt-0.5 text-[0.66rem] leading-snug text-navy/45">
            {latestBill
              ? `${formatMonth(latestBill.month)} · ${formatM3(latestBill.consumptionM3)} m³`
              : 'Sem conta cadastrada'}
          </p>
        </div>
      </div>
    </section>
  )
}
