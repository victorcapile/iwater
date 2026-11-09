import { Link } from 'react-router-dom'
import {
  BookOpen,
  Factory,
  Globe2,
  House,
  Lightbulb,
  Shuffle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { curiosityCategories } from '../data/curiosities'

const icons: Record<string, LucideIcon> = {
  mundo: Globe2,
  domestico: House,
  industria: Factory,
  historia: BookOpen,
}

export function CuriositiesPage() {
  return (
    <div>
      <PageHeader
        icon={Lightbulb}
        title="Curiosidades"
        description="Fatos sobre a água no mundo, em casa, na indústria e na história. Escolha uma categoria ou deixe o iWater sortear."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {curiosityCategories.map((category) => {
          const Icon = icons[category.key] ?? Lightbulb
          return (
            <Link
              key={category.key}
              to={`/curiosidades/${category.key}`}
              className="tile group items-start justify-between text-left"
            >
              <Icon className="tile-icon" aria-hidden="true" />
              <span>
                <span className="block text-base font-semibold tracking-tight">
                  {category.label}
                </span>
                <span className="mt-1 block text-[0.7rem] leading-snug text-agua-100/75">
                  {category.description}
                </span>
              </span>
            </Link>
          )
        })}

        <Link
          to="/curiosidades/todas"
          className="tile tile-featured group col-span-2 flex-row items-center justify-center gap-4 text-left"
        >
          <Shuffle className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" strokeWidth={1.35} aria-hidden="true" />
          <span>
            <span className="block text-base font-semibold tracking-tight">
              Surpreenda-me
            </span>
            <span className="mt-0.5 block text-[0.7rem] text-agua-100/75">
              Uma curiosidade aleatória de qualquer categoria
            </span>
          </span>
        </Link>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-navy/50">
        Cada abertura de categoria sorteia uma curiosidade. Toque em “outra” para ver mais.
      </p>
    </div>
  )
}
