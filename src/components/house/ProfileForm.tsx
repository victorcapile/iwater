import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { House, Save, Trees, Users, Waves } from 'lucide-react'
import { toast } from 'sonner'
import { saveProfile, type HouseProfile } from '../../lib/house'
import { getHouseAlert, getHouseGoal, getHouseMax } from '../../lib/houseMath'
import { formatInteger } from '../../lib/format'

interface ProfileFormProps {
  profile: HouseProfile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [form, setForm] = useState(profile)

  useEffect(() => {
    setForm(profile)
  }, [profile])

  const goal = getHouseGoal(form)
  const alert = getHouseAlert(form)
  const max = getHouseMax(form)

  const update = <K extends keyof HouseProfile>(key: K, value: HouseProfile[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const saved = saveProfile(form)
    setForm(saved)
    toast.success('Perfil da casa atualizado', {
      description: `Meta de ${formatInteger(getHouseGoal(saved))} L por dia para ${saved.residents} ${
        saved.residents === 1 ? 'morador' : 'moradores'
      }.`,
    })
  }

  return (
    <form className="surface-strong p-5 sm:p-6" onSubmit={handleSubmit}>
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
          <House className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Perfil da casa</h2>
          <p className="mt-1 text-xs leading-relaxed text-navy/55">
            A meta do iWater é calculada por pessoa. Ajuste abaixo para a sua casa.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="moradores" className="field-label">
            <Users className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
            Moradores
          </label>
          <input
            id="moradores"
            type="number"
            min={1}
            max={50}
            step={1}
            className="input-base"
            value={form.residents}
            onChange={(event) => update('residents', Number(event.target.value))}
          />
        </div>

        <div>
          <label htmlFor="meta-pessoa" className="field-label">
            Meta por pessoa (L/dia)
          </label>
          <input
            id="meta-pessoa"
            type="number"
            min={20}
            max={1000}
            step={10}
            className="input-base"
            value={form.goalPerPerson}
            onChange={(event) => update('goalPerPerson', Number(event.target.value))}
          />
          <p className="field-hint">A ONU recomenda cerca de 120 litros por pessoa/dia.</p>
        </div>

        <div>
          <label htmlFor="tipo-moradia" className="field-label">
            Tipo de moradia
          </label>
          <select
            id="tipo-moradia"
            className="select-base"
            value={form.housingType}
            onChange={(event) =>
              update('housingType', event.target.value === 'apartamento' ? 'apartamento' : 'casa')
            }
          >
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
          </select>
        </div>

        <fieldset className="rounded-2xl border border-navy/10 bg-white/35 p-3">
          <legend className="px-1 text-xs font-semibold tracking-[0.12em] text-navy/55 uppercase">
            Contexto da casa
          </legend>
          <div className="mt-1 flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-navy/75">
              <input
                type="checkbox"
                className="h-4 w-4 accent-agua-600"
                checked={form.hasGarden}
                onChange={(event) => update('hasGarden', event.target.checked)}
              />
              <Trees className="h-4 w-4 text-agua-800" aria-hidden="true" />
              Jardim
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-navy/75">
              <input
                type="checkbox"
                className="h-4 w-4 accent-agua-600"
                checked={form.hasPool}
                onChange={(event) => update('hasPool', event.target.checked)}
              />
              <Waves className="h-4 w-4 text-agua-800" aria-hidden="true" />
              Piscina
            </label>
          </div>
        </fieldset>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <div className="stat-card">
          <p className="stat-label">Meta da casa</p>
          <p className="stat-value">
            {formatInteger(goal)} <span className="text-sm font-normal text-navy/45">L/dia</span>
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Alerta</p>
          <p className="stat-value">
            {formatInteger(alert)} <span className="text-sm font-normal text-navy/45">L/dia</span>
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Teto do gráfico</p>
          <p className="stat-value">
            {formatInteger(max)} <span className="text-sm font-normal text-navy/45">L/dia</span>
          </p>
        </div>
      </div>

      <p className="field-hint">
        Jardim e piscina ficam como contexto da casa. O consumo desses usos aparece no
        total medido pelo hidrômetro.
      </p>

      <button type="submit" className="btn-primary mt-5">
        <Save className="h-4 w-4" aria-hidden="true" />
        Salvar perfil
      </button>
    </form>
  )
}
