import { beforeEach, describe, expect, it } from 'vitest'
import {
  addMeterReading,
  clearHouseData,
  getBills,
  getHouseData,
  getMeterReadings,
  getProfile,
  mergeHouseData,
  removeBill,
  removeMeterReading,
  saveBill,
  saveProfile,
} from './house'

beforeEach(() => {
  clearHouseData()
})

describe('perfil da casa', () => {
  it('começa com uma pessoa e 120 L/dia', () => {
    expect(getProfile()).toMatchObject({ residents: 1, goalPerPerson: 120 })
  })

  it('salva e normaliza os dados do perfil', () => {
    saveProfile({
      residents: 3,
      goalPerPerson: 110,
      housingType: 'apartamento',
      hasGarden: false,
      hasPool: true,
    })

    expect(getProfile()).toMatchObject({
      residents: 3,
      goalPerPerson: 110,
      housingType: 'apartamento',
      hasPool: true,
    })
  })
})

describe('leituras do hidrômetro', () => {
  it('adiciona e ordena as leituras da mais recente para a mais antiga', () => {
    addMeterReading({ date: '2026-11-01', reading: 100 })
    addMeterReading({ date: '2026-11-08', reading: 106 })

    const readings = getMeterReadings()
    expect(readings).toHaveLength(2)
    expect(readings[0].date).toBe('2026-11-08')
    expect(readings[0].reading).toBe(106)
  })

  it('remove uma leitura', () => {
    const reading = addMeterReading({ date: '2026-11-01', reading: 100 })
    expect(removeMeterReading(reading.id)).toMatchObject({ reading: 100 })
    expect(getMeterReadings()).toHaveLength(0)
  })
})

describe('contas de água', () => {
  it('substitui a conta do mesmo mês em vez de duplicar', () => {
    saveBill({ month: '2026-11', consumptionM3: 10, totalBRL: 100 })
    saveBill({ month: '2026-11', consumptionM3: 12, totalBRL: 150 })

    const bills = getBills()
    expect(bills).toHaveLength(1)
    expect(bills[0]).toMatchObject({ consumptionM3: 12, totalBRL: 150 })
  })

  it('remove uma conta', () => {
    const saved = saveBill({ month: '2026-11', consumptionM3: 10, totalBRL: 100 })
    expect(removeBill(saved.id)).toMatchObject({ totalBRL: 100 })
    expect(getBills()).toHaveLength(0)
  })
})

describe('backup dos dados da casa', () => {
  it('mescla perfil, leituras e contas sem duplicar', () => {
    addMeterReading({ date: '2026-11-01', reading: 100 })
    saveBill({ month: '2026-11', consumptionM3: 10, totalBRL: 100 })

    const data = getHouseData()
    const result = mergeHouseData(data)
    expect(result.readings).toBe(0)
    expect(result.bills).toBe(0)
    expect(getMeterReadings()).toHaveLength(1)
    expect(getBills()).toHaveLength(1)
  })

  it('importa dados de outro dispositivo', () => {
    const result = mergeHouseData({
      profile: {
        residents: 4,
        goalPerPerson: 100,
        housingType: 'casa',
        hasGarden: true,
        hasPool: false,
      },
      readings: [{ id: 'r1', date: '2026-11-01', reading: 200 }],
      bills: [{ id: 'b1', month: '2026-11', consumptionM3: 8, totalBRL: 80 }],
    })

    expect(result).toEqual({ profile: true, readings: 1, bills: 1 })
    expect(getProfile().residents).toBe(4)
    expect(getMeterReadings()).toHaveLength(1)
    expect(getBills()).toHaveLength(1)
  })
})
