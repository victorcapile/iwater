import type { Activity } from '../data/activities'

/** Metas preservadas do iWater original (litros por dia). */
export const IDEAL_LITERS = 120
export const ALERT_LITERS = 150
export const MAX_LITERS = 165

export type ConsumptionStatus = 'sem-registro' | 'ideal' | 'atencao' | 'acima'

const SECONDS_PER_UNIT: Record<string, number> = {
  segundo: 1,
  minuto: 60,
  hora: 3600,
  dia: 86400,
}

/**
 * Calcula o gasto em litros de uma atividade baseada em tempo.
 * Mantém a mesma matemática do projeto original.
 */
export function calcConsumption(activity: Activity, seconds: number): number {
  const unitSeconds = SECONDS_PER_UNIT[activity.medida]
  if (!unitSeconds || !Number.isFinite(seconds) || seconds <= 0 || activity.unidade <= 0) {
    return 0
  }
  return (activity.gasto * (seconds / unitSeconds)) / activity.unidade
}

/** Duração padrão sugerida para cada atividade. */
export function getDefaultSeconds(activity: Activity): number {
  switch (activity.medida) {
    case 'minuto':
      return activity.unidade * 60
    case 'segundo':
      return activity.unidade
    case 'hora':
      return activity.unidade * 3600
    case 'dia':
      return 86400
    default:
      return 0
  }
}

/** Converte uma duração em segundos para o formato HH:MM:SS. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

/** Texto curto e humano para uma duração em segundos. */
export function formatDurationHuman(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds))
  if (safe === 0) return '0 s'

  if (safe >= 86400) {
    const days = Math.floor(safe / 86400)
    const hours = Math.floor((safe % 86400) / 3600)
    return `${days} ${days === 1 ? 'dia' : 'dias'}${hours ? ` ${hours} h` : ''}`
  }

  if (safe >= 3600) {
    const hours = Math.floor(safe / 3600)
    const minutes = Math.floor((safe % 3600) / 60)
    return `${hours} h${minutes ? ` ${minutes} min` : ''}`
  }

  if (safe >= 60) {
    const minutes = Math.floor(safe / 60)
    const seconds = safe % 60
    return `${minutes} min${seconds ? ` ${seconds} s` : ''}`
  }

  return `${safe} s`
}

/**
 * Aceita "HH:MM:SS", "MM:SS" ou apenas segundos.
 * Retorna null quando o valor é inválido.
 */
export function parseDuration(value: string): number | null {
  const clean = value.trim()
  if (!clean) return null
  const parts = clean.split(':').map((part) => Number(part))
  if (parts.some((part) => !Number.isFinite(part) || part < 0)) return null

  if (parts.length === 1) {
    return Math.round(parts[0])
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts
    if (seconds >= 60) return null
    return Math.round(minutes * 60 + seconds)
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    if (minutes >= 60 || seconds >= 60) return null
    return Math.round(hours * 3600 + minutes * 60 + seconds)
  }

  return null
}

export function getStatus(total: number, hasEntries = true): ConsumptionStatus {
  if (!hasEntries || total <= 0) return 'sem-registro'
  if (total <= IDEAL_LITERS) return 'ideal'
  if (total <= ALERT_LITERS) return 'atencao'
  return 'acima'
}

/**
 * O boneco do gráfico muda de pose conforme o consumo — identidade visual
 * preservada do projeto original.
 */
export function getGaugeImage(total: number): string {
  if (total > ALERT_LITERS) {
    return `${import.meta.env.BASE_URL}img/grafico-alerta-vermelho.png`
  }
  if (total > IDEAL_LITERS) {
    return `${import.meta.env.BASE_URL}img/grafico-alerta.png`
  }
  return `${import.meta.env.BASE_URL}img/grafico.png`
}
