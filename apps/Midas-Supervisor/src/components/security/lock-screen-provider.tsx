'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useReauthContext } from '@/contexts/reauth-context'
import { useIdleTimer } from '@/hooks/use-idle-timer'
import { LockScreenModal } from './lock-screen-modal'

interface LockScreenProviderProps {
  children: ReactNode
  timeout?: number // em minutos
}

export function LockScreenProvider({
  children,
  timeout = 15, // 15 minutos por padrão
}: LockScreenProviderProps) {
  const { isReauthModalOpen, showReauthModal, resolveReauth } = useReauthContext()
  const hasShownModal = useRef(false)

  // Converter minutos para milissegundos
  const timeoutInMs = timeout * 60 * 1000

  // Detectar inatividade
  useIdleTimer({
    timeout: timeoutInMs,
    onIdle: () => {
      if (!hasShownModal.current) {
        hasShownModal.current = true
        showReauthModal()
      }
    },
  })

  const handleSuccess = () => {
    hasShownModal.current = false
    resolveReauth(true)
  }

  // Prevenir reload da página quando modal está aberto
  useEffect(() => {
    if (isReauthModalOpen) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
      }

      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [isReauthModalOpen])

  return (
    <>
      {children}
      <LockScreenModal
        isOpen={isReauthModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}
