export type HousingType = 'casa' | 'apartamento'

export interface HouseProfile {
  residents: number
  goalPerPerson: number
  housingType: HousingType
  hasGarden: boolean
  hasPool: boolean
}

export interface MeterReading {
  id: string
  /** Data da leitura no formato AAAA-MM-DD. */
  date: string
  /** Leitura acumulada do hidrômetro em m³. */
  reading: number
  note?: string
}

export interface WaterBill {
  id: string
  /** Mês de referência no formato AAAA-MM. */
  month: string
  consumptionM3: number
  totalBRL: number
  note?: string
}

export interface HouseData {
  profile: HouseProfile
  readings: MeterReading[]
  bills: WaterBill[]
}

export const DEFAULT_PROFILE: HouseProfile = {
  residents: 1,
  goalPerPerson: 120,
  housingType: 'casa',
  hasGarden: false,
  hasPool: false,
}

const KEYS = {
  profile: 'iwater:profile:v1',
  readings: 'iwater:meter-readings:v1',
  bills: 'iwater:bills:v1',
} as const

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/
const MEMORY_STORAGE = new Map<string, string>()
let memoryOnly = false

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  if (memoryOnly) return null
  try {
    const testKey = '__iwater_house_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return window.localStorage
  } catch {
    memoryOnly = true
    return null
  }
}

function readRaw(key: string): string | null {
  const storage = getStorage()
  if (storage) return storage.getItem(key)
  return MEMORY_STORAGE.get(key) ?? null
}

function writeRaw(key: string, value: string): void {
  const storage = getStorage()
  if (storage) storage.setItem(key, value)
  else MEMORY_STORAGE.set(key, value)
}

function removeRaw(key: string): void {
  const storage = getStorage()
  if (storage) storage.removeItem(key)
  else MEMORY_STORAGE.delete(key)
}

function readJson(key: string): unknown {
  const raw = readRaw(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  writeRaw(key, JSON.stringify(value))
}

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function normalizeProfile(value: unknown): HouseProfile {
  if (!value || typeof value !== 'object') return { ...DEFAULT_PROFILE }
  const candidate = value as Record<string, unknown>

  const residents = Number(candidate.residents)
  const goalPerPerson = Number(candidate.goalPerPerson)

  return {
    residents: Number.isFinite(residents)
      ? clamp(Math.round(residents), 1, 50)
      : DEFAULT_PROFILE.residents,
    goalPerPerson: Number.isFinite(goalPerPerson)
      ? clamp(Math.round(goalPerPerson), 20, 1000)
      : DEFAULT_PROFILE.goalPerPerson,
    housingType: candidate.housingType === 'apartamento' ? 'apartamento' : 'casa',
    hasGarden: candidate.hasGarden === true,
    hasPool: candidate.hasPool === true,
  }
}

function normalizeReading(value: unknown): MeterReading | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Record<string, unknown>
  const date = typeof candidate.date === 'string' ? candidate.date : ''
  const reading = Number(candidate.reading)
  if (!DATE_KEY_PATTERN.test(date) || !Number.isFinite(reading) || reading < 0) {
    return null
  }

  const normalized: MeterReading = {
    id:
      typeof candidate.id === 'string' && candidate.id.trim()
        ? candidate.id
        : createId('leitura'),
    date,
    reading,
  }
  if (typeof candidate.note === 'string' && candidate.note.trim()) {
    normalized.note = candidate.note.trim()
  }
  return normalized
}

function normalizeBill(value: unknown): WaterBill | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Record<string, unknown>
  const month = typeof candidate.month === 'string' ? candidate.month : ''
  const consumptionM3 = Number(candidate.consumptionM3)
  const totalBRL = Number(candidate.totalBRL)
  if (
    !MONTH_KEY_PATTERN.test(month) ||
    !Number.isFinite(consumptionM3) ||
    consumptionM3 <= 0 ||
    !Number.isFinite(totalBRL) ||
    totalBRL < 0
  ) {
    return null
  }

  const normalized: WaterBill = {
    id:
      typeof candidate.id === 'string' && candidate.id.trim()
        ? candidate.id
        : createId('conta'),
    month,
    consumptionM3,
    totalBRL,
  }
  if (typeof candidate.note === 'string' && candidate.note.trim()) {
    normalized.note = candidate.note.trim()
  }
  return normalized
}

function sortReadingsDesc(readings: MeterReading[]): MeterReading[] {
  return [...readings].sort(
    (a, b) => b.date.localeCompare(a.date) || b.reading - a.reading,
  )
}

function sortBillsDesc(bills: WaterBill[]): WaterBill[] {
  return [...bills].sort((a, b) => b.month.localeCompare(a.month))
}

export function getProfile(): HouseProfile {
  return normalizeProfile(readJson(KEYS.profile))
}

export function saveProfile(profile: HouseProfile): HouseProfile {
  const normalized = normalizeProfile(profile)
  writeJson(KEYS.profile, normalized)
  notify()
  return normalized
}

