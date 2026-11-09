import { Link, Outlet, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Logo } from './Logo'
import { ScrollToTop } from './ScrollToTop'

export function AppShell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const showQuickAdd = pathname !== '/novo-consumo'

  return (
    <div className="app-shell">
      <ScrollToTop />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-agua-50"
      >
        Pular para o conteúdo
      </a>

      <header className="app-container pt-6 sm:pt-8">
        <div className="flex items-center justify-between gap-4">
          {isHome ? (
            <h1 className="m-0">
              <Link
                to="/"
                aria-label="iWater — página inicial"
                className="rounded-lg transition-opacity hover:opacity-80"
              >
                <Logo />
              </Link>
            </h1>
          ) : (
            <Link
              to="/"
              aria-label="iWater — página inicial"
              className="rounded-lg transition-opacity hover:opacity-80"
            >
              <Logo compact />
            </Link>
          )}

          {showQuickAdd ? (
            <Link to="/novo-consumo" className="btn-primary px-4 sm:px-5">
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Registrar consumo</span>
              <span className="sm:hidden">Registrar</span>
            </Link>
          ) : null}
        </div>
      </header>

      <main id="conteudo" className="app-container flex-1 pt-7 pb-14 sm:pt-10">
        <div key={pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>

      <footer className="app-container pb-8">
        <div className="divider mb-5" />
        <div className="flex flex-col gap-3 text-xs text-navy/55 sm:flex-row sm:items-center sm:justify-between">
          <p>iWater · uma ideia de 2013, repensada para hoje.</p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Links do rodapé">
            <Link className="transition hover:text-navy" to="/sobre">
              Sobre
            </Link>
            <Link className="transition hover:text-navy" to="/historico">
              Histórico
            </Link>
            <a
              className="transition hover:text-navy"
              href="https://github.com/victorcapile/iwater"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
