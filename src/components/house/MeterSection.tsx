import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  CalendarDays,
  Gauge,
  Info,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  addMeterReading,
  removeMeterReading,
  type MeterReading,
} from '../../lib/house'
import { getLatestMeterInterval, getMeterIntervals } from '../../lib/houseMath'
import {
  formatDateFull,
  formatM3,
  parseDecimalInput,
  todayKey,
} from '../../lib/format'

interface MeterSectionProps {
  readings: MeterReading[]
}

export function MeterSection({ readings }: MeterSectionProps) {
  const [date, setDate] = useState(todayKey())
  const [reading, setReading] = useState('')
  const [note, setNote] = useState('')

  const latest = readings[0] ?? null
  const latestInterval = getLatestMeterInterval(readings)
  const intervalByEndId = new Map(
    getMeterIntervals(readings).map((interval) => [interval.id, interval]),
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = parseDecimalInput(reading)
    if (!date) {
      toast.error('Informe a data da leitura')
      return
    }
    if (!Number.isFinite(value) || value < 0) {
      toast.error('Leitura inválida', {
        description: 'Use um número em m³, como 123,456.',
      })
      return
    }
    if (latest) {
      if (date < latest.date) {
        toast.error('Data anterior à última leitura', {
          description: `A última leitura foi em ${formatDateFull(latest.date)}.`,
        })
        return
      }
      if (value < latest.reading) {
        toast.error('A leitura não pode diminuir', {
          description: `A última leitura foi ${formatM3(latest.reading)} m³.`,
        })
        return
      }
    }

    try {
      const added = addMeterReading({ date, reading: value, note })
      const difference = latest ? value - latest.reading : 0

      toast.success('Leitura adicionada', {
        description: latest
          ? `${formatM3(difference)} m³ desde a leitura de ${formatDateFull(latest.date)}.`
          : 'A primeira leitura é a base. A próxima calcula o consumo real.',
      })

      setReading('')
      setNote('')
      setDate(todayKey())
      return added
    } catch {
      toast.error('Não foi possível salvar a leitura')
    }
  }

  const handleRemove = (item: MeterReading) => {
    const removed = removeMeterReading(item.id)
    if (!removed) return
    toast('Leitura removida', {
      description: `${formatM3(removed.reading)} m³ em ${formatDateFull(removed.date)}.`,
      action: {
        label: 'Desfazer',
        onClick: () =>
          addMeterReading({
            id: removed.id,
            date: removed.date,
            reading: removed.reading,
            note: removed.note,
          }),
      },
    })
  }

  return (
    <div className="space-y-4">
      {latestInterval ? (
        <section className="surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agua-600/10 text-agua-800">
              <Gauge className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Último período medido</p>
              <p className="mt-1 text-2xl font-light tracking-tight">
                {formatM3(latestInterval.m3)}{' '}
                <span className="text-sm font-normal text-navy/50">m³</span>
              </p>
              <p className="mt-1 text-xs text-navy/55">
                De {formatDateFull(latestInterval.startDate)} a{' '}
                {formatDateFull(latestInterval.endDate)} ·{' '}
                {formatM3(latestInterval.m3 / Math.max(1, latestInterval.days))} m³/dia
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <form className="surface-strong p-5 sm:p-6" onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
            <Gauge className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Nova leitura do hidrômetro</h2>
            <p className="mt-1 text-xs leading-relaxed text-navy/55">
              Informe a leitura acumulada em m³. O iWater calcula a diferença entre as
              leituras para saber o consumo real.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="leitura-data" className="field-label">
              Data
            </label>
            <div className="relative">
              <CalendarDays
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-agua-100/70"
                aria-hidden="true"
              />
              <input
                id="leitura-data"
                type="date"
                className="date-input pl-10"
                value={date}
                max={todayKey()}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="leitura-valor" className="field-label">
              Leitura (m³)
            </label>
            <input
              id="leitura-valor"
              type="text"
              inputMode="decimal"
              className="input-base"
              placeholder="Ex.: 123,456"
              value={reading}
              onChange={(event) => setReading(event.target.value)}
              aria-describedby="leitura-valor-ajuda"
            />
            <p id="leitura-valor-ajuda" className="field-hint">
              {latest
                ? `Última leitura: ${formatM3(latest.reading)} m³ em ${formatDateFull(latest.date)}.`
                : 'Sem leituras ainda. A primeira será a base.'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="leitura-nota" className="field-label">
              Observação <span className="font-normal text-navy/40">(opcional)</span>
            </label>
            <input
              id="leitura-nota"
              type="text"
              className="input-base"
              placeholder="Ex.: leitura antes de viajar"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-5">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Adicionar leitura
        </button>
      </form>

      <section className="surface p-5 sm:p-6" aria-labelledby="leituras-titulo">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="leituras-titulo" className="text-sm font-semibold tracking-tight">
              Leituras registradas
            </h2>
            <p className="mt-1 text-xs text-navy/50">
              {readings.length === 0
                ? 'Nenhuma leitura ainda.'
                : `${readings.length} ${readings.length === 1 ? 'leitura' : 'leituras'}.`}
            </p>
          </div>
        </div>

        {readings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-navy/15 bg-white/25 p-5 text-center">
            <Info className="mx-auto h-5 w-5 text-agua-800" aria-hidden="true" />
            <p className="mt-2 text-xs leading-relaxed text-navy/55">
              A primeira leitura é só a base. A partir da segunda, o iWater mostra o
              consumo real e a média diária.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {readings.map((item) => {
              const interval = intervalByEndId.get(item.id)
              return (
                <li key={item.id} className="entry-row">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-agua-600/10 text-agua-800">
                    <Gauge className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {formatM3(item.reading)}{' '}
                      <span className="text-xs font-normal text-navy/45">m³</span>
                    </p>
                    <p className="text-xs text-navy/45">
                      {formatDateFull(item.date)}
                      {interval
                        ? ` · ${formatM3(interval.m3)} m³ em ${interval.days} ${
                            interval.days === 1 ? 'dia' : 'dias'
                          }`
                        : ' · primeira leitura'}
                    </p>
                    {item.note ? (
                      <p className="mt-0.5 text-[0.7rem] text-navy/45">{item.note}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="icon-button h-8 w-8 text-navy/35 hover:bg-danger/8 hover:text-danger"
                    onClick={() => handleRemove(item)}
                    aria-label={`Remover leitura de ${formatDateFull(item.date)}`}
                    title="Remover leitura"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className="flex items-start gap-2 rounded-2xl bg-white/30 p-4 text-xs leading-relaxed text-navy/55">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-agua-800" aria-hidden="true" />
        <p>
          Leia apenas os números pretos do hidrômetro, que indicam metros cúbicos (m³).
          Os números vermelhos são litros e podem ser ignorados para este controle.
        </p>
      </div>
    </div>
  )
}
