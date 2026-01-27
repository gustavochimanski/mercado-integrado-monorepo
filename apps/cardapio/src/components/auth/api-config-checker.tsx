'use client'

import { useEffect, useState } from 'react'
import { checkApiConfig } from '@cardapio/actions/auth/check-api-config'
import { InvalidLinkError } from './invalid-link-error'
import { Spinner } from '@cardapio/components/Shared/ui/spinner'

interface ApiConfigCheckerProps {
  children: React.ReactNode
}

/**
 * Componente wrapper que verifica a configuração da API
 * e exibe erro se o link estiver inválido
 */
export function ApiConfigChecker({ children }: ApiConfigCheckerProps) {
  const [isCheckingConfig, setIsCheckingConfig] = useState(true)
  const [isInvalidLink, setIsInvalidLink] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkConfig = async () => {
      try {
        const result = await checkApiConfig()
        if (isMounted) {
          setIsCheckingConfig(false)
          if (!result.configured) {
            setIsInvalidLink(true)
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsCheckingConfig(false)
          setIsInvalidLink(true)
        }
      }
    }

    void checkConfig()

    return () => {
      isMounted = false
    }
  }, [])

  // Mostra loading enquanto verifica configuração
  if (isCheckingConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner className="mb-4" size="lg" />
        <p className="text-sm text-slate-600">Verificando configuração...</p>
      </div>
    )
  }

  // Mostra erro de link inválido
  if (isInvalidLink) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <InvalidLinkError />
      </div>
    )
  }

  // Se tudo estiver ok, renderiza o conteúdo
  return <>{children}</>
}
