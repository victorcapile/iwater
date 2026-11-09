export interface ConsumptionEntry {
  /** Nome da atividade, mantido no mesmo formato do projeto original. */
  tipo: string
  /** Litros de água. */
  gasto: number
  /** Duração em segundos (quando aplicável). */
  duracao?: number
  categoria?: string
  quantidade?: number
  medida?: string
  unidade?: number
}

export interface DayRecord {
  date: string
  entries: ConsumptionEntry[]
  total: number
}

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MEMORY_STORAGE = new Map<string, string>()
let memoryOnly = false

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  if (memoryOnly) return null
  try {
    const testKey = '__iwater_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return window.localStorage
  } catch {
    memoryOnly = true
    return null
  }
}

function getItem(key: string): string | null {
  const storage = getStorage()
  if (storage) return storage.getItem(key)
  return MEMORY_STORAGE.get(key) ?? null
}

function setItem(key: string, value: string): void {
  const storage = getStorage()
  if (storage) storage.setItem(key, value)
  else MEMORY_STORAGE.set(key, value)
}

function removeItem(key: string): void {
  const storage = getStorage()
  if (storage) storage.removeItem(key)
  else MEMORY_STORAGE.delete(key)
}

function allKeys(): string[] {
  const storage = getStorage()
  if (storage) {
    const keys: string[] = []
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (key) keys.push(key)
    }
    return keys
  }
  return [...MEMORY_STORAGE.keys()]
}

export function isDateKey(value: string): boolean {
  return DATE_KEY_PATTERN.test(value)
}

export function normalizeEntry(value: unknown): ConsumptionEntry | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Record<string, unknown>
  const gasto = Number(candidate.gasto)
  if (!Number.isFinite(gasto) || gasto < 0) return null

  const entry: ConsumptionEntry = {
    tipo:
      typeof candidate.tipo === 'string' && candidate.tipo.trim()
        ? candidate.tipo.trim()
        : 'Consumo',
    gasto,
  }

  if (typeof candidate.duracao === 'number' && Number.isFinite(candidate.duracao)) {
    entry.duracao = candidate.duracao
  }
  if (typeof candidate.categoria === 'string') entry.categoria = candidate.categoria
  if (typeof candidate.quantidade === 'number' && Number.isFinite(candidate.quantidade)) {
    entry.quantidade = candidate.quantidade
  }
  if (typeof candidate.medida === 'string') entry.medida = candidate.medida
  if (typeof candidate.unidade === 'number' && Number.isFinite(candidate.unidade)) {
    entry.unidade = candidate.unidade
  }

  return entry
}

function normalizeEntries(value: unknown): ConsumptionEntry[] {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => normalizeEntry(entry))
    .filter((entry): entry is ConsumptionEntry => entry !== null)
}

function readRawEntries(date: string): ConsumptionEntry[] {
  const raw = getItem(date)
  if (!raw) return []
  try {
    return normalizeEntries(JSON.parse(raw))
  } catch {
    return []
  }
}

function writeEntries(date: string, entries: ConsumptionEntry[]): void {
  if (entries.length === 0) {
    removeItem(date)
    return
  }
  setItem(date, JSON.stringify(entries))
}

export function getDay(date: string): DayRecord | null {
  if (!isDateKey(date)) return null
  const entries = readRawEntries(date)
  if (entries.length === 0) return null
  return {
    date,
    entries,
    total: entries.reduce((sum, entry) => sum + entry.gasto, 0),
  }
}

export function getDays(): DayRecord[] {
  return allKeys()
    .filter(isDateKey)
    .map((date) => getDay(date))
    .filter((day): day is DayRecord => day !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function addEntry(date: string, entry: ConsumptionEntry): void {
  if (!isDateKey(date)) throw new Error('Data inválida')
  const normalized = normalizeEntry(entry)
  if (!normalized) throw new Error('Consumo inválido')
  const entries = readRawEntries(date)
  entries.push(normalized)
  writeEntries(date, entries)
  notify()
}

export function removeEntry(date: string, index: number): ConsumptionEntry | null {
  if (!isDateKey(date)) return null
  const entries = readRawEntries(date)
  if (index < 0 || index >= entries.length) return null
  const [removed] = entries.splice(index, 1)
  writeEntries(date, entries)
  notify()
  return removed ?? null
}

export function restoreEntry(date: string, entry: ConsumptionEntry, index: number): void {
  if (!isDateKey(date)) return
  const entries = readRawEntries(date)
  const safeIndex = Math.max(0, Math.min(index, entries.length))
  entries.splice(safeIndex, 0, entry)
  writeEntries(date, entries)
  notify()
}

export function removeDay(date: string): void {
  if (!isDateKey(date)) return
  removeItem(date)
  notify()
}

export function clearAllData(): void {
  allKeys()
    .filter(isDateKey)
    .forEach((key) => removeItem(key))
  notify()
}

export interface BackupData {
  app: 'iWater'
  version: 2
  exportedAt: string
  days: Record<string, ConsumptionEntry[]>
}

export function createBackup(): BackupData {
  return {
    app: 'iWater',
    version: 2,
    exportedAt: new Date().toISOString(),
    days: Object.fromEntries(getDays().map((day) => [day.date, day.entries])),
  }
}

export interface ImportResult {
  days: number
  entries: number
}

/** Importa um backup e mescla com os dados atuais sem duplicar entradas idênticas. */
export function importBackup(raw: string): ImportResult {
  const parsed: unknown = JSON.parse(raw)
  let days: Record<string, unknown> = {}

  if (
    parsed &&
    typeof parsed === 'object' &&
    'days' in parsed &&
    parsed.days &&
    typeof parsed.days === 'object'
  ) {
    days = parsed.days as Record<string, unknown>
  } else if (parsed && typeof parsed === 'object') {
    days = parsed as Record<string, unknown>
  } else {
    throw new Error('Arquivo de backup inválido')
  }

  let importedDays = 0
  let importedEntries = 0

  for (const [date, value] of Object.entries(days)) {
    if (!isDateKey(date)) continue
    const incoming = normalizeEntries(value)
    if (incoming.length === 0) continue

    const existing = readRawEntries(date)
    const seen = new Set(existing.map((entry) => JSON.stringify(entry)))
    const merged = [...existing]

    for (const entry of incoming) {
      const signature = JSON.stringify(entry)
      if (seen.has(signature)) continue
      seen.add(signature)
      merged.push(entry)
      importedEntries += 1
    }

    if (merged.length !== existing.length) {
      writeEntries(date, merged)
      importedDays += 1
    }
  }

  notify()
  return { days: importedDays, entries: importedEntries }
}

type Listener = () => void
const listeners = new Set<Listener>()
let storageListenerAttached = false

function notify(): void {
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)

  if (!storageListenerAttached && typeof window !== 'undefined') {
    window.addEventListener('storage', notify)
    storageListenerAttached = true
  }

  return () => {
    listeners.delete(listener)
  }
}
