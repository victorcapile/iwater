import { useMemo, useState } from 'react'
import { Gauge, House, ReceiptText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { PageHeader } from '../components/PageHeader'
import { BillSection } from '../components/house/BillSection'
import { MeterSection } from '../components/house/MeterSection'
import { MonthSummary } from '../components/house/MonthSummary'
import { ProfileForm } from '../components/house/ProfileForm'
import { useConsumptionDays } from '../hooks/useConsumptionDays'
import { useHouseData } from '../hooks/useHouseData'
import { getMonthOptions } from '../lib/houseMath'
import { currentMonthKey } from '../lib/format'

type TabId = 'perfil' | 'hidrometro' | 'conta'

interface Tab {
  id: TabId
  label: string
  icon: LucideIcon
  count: string
  ariaLabel: string
}

export function HousePage() {
  const house = useHouseData()
  const activityDays = useConsumptionDays()
  const [month, setMonth] = useState(currentMonthKey())
  const [tab, setTab] = useState<TabId>(() =>
    house.readings.length > 0 || house.bills.length > 0 ? 'hidrometro' : 'perfil',
  )

  const months = useMemo(() => {
    const options = getMonthOptions(house.readings, house.bills)
    return options.includes(month)
      ? options
      : [month, ...options].sort().reverse()
  }, [house.readings, house.bills, month])

  const tabs: Tab[] = [
    {
      id: 'perfil',
      label: 'Perfil',
      icon: House,
      count: `${house.profile.residents}`,
      ariaLabel: `${house.profile.residents} ${
        house.profile.residents === 1 ? 'morador' : 'moradores'
      }`,
    },
    {
      id: 'hidrometro',
      label: 'Hidrômetro',
      icon: Gauge,
      count: `${house.readings.length}`,
      ariaLabel: `${house.readings.length} ${
        house.readings.length === 1 ? 'leitura' : 'leituras'
      }`,
    },
    {
      id: 'conta',
      label: 'Conta',
      icon: ReceiptText,
      count: `${house.bills.length}`,
      ariaLabel: `${house.bills.length} ${house.bills.length === 1 ? 'conta' : 'contas'}`,
    },
  ]

  return (
    <div>
      <PageHeader
        icon={House}
        title="Minha casa"
        description="Ajuste o perfil, registre as leituras do hidrômetro e transforme o consumo em reais. Tudo continua salvo só neste navegador."
      />

      <div className="space-y-4">
        <MonthSummary
          profile={house.profile}
          readings={house.readings}
          bills={house.bills}
          activityDays={activityDays}
          month={month}
          months={months}
          onMonthChange={setMonth}
        />

        <div className="surface flex gap-1 p-1.5" role="tablist" aria-label="Seções de Minha casa">
          {tabs.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${item.id}`}
                aria-label={`${item.label}: ${item.ariaLabel}`}
                className={clsx(
                  'flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition sm:gap-2 sm:text-sm',
                  active
                    ? 'bg-navy text-agua-50 shadow-sm'
                    : 'text-navy/60 hover:bg-white/55 hover:text-navy',
                )}
                onClick={() => setTab(item.id)}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
                <span
                  className={clsx(
                    'rounded-full px-1.5 py-0.5 text-[0.62rem] tabular-nums',
                    active ? 'bg-white/15 text-agua-100' : 'bg-navy/6 text-navy/45',
                  )}
                >
                  {item.count}
                </span>
              </button>
            )
          })}
        </div>

        {tab === 'perfil' ? (
          <div id="panel-perfil" role="tabpanel" aria-labelledby="tab-perfil">
            <ProfileForm profile={house.profile} />
          </div>
        ) : null}

        {tab === 'hidrometro' ? (
          <div id="panel-hidrometro" role="tabpanel" aria-labelledby="tab-hidrometro">
            <MeterSection readings={house.readings} />
          </div>
        ) : null}

        {tab === 'conta' ? (
          <div id="panel-conta" role="tabpanel" aria-labelledby="tab-conta">
            <BillSection bills={house.bills} readings={house.readings} />
          </div>
        ) : null}

        <p className="px-1 text-center text-[0.7rem] leading-relaxed text-navy/45">
          O backup em <strong>Histórico</strong> agora inclui o perfil da casa, as
          leituras do hidrômetro e as contas de água.
        </p>
      </div>
    </div>
  )
}
