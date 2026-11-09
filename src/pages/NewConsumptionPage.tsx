import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Droplets,
  Lightbulb,
  Pause,
  Play,
  PlusCircle,
  RotateCcw,
  Timer,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '../components/PageHeader'
import { domesticActivities, type Activity } from '../data/activities'
import { curiosities } from '../data/curiosities'
import {
  calcConsumption,
  formatDuration,
  formatDurationHuman,
  getDefaultSeconds,
  parseDuration,
} from '../lib/consumption'
import { formatLiters, formatDateFull, todayKey } from '../lib/format'
import { addEntry } from '../lib/storage'

function referenceLabel(activity: Activity): string {
  if (activity.medida === 'minuto') {
    if (activity.unidade === 1) return `${activity.gasto} L por minuto`
    return `${activity.gasto} L a cada ${activity.unidade} min`
  }
  if (activity.medida === 'segundo') {
    return `${activity.gasto} L a cada ${activity.unidade} s`
  }
  if (activity.medida === 'dia') {
    return `${activity.gasto} L por dia`
  }
  return `${activity.gasto} L`
}

function quickOptions(activity: Activity): Array<{ label: string; seconds: number }> {
  switch (activity.medida) {
    case 'minuto':
      return [1, 5, 10, 30].map((minutes) => ({
        label: `${minutes} min`,
        seconds: minutes * 60,
      }))
    case 'segundo':
      return [3, 6, 10].map((seconds) => ({
        label: `${seconds} s`,
        seconds,
      }))
    case 'dia':
      return [
        { label: '6 h', seconds: 6 * 3600 },
        { label: '12 h', seconds: 12 * 3600 },
        { label: '1 dia', seconds: 86400 },
      ]
    default:
      return []
  }
}

