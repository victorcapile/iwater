import {
  format,
  isToday,
  isYesterday,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

const literFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
})

const cubicMeterFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 3,
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatLiters(value: number): string {
  return literFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatInteger(value: number): string {
  return integerFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatM3(value: number): string {
  return cubicMeterFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0)
}

/** Aceita "123,456", "123.456" e "1.234,56". */
export function parseDecimalInput(value: string): number {
  const clean = value.trim().replace(/\s/g, '')
  if (!clean) return Number.NaN
  if (clean.includes(',')) {
    return Number(clean.replace(/\./g, '').replace(',', '.'))
  }
  return Number(clean)
}

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function currentMonthKey(): string {
  return format(new Date(), 'yyyy-MM')
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatDateLong(key: string): string {
  const date = parseISO(key)
  if (isToday(date)) return 'Hoje'
  if (isYesterday(date)) return 'Ontem'
  return capitalize(format(date, "EEEE, d 'de' MMMM", { locale: ptBR }))
}

export function formatDateFull(key: string): string {
  return format(parseISO(key), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatMonth(month: string): string {
  return capitalize(
    format(parseISO(`${month}-01`), "MMMM 'de' yyyy", { locale: ptBR }),
  )
}

export function formatChartLabel(key: string): string {
  return format(parseISO(key), 'dd/MM', { locale: ptBR })
}

/** Retorna os últimos `amount` dias, do mais antigo para o mais recente. */
export function lastDays(amount: number): string[] {
  const today = startOfDay(new Date())
  return Array.from({ length: amount }, (_, index) => {
    const date = subDays(today, amount - 1 - index)
    return format(date, 'yyyy-MM-dd')
  })
}
