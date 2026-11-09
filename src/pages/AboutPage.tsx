import {
  Code2,
  Droplets,
  ExternalLink,
  Heart,
  HelpCircle,
  Leaf,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { InstallAppButton } from '../components/InstallAppButton'
import { PageHeader } from '../components/PageHeader'

const visualTeam = [
  'Igor Baptista',
  'Luiza Provenzano',
  'Pedro Borges',
  'Victor Capilé',
]

const researchTeam = [
  'Bruno Monteiro',
  'Evellyn Soares',
  'Felipe Lima',
  'Flávio Bordallo',
  'Gabriela Bach',
  'Giulia Dorazzo',
  'Igor Baptista',
  'Isabelle Curvello',
  'João Victor Lima',
  'Julia Reis',
  'Juliana Amaro',
  'Juliana Wolff',
  'Leonardo Castellar',
  'Letícia Jordão',
  'Letícia Reis',
  'Luciano Marques',
  'Luis Vitor Lisboa',
  'Luiza Provenzano',
  'Mariana Favre',
  'Max Peralta',
  'Nathalia Lemos',
  'Nathália Marzullo',
  'Patrick Mota',
  'Pedro Borges',
  'Pedro Menezes',
  'Rafael Britto',
  'Rafael Bonnas',
  'Raphael Malaquias',
  'Rayane Rosa',
  'Rebecca Addum',
  'Victor Capilé',
]

const technologies = [
  'React 19',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Recharts',
  'PWA',
]

export function AboutPage() {
  return (
    <div>
      <PageHeader
        icon={HelpCircle}
        title="Sobre"
        description="A história do iWater, as pessoas que fizeram parte dela e o que mudou nesta versão."
      />

      <div className="space-y-4">
        <section className="surface p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
              <Droplets className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Uma ideia de 2013</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                O <strong>iWater</strong> nasceu como uma iniciativa livre, gratuita e sem
                anúncios para ajudar as pessoas a enxergarem quanta água usam no dia a dia.
                O projeto foi apresentado na Comunicar 2013, da escola Garriga de Menezes.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-navy/65">
                Mais de uma década depois, a ideia continua boa — e agora ganhou uma
                interface nova, acessível e instalável, mantendo a identidade visual
                original: o azul, os blocos de ícones e o boneco que mergulha conforme o
                consumo aumenta.
              </p>
            </div>
          </div>
        </section>

        <section className="surface p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight">O que mudou nesta versão</h2>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-navy/65 sm:grid-cols-2">
                <li>Interface responsiva e acessível, com foco em leitura no celular.</li>
                <li>Cálculo e armazenamento 100% locais, sem enviar dados para servidores.</li>
                <li>Gráfico do boneco d'água preservado e evolução dos últimos 7 dias.</li>
                <li>Backup dos registros em JSON para exportar e importar.</li>
                <li>Cronômetro integrado para medir banhos, torneiras e descargas.</li>
                <li>Instalação como aplicativo (PWA) e uso offline.</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span key={technology} className="chip">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="surface p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
              <Smartphone className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Leve o iWater com você</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy/65">
                O app funciona offline depois da primeira visita. No celular, você pode
                adicioná-lo à tela de início e abrir como um aplicativo comum.
              </p>
              <div className="mt-4">
                <InstallAppButton />
              </div>
            </div>
          </div>
        </section>

        <section className="surface p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
              <Leaf className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Equipe original</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-navy/50 uppercase">
                    Coordenação e programação
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-navy/80">Victor Capilé</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-navy/50 uppercase">
                    Projeto visual
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/75">
                    {visualTeam.join(', ')}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xs font-semibold tracking-[0.14em] text-navy/50 uppercase">
                  Pesquisa e conteúdo
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy/70">
                  {researchTeam.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-agua-600/10 text-agua-800">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Apoie a ideia</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy/65">
                O iWater continua gratuito e sem anúncios. Se ele for útil para você,
                compartilhe com alguém e ajude mais gente a olhar para o próprio consumo.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  className="btn-secondary"
                  href="https://github.com/victorcapile/iwater"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  Ver no GitHub
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a
                  className="btn-ghost"
                  href="https://www.garriga.com.br"
                  target="_blank"
                  rel="noreferrer"
                >
                  Garriga de Menezes
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <p className="px-1 pb-1 text-center text-[0.7rem] leading-relaxed text-navy/45">
          Projeto original de 2013/2014. Esta versão mantém o conteúdo e a identidade
          visual do iWater, com uma base técnica atual.
        </p>
      </div>
    </div>
  )
}
