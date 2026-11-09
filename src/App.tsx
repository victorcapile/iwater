import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from './components/AppShell'
import { AboutPage } from './pages/AboutPage'
import { CuriositiesPage } from './pages/CuriositiesPage'
import { CuriosityPage } from './pages/CuriosityPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { NewConsumptionPage } from './pages/NewConsumptionPage'
import { NotFoundPage } from './pages/NotFoundPage'

const ChartsPage = lazy(() =>
  import('./pages/ChartsPage').then((module) => ({ default: module.ChartsPage })),
)

function ChartsFallback() {
  return (
    <div className="surface p-8 text-center text-sm text-navy/55">
      Carregando gráficos…
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="novo-consumo" element={<NewConsumptionPage />} />
          <Route path="historico" element={<HistoryPage />} />
          <Route
            path="graficos"
            element={
              <Suspense fallback={<ChartsFallback />}>
                <ChartsPage />
              </Suspense>
            }
          />
          <Route path="curiosidades" element={<CuriositiesPage />} />
          <Route path="curiosidades/:categoria" element={<CuriosityPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        closeButton
        toastOptions={{
          style: {
            background: '#f5fbff',
            color: '#14364e',
            border: '1px solid rgba(20,54,78,0.14)',
            borderRadius: '16px',
          },
        }}
      />
    </HashRouter>
  )
}
