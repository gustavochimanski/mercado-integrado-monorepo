"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error('Erro capturado:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="flex flex-col items-center gap-8 text-center max-w-2xl">

        {/* Título dramático */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black text-primary animate-pulse">
            Ops!
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Usuário, temos um problema!
          </h2>
        </div>

        {/* Badge de status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Sistema respondendo
          </span>
        </div>

        {/* Mensagem */}
        <div className="space-y-4 max-w-md">
          <p className="text-lg text-muted-foreground">
            Tivemos um erro no servidor interno.
          </p>
          <p className="text-muted-foreground">
            Estamos trabalhando para corrigir isso!
          </p>

          {/* Detalhes em dev */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground font-medium">
                Detalhes técnicos (apenas em desenvolvimento)
              </summary>
              <pre className="mt-3 rounded-lg bg-muted/50 border border-border p-4 text-xs overflow-auto max-h-40 font-mono">
                {error.message}
              </pre>
            </details>
          )}
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
