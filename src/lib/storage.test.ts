import { beforeEach, describe, expect, it } from 'vitest'
import {
  addEntry,
  clearAllData,
  createBackup,
  getDays,
  importBackup,
  removeDay,
  removeEntry,
  restoreEntry,
} from './storage'

const entry = (tipo: string, gasto: number) => ({ tipo, gasto })

beforeEach(() => {
  clearAllData()
})

describe('armazenamento local', () => {
  it('adiciona e soma consumos por dia', () => {
    addEntry('2026-11-09', entry('Banho', 90))
    addEntry('2026-11-09', entry('Descarga', 6))
    addEntry('2026-11-08', entry('Lavar as mãos', 12))

    const days = getDays()
    expect(days).toHaveLength(2)
    expect(days[0].date).toBe('2026-11-09')
    expect(days[0].total).toBe(96)
    expect(days[1].total).toBe(12)
  })

  it('mantém o formato dos registros antigos', () => {
    addEntry('2026-11-09', { tipo: 'Banho', gasto: 90, duracao: 600 })
    const day = getDays()[0]
    expect(day.entries[0]).toMatchObject({
      tipo: 'Banho',
      gasto: 90,
      duracao: 600,
    })
  })

  it('remove um item e permite desfazer', () => {
    addEntry('2026-11-09', entry('Banho', 90))
    addEntry('2026-11-09', entry('Descarga', 6))

    const removed = removeEntry('2026-11-09', 0)
    expect(removed).toEqual({ tipo: 'Banho', gasto: 90 })
    expect(getDays()[0].total).toBe(6)

    if (removed) restoreEntry('2026-11-09', removed, 0)
    expect(getDays()[0].total).toBe(96)
  })

  it('remove um dia inteiro', () => {
    addEntry('2026-11-09', entry('Banho', 90))
    removeDay('2026-11-09')
    expect(getDays()).toHaveLength(0)
  })

  it('cria backup e importa sem duplicar', () => {
    addEntry('2026-11-09', entry('Banho', 90))
    const backup = JSON.stringify(createBackup())

    expect(importBackup(backup).entries).toBe(0)
    expect(getDays()[0].entries).toHaveLength(1)
  })

  it('importa backup de outro dispositivo', () => {
    const backup = JSON.stringify({
      app: 'iWater',
      version: 2,
      days: {
        '2026-11-07': [{ tipo: 'Banho', gasto: 90 }],
        '2026-11-08': [{ tipo: 'Descarga', gasto: 6 }],
      },
    })

    const result = importBackup(backup)
    expect(result.entries).toBe(2)
    expect(result.days).toBe(2)
    expect(getDays()).toHaveLength(2)
  })

  it('ignora chaves que não são datas', () => {
    const backup = JSON.stringify({
      'config': [{ tipo: 'X', gasto: 1 }],
      '2026-11-09': [{ tipo: 'Banho', gasto: 90 }],
    })
    expect(importBackup(backup).entries).toBe(1)
  })
})
