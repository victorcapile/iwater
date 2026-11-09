import { describe, expect, it } from 'vitest'
import type { DayRecord } from './storage'
import type { MeterReading, WaterBill } from './house'
import {
  getActivityMonthSummary,
  getAveragePerPersonPerDay,
  getBillForMonth,
  getEffectiveCostPerM3,
  getHouseAlert,
  getHouseGoal,
  getHouseMax,
  getLatestMeterInterval,
  getMeterIntervals,
  getMeterMonthSummary,
  getMonthOptions,
  getPreviousMonthKey,
} from './houseMath'

const profile = {
  residents: 2,
  goalPerPerson: 120,
  housingType: 'casa' as const,
  hasGarden: false,
  hasPool: false,
}

const reading = (id: string, date: string, value: number): MeterReading => ({
  id,
  date,
  reading: value,
})

const bill = (
  id: string,
  month: string,
  consumptionM3: number,
  totalBRL: number,
): WaterBill => ({
  id,
  month,
  consumptionM3,
  totalBRL,
})

describe('metas da casa', () => {
  it('multiplica a meta por pessoa', () => {
    expect(getHouseGoal(profile)).toBe(240)
    expect(getHouseAlert(profile)).toBe(300)
    expect(getHouseMax(profile)).toBe(330)
  })

  it('mantém as proporções originais para uma pessoa', () => {
    const single = { ...profile, residents: 1 }
    expect(getHouseGoal(single)).toBe(120)
    expect(getHouseAlert(single)).toBe(150)
    expect(getHouseMax(single)).toBe(165)
  })
})

describe('hidrômetro', () => {
  const readings = [
    reading('a', '2026-11-01', 100),
    reading('b', '2026-11-05', 104),
    reading('c', '2026-11-08', 106),
  ]

  it('calcula intervalos entre leituras consecutivas', () => {
    const intervals = getMeterIntervals(readings)
    expect(intervals).toEqual([
      { id: 'b', startDate: '2026-11-01', endDate: '2026-11-05', m3: 4, days: 4 },
      { id: 'c', startDate: '2026-11-05', endDate: '2026-11-08', m3: 2, days: 3 },
    ])
    expect(getLatestMeterInterval(readings)).toMatchObject({ id: 'c', m3: 2 })
  })

  it('soma o consumo do mês e projeta o mês corrente', () => {
    const summary = getMeterMonthSummary(readings, '2026-11', new Date('2026-11-09T12:00:00'))
    expect(summary.m3).toBe(6)
    expect(summary.days).toBe(7)
    expect(summary.projectedM3).toBeCloseTo((6 / 7) * 30, 5)
  })

  it('não projeta meses fechados', () => {
    const summary = getMeterMonthSummary(readings, '2026-10', new Date('2026-11-09T12:00:00'))
    expect(summary.m3).toBe(0)
    expect(summary.projectedM3).toBeNull()
  })
})

describe('conta de água', () => {
  const bills = [
    bill('a', '2026-10', 10, 100),
    bill('b', '2026-11', 12, 150),
  ]

  it('usa a tarifa efetiva da conta mais recente', () => {
    expect(getEffectiveCostPerM3(bills)).toBe(12.5)
  })

  it('encontra a conta do mês', () => {
    expect(getBillForMonth(bills, '2026-11')?.totalBRL).toBe(150)
    expect(getBillForMonth(bills, '2026-09')).toBeNull()
  })

  it('calcula média por pessoa por dia', () => {
    expect(getAveragePerPersonPerDay(10, 2, 10)).toBe(500)
    expect(getAveragePerPersonPerDay(10, 0, 0)).toBe(10_000)
  })

  it('calcula o mês anterior', () => {
    expect(getPreviousMonthKey('2026-01')).toBe('2025-12')
  })
})

describe('atividades e opções de mês', () => {
  it('soma as atividades do mês', () => {
    const days: DayRecord[] = [
      { date: '2026-11-09', entries: [{ tipo: 'Banho', gasto: 90 }], total: 90 },
      { date: '2026-11-08', entries: [{ tipo: 'Banho', gasto: 45 }], total: 45 },
      { date: '2026-10-31', entries: [{ tipo: 'Banho', gasto: 30 }], total: 30 },
    ]
    expect(getActivityMonthSummary(days, '2026-11')).toEqual({
      liters: 135,
      days: 2,
      entries: 2,
    })
  })

  it('junta os meses das leituras, contas e o mês atual', () => {
    expect(
      getMonthOptions(
        [reading('a', '2026-09-01', 10)],
        [bill('b', '2026-08', 5, 50)],
        '2026-11',
      ),
    ).toEqual(['2026-11', '2026-09', '2026-08'])
  })
})