export function getMeterReadings(): MeterReading[] {
  const raw = readJson(KEYS.readings)
  if (!Array.isArray(raw)) return []
  return sortReadingsDesc(
    raw
      .map((value) => normalizeReading(value))
      .filter((value): value is MeterReading => value !== null),
  )
}

export function addMeterReading(
  input: Omit<MeterReading, 'id'> & { id?: string },
): MeterReading {
  const normalized = normalizeReading(input)
  if (!normalized) throw new Error('Leitura inválida')

  const readings = getMeterReadings()
  if (!readings.some((reading) => reading.id === normalized.id)) {
    readings.push(normalized)
  }
  writeJson(KEYS.readings, sortReadingsDesc(readings))
  notify()
  return normalized
}

export function removeMeterReading(id: string): MeterReading | null {
  const readings = getMeterReadings()
  const removed = readings.find((reading) => reading.id === id) ?? null
  if (!removed) return null
  writeJson(
    KEYS.readings,
    readings.filter((reading) => reading.id !== id),
  )
  notify()
  return removed
}

export function getBills(): WaterBill[] {
  const raw = readJson(KEYS.bills)
  if (!Array.isArray(raw)) return []
  return sortBillsDesc(
    raw
      .map((value) => normalizeBill(value))
      .filter((value): value is WaterBill => value !== null),
  )
}

/** Uma conta por mês; salvar de novo no mesmo mês atualiza o registro. */
export function saveBill(input: Omit<WaterBill, 'id'> & { id?: string }): WaterBill {
  const normalized = normalizeBill(input)
  if (!normalized) throw new Error('Conta inválida')

  const bills = getBills()
  const existing = bills.find((bill) => bill.month === normalized.month)
  const next = existing
    ? { ...normalized, id: existing.id }
    : normalized

  writeJson(
    KEYS.bills,
    sortBillsDesc([
      ...bills.filter((bill) => bill.month !== normalized.month),
      next,
    ]),
  )
  notify()
  return next
}

export function removeBill(id: string): WaterBill | null {
  const bills = getBills()
  const removed = bills.find((bill) => bill.id === id) ?? null
  if (!removed) return null
  writeJson(
    KEYS.bills,
    bills.filter((bill) => bill.id !== id),
  )
  notify()
  return removed
}

export function getHouseData(): HouseData {
  return {
    profile: getProfile(),
    readings: getMeterReadings(),
    bills: getBills(),
  }
}

export function clearHouseData(): void {
  removeRaw(KEYS.profile)
  removeRaw(KEYS.readings)
  removeRaw(KEYS.bills)
  notify()
}

export interface MergeHouseResult {
  profile: boolean
  readings: number
  bills: number
}

/** Mescla dados de um backup sem duplicar leituras e contas pelo id. */
export function mergeHouseData(value: unknown): MergeHouseResult {
  if (!value || typeof value !== 'object') {
    return { profile: false, readings: 0, bills: 0 }
  }

  const candidate = value as Record<string, unknown>
  let profileImported = false

  if (candidate.profile && typeof candidate.profile === 'object') {
    saveProfile(normalizeProfile(candidate.profile))
    profileImported = true
  }

  let readingsAdded = 0
  if (Array.isArray(candidate.readings)) {
    const existing = getMeterReadings()
    const ids = new Set(existing.map((reading) => reading.id))
    const merged = [...existing]
    for (const raw of candidate.readings) {
      const reading = normalizeReading(raw)
      if (!reading || ids.has(reading.id)) continue
      ids.add(reading.id)
      merged.push(reading)
      readingsAdded += 1
    }
    if (readingsAdded > 0) writeJson(KEYS.readings, sortReadingsDesc(merged))
  }

  let billsAdded = 0
  if (Array.isArray(candidate.bills)) {
    const existing = getBills()
    const ids = new Set(existing.map((bill) => bill.id))
    const merged = [...existing]
    for (const raw of candidate.bills) {
      const bill = normalizeBill(raw)
      if (!bill || ids.has(bill.id)) continue
      const sameMonth = merged.some((item) => item.month === bill.month)
      if (sameMonth) continue
      ids.add(bill.id)
      merged.push(bill)
      billsAdded += 1
    }
    if (billsAdded > 0) writeJson(KEYS.bills, sortBillsDesc(merged))
  }

  if (readingsAdded > 0 || billsAdded > 0) notify()

  return {
    profile: profileImported,
    readings: readingsAdded,
    bills: billsAdded,
  }
}

type Listener = () => void
const listeners = new Set<Listener>()
let storageListenerAttached = false

function notify(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeHouse(listener: Listener): () => void {
  listeners.add(listener)

  if (!storageListenerAttached && typeof window !== 'undefined') {
    window.addEventListener('storage', notify)
    storageListenerAttached = true
  }

  return () => {
    listeners.delete(listener)
  }
}