export function NewConsumptionPage() {
  const navigate = useNavigate()
  const [activityId, setActivityId] = useState('')
  const [duration, setDuration] = useState('')
  const [date, setDate] = useState(todayKey())
  const [timer, setTimer] = useState<{ startedAt: number; base: number } | null>(null)

  const activity = domesticActivities.find((item) => item.id === activityId)
  const defaultSeconds = activity ? getDefaultSeconds(activity) : 0
  const seconds = parseDuration(duration)
  const isDurationValid = seconds !== null && seconds > 0
  const estimated = activity && isDurationValid ? calcConsumption(activity, seconds) : 0
  const options = useMemo(() => (activity ? quickOptions(activity) : []), [activity])
  const tip = useMemo(
    () => curiosities.domestico[Math.floor(Math.random() * curiosities.domestico.length)],
    [],
  )

  useEffect(() => {
    if (!timer) return
    const interval = window.setInterval(() => {
      const elapsed = (Date.now() - timer.startedAt) / 1000
      setDuration(formatDuration(timer.base + elapsed))
    }, 250)
    return () => window.clearInterval(interval)
  }, [timer])

  const selectActivity = (id: string) => {
    setTimer(null)
    setActivityId(id)
    const next = domesticActivities.find((item) => item.id === id)
    setDuration(next ? formatDuration(getDefaultSeconds(next)) : '')
  }

  const setDurationManually = (value: string) => {
    setTimer(null)
    setDuration(value)
  }

  const resetDuration = () => {
    if (!activity) return
    setTimer(null)
    setDuration(formatDuration(getDefaultSeconds(activity)))
  }

  const toggleTimer = () => {
    if (timer) {
      setTimer(null)
      return
    }
    const base = parseDuration(duration) ?? 0
    setTimer({ startedAt: Date.now(), base })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!activity) {
      toast.error('Escolha o consumo', {
        description: 'Selecione uma atividade antes de continuar.',
      })
      return
    }
    if (seconds === null) {
      toast.error('Duração inválida', {
        description: 'Use o formato HH:MM:SS, como 00:10:00.',
      })
      return
    }
    if (seconds <= 0) {
      toast.error('Informe a duração', {
        description: 'A duração precisa ser maior que zero.',
      })
      return
    }
    if (!date) {
      toast.error('Informe a data', {
        description: 'Escolha o dia em que o consumo aconteceu.',
      })
      return
    }

    const gasto = calcConsumption(activity, seconds)
    addEntry(date, {
      tipo: activity.acao,
      gasto,
      duracao: seconds,
      categoria: activity.categoria,
      medida: activity.medida,
      unidade: activity.unidade,
    })

    toast.success(`${formatLiters(gasto)} litros adicionados`, {
      description: `${activity.acao} · ${formatDurationHuman(seconds)} · ${formatDateFull(date)}`,
      action: {
        label: 'Ver histórico',
        onClick: () => navigate('/historico'),
      },
    })

    setTimer(null)
    setDuration(formatDuration(defaultSeconds))
  }

  return (
    <div>
      <PageHeader
        icon={PlusCircle}
        title="Novo consumo"
        description="Escolha a atividade, ajuste a duração e registre. O cálculo segue as referências do iWater original."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <form onSubmit={handleSubmit} className="surface-strong p-5 sm:p-6" noValidate>
          <div className="space-y-5">
            <div>
              <label htmlFor="consumo" className="field-label">
                O que aconteceu?
              </label>
              <select
                id="consumo"
                name="consumo"
                className="select-base"
                value={activityId}
                onChange={(event) => selectActivity(event.target.value)}
              >
                <option value="">Escolha o consumo</option>
                <optgroup label="Atividades domésticas">
                  {domesticActivities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.acao}
                    </option>
                  ))}
                </optgroup>
              </select>
              {activity ? (
                <p className="field-hint">
                  Referência: {referenceLabel(activity)}.
                </p>
              ) : (
                <p className="field-hint">
                  As referências de consumo são as mesmas do projeto original.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-end justify-between gap-3">
                <label htmlFor="duracao" className="field-label">
                  Duração
                </label>
                <button
                  type="button"
                  className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-navy/60 transition hover:text-navy"
                  onClick={resetDuration}
                  disabled={!activity}
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Padrão
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Clock
                    className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-agua-100/70"
                    aria-hidden="true"
                  />
                  <input
                    id="duracao"
                    name="duracao"
                    type="text"
                    inputMode="numeric"
                    className="input-base pl-10"
                    placeholder="00:00:00"
                    value={duration}
                    onChange={(event) => setDurationManually(event.target.value)}
                    aria-describedby="duracao-ajuda"
                  />
                </div>
                <button
                  type="button"
                  className="btn-secondary shrink-0 px-3.5"
                  onClick={toggleTimer}
                  aria-pressed={Boolean(timer)}
                  aria-label={timer ? 'Parar cronômetro' : 'Iniciar cronômetro'}
                  title={timer ? 'Parar cronômetro' : 'Iniciar cronômetro'}
                >
                  {timer ? (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Play className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">{timer ? 'Parar' : 'Iniciar'}</span>
                </button>
              </div>
              <p id="duracao-ajuda" className="field-hint">
                Aceita HH:MM:SS ou MM:SS. Use o cronômetro para medir na hora.
              </p>

              {activity ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="chip"
                    onClick={resetDuration}
                  >
                    Padrão: {formatDurationHuman(defaultSeconds)}
                  </button>
                  {options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      className="chip"
                      onClick={() => {
                        setTimer(null)
                        setDuration(formatDuration(option.seconds))
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="quando" className="field-label">
                Quando?
              </label>
              <div className="relative">
                <CalendarDays
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-agua-100/70"
                  aria-hidden="true"
                />
                <input
                  id="quando"
                  name="quando"
                  type="date"
                  className="date-input pl-10"
                  value={date}
                  max={todayKey()}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
              <p className="field-hint">Você pode registrar consumos de dias anteriores.</p>
            </div>

            <div className="rounded-2xl bg-agua-600/8 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
              <div>
                <p className="eyebrow">Consumo estimado</p>
                <p className="mt-1 text-3xl font-light tracking-tight">
                  {formatLiters(estimated)}{' '}
                  <span className="text-base font-normal text-navy/50">litros</span>
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-navy/55 sm:mt-0 sm:text-right">
                <Timer className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {isDurationValid
                    ? `Duração: ${formatDurationHuman(seconds)}`
                    : 'Informe uma duração válida'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={!activity || !isDurationValid}>
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Adicionar ao histórico
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <section className="surface p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agua-600/10 text-agua-800">
              <Droplets className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-sm font-semibold tracking-tight">Como o cálculo funciona</h2>
            <p className="mt-2 text-xs leading-relaxed text-navy/60">
              Cada atividade tem uma referência de litros por minuto, segundo ou dia. O
              iWater proporcionaliza essa referência pela duração informada.
            </p>
            <dl className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-navy/55">Meta ideal</dt>
                <dd className="font-semibold text-ideal">120 L / dia</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-navy/55">Alerta</dt>
                <dd className="font-semibold text-warning">150 L / dia</dd>
              </div>
            </dl>
          </section>

          <section className="surface p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agua-600/10 text-agua-800">
              <Lightbulb className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-sm font-semibold tracking-tight">Você sabia?</h2>
            <p className="mt-2 text-xs leading-relaxed text-navy/60">{tip}</p>
          </section>

          <p className="px-1 text-[0.7rem] leading-relaxed text-navy/45">
            Seus registros ficam salvos apenas neste navegador. Faça um backup na página
            de histórico quando quiser.
          </p>
        </aside>
      </div>
    </div>
  )
}
