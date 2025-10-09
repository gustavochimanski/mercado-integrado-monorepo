import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="flex flex-col items-center gap-8 text-center max-w-2xl">

        {/* Título dramático */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black text-primary animate-pulse">
            404
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Página não encontrada!
          </h2>
        </div>

        {/* Badge de status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Sistema operando
          </span>
        </div>

        {/* Mensagem */}
        <div className="space-y-4 max-w-md">
          <p className="text-lg text-muted-foreground">
            A página que você está procurando não existe.
          </p>
          <p className="text-muted-foreground">
            Ela pode ter sido removida ou o link está incorreto.
          </p>
        </div>

        {/* Botão de ação */}
        <div className="w-full max-w-md mt-4">
          <Button
            asChild
            size="lg"
            className="w-full text-base font-semibold"
          >
            <Link href="/">
              <Home className="h-5 w-5" />
              Retornar à home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
