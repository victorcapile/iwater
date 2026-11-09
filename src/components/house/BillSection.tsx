import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  CalendarDays,
  Gauge,
  Info,
  Plus,
  ReceiptText,
  Trash2,
  Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  removeBill,
  saveBill,
  type MeterReading,
  type WaterBill,
} from '../../lib/house'
import {
  getBillForMonth,
  getEffectiveCostPerM3,
  getMeterMonthSummary,
} from '../../lib/houseMath'
import {
  currentMonthKey,
  formatCurrency,
  formatM3,
  formatMonth,
  parseDecimalInput,
} from '../../lib/format'

interface BillSectionProps {
  bills: WaterBill[]
  readings: MeterReading[]
}

export function BillSection({ bills, readings }: BillSectionProps) {
  const [month, setMonth] = useState(currentMonthKey())
  const [consumption, setConsumption] = useState('')
  const [total, setTotal] = useState('')
  const [note, setNote] = useState('')

  const existing = getBillForMonth(bills, month)
  const meter = month ? getMeterMonthSummary(readings, month) : null
  const effectiveCostPerM3 = getEffectiveCostPerM3(bills)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const consumptionM3 = parseDecimalInput(consumption)
    const totalBRL = parseDecimalInput(total)

    if (!month) {
      toast.error('Informe o mês da conta')
      return
    }
    if (!Number.isFinite(consumptionM3) || consumptionM3 <= 0) {
      toast.error('Consumo inválido', {
        description: 'Informe o consumo em m³, como 12,5.',
      })
      return
    }
    if (!Number.isFinite(totalBRL) || totalBRL < 0) {
      toast.error('Valor inválido', {
        description: 'Informe o total da conta em reais.',
      })
      return
    }

    try {
      saveBill({ month, consumptionM3, totalBRL, note })
      toast.success(existing ? 'Conta atualizada' : 'Conta salva', {
        description: `${formatMonth(month)} · ${formatM3(consumptionM3)} m³ · ${formatCurrency(totalBRL)}.`,
      })
      setConsumption('')
      setTotal('')
      setNote('')
    } catch {
      toast.error('Não foi possível salvar a conta')
    }
  }

  const handleEdit = (bill: WaterBill) => {
    setMonth(bill.month)
    setConsumption(String(bill.consumptionM3).replace('.', ','))
    setTotal(String(bill.totalBRL).replace('.', ','))
    setNote(bill.note ?? '')
    document.getElementById('conta-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleRemove = (bill: WaterBill) => {
    const removed = removeBill(bill.id)
    if (!removed) return
    toast('Conta removida', {
      description: `${formatMonth(removed.month)} · ${formatCurrency(removed.totalBRL)}.`,
      action: {
        label: 'Desfazer',
        onClick: () =>
          saveBill({
            id: removed.id,
            month: removed.month,
            consumptionM3: removed.consumptionM3,
            totalBRL: removed.totalBRL,
            note: removed.note,
          }),
      },
    })
  }

  return (
    <div className="space-y-4">
      {bills.length > 0 ? (
        <section className="surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agua-600/10 text-agua-800">
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Tarifa efetiva</p>
              <p className="mt-1 text-2xl font-light tracking-tight">
                {formatCurrency(effectiveCostPerM3)}{' '}
                <span className="text-sm font-normal text-navy/50">por m³</span>
              </p>
              <p className="mt-1 text-xs text-navy/55">
                Calculada a partir da conta mais recente. Serve para estimar o custo do
                consumo medido pelo hidrômetro.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <form id="conta-form" className="surface-strong p-5 sm:p-6" onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
            <ReceiptText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Conta de água</h2>
            <p className="mt-1 text-xs leading-relaxed text-navy/55">
              Registre o total e o consumo em m³ da sua conta. O iWater calcula o custo
              por metro cúbico e estima o valor do mês.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="conta-mes" className="field-label">
              Mês de referência
            </label>
            <div className="relative">
              <CalendarDays
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-agua-100/70"
                aria-hidden="true"
              />
              <input
                id="conta-mes"
                type="month"
                className="date-input pl-10"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="conta-consumo" className="field-label">
              Consumo (m³)
            </label>
            <input
              id="conta-consumo"
              type="text"
              inputMode="decimal"
              className="input-base"
              placeholder="Ex.: 12,5"
              value={consumption}
              onChange={(event) => setConsumption(event.target.value)}
            />
            {meter && meter.m3 > 0 ? (
              <button
                type="button"
                className="chip mt-2"
                onClick={() => setConsumption(formatM3(meter.m3))}
              >
                <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                Usar leitura do mês: {formatM3(meter.m3)} m³
              </button>
            ) : null}
          </div>

          <div>
            <label htmlFor="conta-total" className="field-label">
              Total da conta (R$)
            </label>
            <input
              id="conta-total"
              type="text"
              inputMode="decimal"
              className="input-base"
              placeholder="Ex.: 89,90"
              value={total}
              onChange={(event) => setTotal(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="conta-nota" className="field-label">
              Observação <span className="font-normal text-navy/40">(opcional)</span>
            </label>
            <input
              id="conta-nota"
              type="text"
              className="input-base"
              placeholder="Ex.: conta com esgoto"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>

        {existing ? (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-warning/10 p-3 text-xs leading-relaxed text-warning">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Já existe uma conta para este mês. Salvar vai atualizar o registro existente.
          </p>
        ) : null}

        <button type="submit" className="btn-primary mt-5">
          <Plus className="h-4 w-4" aria-hidden="true" />
          {existing ? 'Atualizar conta' : 'Salvar conta'}
        </button>
      </form>

      <section className="surface p-5 sm:p-6" aria-labelledby="contas-titulo">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="contas-titulo" className="text-sm font-semibold tracking-tight">
              Contas registradas
            </h2>
            <p className="mt-1 text-xs text-navy/50">
              {bills.length === 0
                ? 'Nenhuma conta ainda.'
                : `${bills.length} ${bills.length === 1 ? 'conta' : 'contas'}.`}
            </p>
          </div>
        </div>

        {bills.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-navy/15 bg-white/25 p-5 text-center">
            <Info className="mx-auto h-5 w-5 text-agua-800" aria-hidden="true" />
            <p className="mt-2 text-xs leading-relaxed text-navy/55">
              Com a conta em mãos, o iWater transforma litros em reais e mostra quanto
              cada hábito pesa no orçamento.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {bills.map((bill) => {
              const costPerM3 =
                bill.consumptionM3 > 0 ? bill.totalBRL / bill.consumptionM3 : 0
              return (
                <li key={bill.id} className="entry-row">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-agua-600/10 text-agua-800">
                    <ReceiptText className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{formatMonth(bill.month)}</p>
                    <p className="text-xs text-navy/45">
                      {formatM3(bill.consumptionM3)} m³ · {formatCurrency(costPerM3)}/m³
                      {bill.note ? ` · ${bill.note}` : ''}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatCurrency(bill.totalBRL)}
                  </p>
                  <button
                    type="button"
                    className="icon-button h-8 w-8 text-navy/45 hover:bg-navy/6 hover:text-navy"
                    onClick={() => handleEdit(bill)}
                    aria-label={`Editar conta de ${formatMonth(bill.month)}`}
                    title="Editar conta"
                  >
                    <Wallet className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-button h-8 w-8 text-navy/35 hover:bg-danger/8 hover:text-danger"
                    onClick={() => handleRemove(bill)}
                    aria-label={`Remover conta de ${formatMonth(bill.month)}`}
                    title="Remover conta"
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
          A tarifa efetiva é o total da conta dividido pelo consumo em m³. Ela inclui
          água, esgoto e taxas, então pode variar de um mês para outro.
        </p>
      </div>
    </div>
  )
}
