import {
  differenceInCalendarDays,
  format,
  getDaysInMonth,
  parseISO,
  subMonths,
} from 'date-fns'
import type { DayRecord } from './storage'
import type { HouseProfile, MeterReading, WaterBill } from './house'

export interface MeterInterval {
  id: string
  startDate: string
  endDate: string
  m3: number
  days: number
}

export interface MeterMonthSummary {
  m3: number
  days: number
  intervals: MeterInterval[]
  projectedM3: number | null
}

export interface ActivityMonthSummary {
  liters: number
  days: number
  entries: number
}

export function getHouseGoal(profile: HouseProfile): number {
  return Math.max(1, profile.residents) * Math.max(1, profile.goalPerPerson)
}

/** Mesma proporção do projeto original: 150 L de alerta para 120 L de meta. */
export function getHouseAlert(profile: HouseProfile): number {
  return Math.round(getHouseGoal(profile) * 1.25)
}

/** Mesma proporção do projeto original: 165 L no topo para 120 L de meta. */
export function getHouseMax(profile: HouseProfile): number {
  return Math.round(getHouseGoal(profile) * 1.375)
}

/** Intervalos de consumo entre leituras consecutivas do hidrômetro. */
export function getMeterIntervals(readings: MeterReading[]): MeterInterval[] {
  const sorted = [...readings].sort(
    (a, b) => a.date.localeCompare(b.date) || a.reading - b.reading,
  )

  return sorted.slice(1).map((current, index) => {
    const previous = sorted[index]
    const days = Math.max(
      0,
      differenceInCalendarDays(parseISO(current.date), parseISO(previous.date)),
    )
    return {
      id: current.id,
      startDate: previous.date,
      endDate: current.date,
      m3: Math.max(0, current.reading - previous.reading),
      days,
    }
  })
}

export function getLatestMeterInterval(
  readings: MeterReading[],
): MeterInterval | null {
  const intervals = getMeterIntervals(readings)
  return intervals.length > 0 ? intervals[intervals.length - 1] : null
}

/**
 * Consumo real do mês: soma os intervalos cuja leitura final caiu no mês.
 * A projeção só é calculada para o mês corrente.
 */
export function getMeterMonthSummary(
  readings: MeterReading[],
  month: string,
  today = new Date(),
): MeterMonthSummary {
  const intervals = getMeterIntervals(readings).filter((interval) =>
    interval.endDate.startsWith(month),
  )

  const m3 = intervals.reduce((sum, interval) => sum + interval.m3, 0)
  const first = intervals[0]
  const last = intervals[intervals.length - 1]
  const days =
    first && last
      ? Math.max(1, differenceInCalendarDays(parseISO(last.endDate), parseISO(first.startDate)))
      : 0

  const currentMonth = format(today, 'yyyy-MM')
  const projectedM3 =
    month === currentMonth && days > 0
      ? (m3 / days) * getDaysInMonth(parseISO(`${month}-01`))
      : null

  return { m3, days, intervals, projectedM3 }
}

export function getActivityMonthSummary(
  days: DayRecord[],
  month: string,
): ActivityMonthSummary {
  const filtered = days.filter((day) => day.date.startsWith(month))
  return {
    liters: filtered.reduce((sum, day) => sum + day.total, 0),
    days: filtered.length,
    entries: filtered.reduce((sum, day) => sum + day.entries.length, 0),
  }
}

export function getBillForMonth(
  bills: WaterBill[],
  month: string,
): WaterBill | null {
  return bills.find((bill) => bill.month === month) ?? null
}

/** Tarifa efetiva (R$/m³) da conta mais recente válida. */
export function getEffectiveCostPerM3(bills: WaterBill[]): number {
  const latest = [...bills]
    .filter((bill) => bill.consumptionM3 > 0)
    .sort((a, b) => b.month.localeCompare(a.month))[0]

  return latest ? latest.totalBRL / latest.consumptionM3 : 0
}

export function getAveragePerPersonPerDay(
  consumptionM3: number,
  residents: number,
  days: number,
): number {
  const safeResidents = Math.max(1, residents)
  const safeDays = Math.max(1, days)
  return (consumptionM3 * 1000) / safeResidents / safeDays
}

export function getPreviousMonthKey(month: string): string {
  return format(subMonths(parseISO(`${month}-01`), 1), 'yyyy-MM')
}

export function getMonthOptions(
  readings: MeterReading[],
  bills: WaterBill[],
  currentMonth = format(new Date(), 'yyyy-MM'),
): string[] {
  const months = new Set<string>([currentMonth])
  readings.forEach((reading) => months.add(reading.date.slice(0, 7)))
  bills.forEach((bill) => months.add(bill.month))
  return [...months].sort().reverse()
}
