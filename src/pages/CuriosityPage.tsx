import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  BookOpen,
  Droplet,
  Factory,
  Globe2,
  House,
  Lightbulb,
  Shuffle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import {
  curiosityCategories,
  curiosities,
  allCuriosities,
} from '../data/curiosities'

const icons: Record<string, LucideIcon> = {
  mundo: Globe2,
  domestico: House,
  industria: Factory,
  historia: BookOpen,
  todas: Shuffle,
}

function randomIndex(length: number): number {
  if (length <= 0) return 0
  if (length === 1) return 0
  return Math.floor(Math.random() * length)
}

export function CuriosityPage() {
  const { categoria } = useParams()
  const categoryKey = categoria && categoria in curiosities ? categoria : 'todas'
  const category = curiosityCategories.find((item) => item.key === categoryKey)

  const pool = useMemo(
    () => (categoryKey === 'todas' ? allCuriosities : curiosities[categoryKey]),
    [categoryKey],
  )

  const [index, setIndex] = useState(() => randomIndex(pool.length))

  useEffect(() => {
    setIndex(randomIndex(pool.length))
  }, [pool])

  const text = pool[index] ?? pool[0] ?? ''

  const next = () => {
    if (pool.length <= 1) return
    setIndex(
      (current) =>
        (current + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length,
    )
  }

  const Icon = icons[categoryKey] ?? Lightbulb
  const label = category?.label ?? 'Todas as categorias'

  return (
    <div>
      <PageHeader
        icon={Lightbulb}
        title="Curiosidades"
        description="Uma pausa para pensar na água — e em tudo o que ela torna possível."
        backTo="/curiosidades"
        backLabel="Categorias"
      />

      <div className="mx-auto max-w-3xl">
      <section className="quote-card flex min-h-[24rem] flex-col justify-between p-7 sm:min-h-[27rem] sm:p-10">
        <div className="relative z-10 flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.18em] text-agua-100/85 uppercase">
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </div>

        <p key={index} className="quote-text my-8 animate-fade-up sm:my-10">
          {text}
        </p>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/curiosidades"
            className="text-xs font-semibold text-agua-100/75 transition hover:text-white"
          >
            Ver todas as categorias
          </Link>
          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/22"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Outra curiosidade
          </button>
        </div>

        <Droplet
          className="droplet-watermark"
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
        />
      </section>

      <nav className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Categorias de curiosidades">
        {curiosityCategories.map((item) => {
          const CategoryIcon = icons[item.key] ?? Lightbulb
          return (
            <Link
              key={item.key}
              to={`/curiosidades/${item.key}`}
              className="chip"
              aria-current={item.key === categoryKey ? 'page' : undefined}
            >
              <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
        <Link
          to="/curiosidades/todas"
          className="chip"
          aria-current={categoryKey === 'todas' ? 'page' : undefined}
        >
          <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          Aleatória
        </Link>
      </nav>
      </div>
    </div>
  )
}
