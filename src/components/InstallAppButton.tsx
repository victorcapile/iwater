import { useEffect, useState } from 'react'
import { Smartphone } from 'lucide-react'
import { toast } from 'sonner'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

export function InstallAppButton() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(() => isStandalone())

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault()
      setPromptEvent(event as BeforeInstallPromptEvent)
    }
    const handleInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const install = async () => {
    if (installed) {
      toast.info('O iWater já está instalado')
      return
    }
    if (!promptEvent) {
      toast.info('Instale pelo menu do navegador', {
        description:
          'No Chrome ou Safari, use “Adicionar à tela de início” ou “Instalar aplicativo”.',
      })
      return
    }

    await promptEvent.prompt()
    const choice = await promptEvent.userChoice
    if (choice.outcome === 'accepted') {
      toast.success('iWater instalado')
    }
    setPromptEvent(null)
  }

  return (
    <button type="button" className="btn-secondary" onClick={install}>
      <Smartphone className="h-4 w-4" aria-hidden="true" />
      {installed ? 'App instalado' : 'Instalar como app'}
    </button>
  )
}
