import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  Download,
  Droplet,
  Droplets,
  Eraser,
  PlusCircle,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useConsumptionDays } from '../hooks/useConsumptionDays'
import { formatDurationHuman, getStatus } from '../lib/consumption'
import {
  formatDateFull,
  formatDateLong,
  formatInteger,
  formatLiters,
  todayKey,
} from '../lib/format'
import {
  clearAllData,
  createBackup,
  importBackup,
  removeDay,
  removeEntry,
  restoreEntry,
} from '../lib/storage'

export function HistoryPage() {
  const days = useConsumptionDays()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dayToDelete, setDayToDelete] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importing, setImporting] = useState(false)

  const totalLiters = days.reduce((sum, day) => sum + day.total, 0)
  const totalEntries = days.reduce((sum, day) => sum + day.entries.length, 0)
  const average = days.length ? totalLiters / days.length : 0

  const handleRemoveEntry = (date: string, index: number) => {
    const removed = removeEntry(date, index)
    if (!removed) return
    toast('Consumo removido', {
      description: `${removed.tipo} · ${formatLiters(removed.gasto)} L`,
      action: {
        label: 'Desfazer',
        onClick: () => restoreEntry(date, removed, index),
      },
    })
  }

  const handleDeleteDay = () => {
    if (!dayToDelete) return
    const date = dayToDelete
    removeDay(date)
    toast.success('Dia removido do histórico', {
      description: formatDateFull(date),
    })
  }

  const handleExport = () => {
    const backup = createBackup()
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `iwater-backup-${todayKey()}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    toast.success('Backup exportado', {
      description: 'Guarde o arquivo em um lugar seguro.',
    })
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const result = importBackup(text)
      if (result.entries === 0) {
        toast.info('Nenhum registro novo encontrado', {
          description: 'O arquivo pode já ter sido importado antes.',
        })
      } else {
        toast.success(`${formatInteger(result.entries)} registros importados`, {
          description: `Distribuídos em ${result.days} ${result.days === 1 ? 'dia' : 'dias'}.${
            result.house ? ' Perfil, leituras e contas também foram importados.' : ''
          }`,
        })
      }
    } catch {
      toast.error('Não foi possível importar', {
        description: 'Verifique se o arquivo é um backup JSON válido do iWater.',
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={BookOpen}
        title="Histórico"
        description="Tudo o que você registrou, organizado por dia. Remova itens individuais ou exporte um backup."
      />

      {days.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Seu histórico está vazio"
          description="Registre o primeiro consumo para começar a acompanhar seus hábitos e ver a evolução nos gráficos."
          action={
            <Link to="/novo-consumo" className="btn-primary">
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Registrar consumo
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="stat-card">
              <CalendarDays className="h-4 w-4 text-agua-800" aria-hidden="true" />
              <p className="stat-label mt-2">Dias</p>
              <p className="stat-value">{formatInteger(days.length)}</p>
            </div>
            <div className="stat-card">
              <Droplets className="h-4 w-4 text-agua-800" aria-hidden="true" />
              <p className="stat-label mt-2">Total</p>
              <p className="stat-value">
                {formatLiters(totalLiters)}
                <span className="text-xs font-normal text-navy/45"> L</span>
              </p>
            </div>
            <div className="stat-card">
              <Droplet className="h-4 w-4 text-agua-800" aria-hidden="true" />
              <p className="stat-label mt-2">Média</p>
              <p className="stat-value">
                {formatLiters(average)}
                <span className="text-xs font-normal text-navy/45"> L</span>
              </p>
            </div>
          </div>

          <p className="mb-4 text-xs text-navy/50">
            {formatInteger(totalEntries)} {totalEntries === 1 ? 'registro' : 'registros'} no total.
            Remova um item pela lixeira; você pode desfazer em seguida.
          </p>

          <div className="space-y-4">
            {days.map((day) => {
              const status = getStatus(day.total, day.entries.length > 0)
              return (
                <article key={day.date} className="surface overflow-hidden p-4 sm:p-5">
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">
                        {formatDateLong(day.date)}
                      </h2>
                      <p className="mt-0.5 text-xs text-navy/45">{formatDateFull(day.date)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusBadge status={status} />
                      <button
                        type="button"
                        className="icon-button ml-1 text-danger/70 hover:bg-danger/8 hover:text-danger"
                        onClick={() => setDayToDelete(day.date)}
                        aria-label={`Excluir todo o dia ${formatDateFull(day.date)}`}
                        title="Excluir dia"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </header>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-light tracking-tight">
                      {formatLiters(day.total)}
                    </span>
                    <span className="text-xs font-semibold text-navy/45">litros no total</span>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {day.entries.map((entry, index) => (
                      <li className="entry-row" key={`${entry.tipo}-${index}`}>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-agua-600/10 text-agua-800">
                          <Droplet className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{entry.tipo}</p>
                          <p className="text-xs text-navy/45">
                            {typeof entry.duracao === 'number' && entry.duracao > 0
                              ? formatDurationHuman(entry.duracao)
                              : entry.categoria ?? 'Consumo registrado'}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatLiters(entry.gasto)}{' '}
                          <span className="text-xs font-normal text-navy/45">L</span>
                        </p>
                        <button
                          type="button"
                          className="icon-button h-8 w-8 text-navy/35 hover:bg-danger/8 hover:text-danger"
                          onClick={() => handleRemoveEntry(day.date, index)}
                          aria-label={`Remover ${entry.tipo} de ${formatDateFull(day.date)}`}
                          title="Remover item"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>

          <section className="surface mt-6 p-5" aria-labelledby="dados-titulo">
            <h2 id="dados-titulo" className="text-sm font-semibold tracking-tight">
              Seus dados
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-navy/55">
              O iWater guarda tudo somente neste navegador. O backup inclui o histórico,
              o perfil da casa, as leituras do hidrômetro e as contas de água. Exporte
              para não perder os dados ao limpar o navegador ou trocar de dispositivo.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={handleExport}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Exportar backup
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {importing ? 'Importando…' : 'Importar backup'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={handleImport}
                aria-label="Escolher arquivo de backup"
              />
              <button
                type="button"
                className="btn-danger"
                onClick={() => setConfirmClear(true)}
              >
                <Eraser className="h-4 w-4" aria-hidden="true" />
                Apagar tudo
              </button>
            </div>
            <p className="footer-note mt-3">
              A importação mescla os registros do arquivo com os atuais, sem duplicar
              consumos idênticos.
            </p>
          </section>
        </>
      )}

      <ConfirmDialog
        open={dayToDelete !== null}
        title="Excluir este dia?"
        description={
          dayToDelete
            ? `Todos os registros de ${formatDateFull(dayToDelete)} serão removidos. Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir dia"
        destructive
        onConfirm={handleDeleteDay}
        onClose={() => setDayToDelete(null)}
      />

      <ConfirmDialog
        open={confirmClear}
        title="Apagar todos os dados?"
        description="Todo o histórico, o perfil da casa, as leituras do hidrômetro e as contas de água serão removidos deste navegador. Se quiser guardar uma cópia, cancele e exporte um backup antes."
        confirmLabel="Apagar tudo"
        destructive
        onConfirm={() => {
          clearAllData()
          toast.success('Histórico apagado')
        }}
        onClose={() => setConfirmClear(false)}
      />
    </div>
  )
}
