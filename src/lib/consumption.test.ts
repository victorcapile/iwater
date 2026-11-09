import { describe, expect, it } from 'vitest'
import { domesticActivities } from '../data/activities'
import {
  ALERT_LITERS,
  IDEAL_LITERS,
  calcConsumption,
  formatDuration,
  formatDurationHuman,
  getDefaultSeconds,
  getStatus,
  parseDuration,
} from './consumption'

const byId = (id: string) => {
  const activity = domesticActivities.find((item) => item.id === id)
  if (!activity) throw new Error(`Atividade não encontrada: ${id}`)
  return activity
}

describe('calcConsumption', () => {
  it('calcula o banho de 10 minutos em 90 litros', () => {
    expect(calcConsumption(byId('banho'), 600)).toBe(90)
  })

  it('calcula a descarga de 6 segundos em 6 litros', () => {
    expect(calcConsumption(byId('descarga'), 6)).toBe(6)
  })

  it('calcula a torneira gotejando em 46 litros por dia', () => {
    expect(calcConsumption(byId('torneira-gotejando'), 86400)).toBe(46)
  })

  it('proporcionaliza a duração', () => {
    expect(calcConsumption(byId('banho'), 300)).toBe(45)
  })

  it('retorna zero para duração inválida', () => {
    expect(calcConsumption(byId('banho'), 0)).toBe(0)
    expect(calcConsumption(byId('banho'), -10)).toBe(0)
    expect(calcConsumption(byId('banho'), Number.NaN)).toBe(0)
  })
})

describe('getDefaultSeconds', () => {
  it('usa a unidade da atividade como referência', () => {
    expect(getDefaultSeconds(byId('banho'))).toBe(600)
    expect(getDefaultSeconds(byId('descarga'))).toBe(6)
    expect(getDefaultSeconds(byId('torneira-gotejando'))).toBe(86400)
  })
})

describe('parseDuration', () => {
  it('aceita HH:MM:SS', () => {
    expect(parseDuration('00:10:00')).toBe(600)
    expect(parseDuration('01:02:03')).toBe(3723)
  })

  it('aceita MM:SS e segundos', () => {
    expect(parseDuration('10:30')).toBe(630)
    expect(parseDuration('45')).toBe(45)
  })

  it('rejeita valores inválidos', () => {
    expect(parseDuration('')).toBeNull()
    expect(parseDuration('abc')).toBeNull()
    expect(parseDuration('00:70:00')).toBeNull()
    expect(parseDuration('00:00:70')).toBeNull()
  })
})

describe('formatDuration', () => {
  it('formata em HH:MM:SS', () => {
    expect(formatDuration(600)).toBe('00:10:00')
    expect(formatDuration(3723)).toBe('01:02:03')
    expect(formatDuration(86400)).toBe('24:00:00')
  })

  it('formata texto humano', () => {
    expect(formatDurationHuman(600)).toBe('10 min')
    expect(formatDurationHuman(86400)).toBe('1 dia')
    expect(formatDurationHuman(5400)).toBe('1 h 30 min')
    expect(formatDurationHuman(490)).toBe('8 min 10 s')
    expect(formatDurationHuman(45)).toBe('45 s')
  })
})

describe('getStatus', () => {
  it('respeita os limites originais', () => {
    expect(getStatus(0, false)).toBe('sem-registro')
    expect(getStatus(IDEAL_LITERS, true)).toBe('ideal')
    expect(getStatus(IDEAL_LITERS + 1, true)).toBe('atencao')
    expect(getStatus(ALERT_LITERS, true)).toBe('atencao')
    expect(getStatus(ALERT_LITERS + 1, true)).toBe('acima')
  })

  it('aceita metas proporcionais ao perfil da casa', () => {
    expect(getStatus(240, true, 240, 300)).toBe('ideal')
    expect(getStatus(241, true, 240, 300)).toBe('atencao')
    expect(getStatus(300, true, 240, 300)).toBe('atencao')
    expect(getStatus(301, true, 240, 300)).toBe('acima')
  })
})
