import { Link } from 'react-router-dom'
import { Droplets } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'

export function NotFoundPage() {
  return (
    <div>
      <PageHeader
        icon={Droplets}
        title="Página não encontrada"
        description="O endereço que você tentou abrir não existe — ou evaporou."
      />
      <EmptyState
        icon={Droplets}
        title="Essa gota não existe"
        description="Volte para o início e escolha uma das seções do iWater."
        action={
          <Link to="/" className="btn-primary">
            Voltar para o início
          </Link>
        }
      />
    </div>
  )
}
