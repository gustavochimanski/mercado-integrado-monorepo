'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useReauthContext } from '@/contexts/reauth-context'
import { LockScreenModal } from './lock-screen-modal'
import { logoutAction } from '@/actions/auth/logout'
import { toast } from 'sonner'

interface LockScreenProviderProps {
  children: ReactNode
  timeout?: number 
  modalTimeout?: number 
}

export function LockScreenProvider({
  children,
  timeout = 20, 
  modalTimeout = 10, 
}: LockScreenProviderProps) {
  const { isReauthModalOpen, showReauthModal, resolveReauth } = useReauthContext()
  const reauthTimerRef = useRef<NodeJS.Timeout | null>(null)
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Converter minutos para milissegundos
  const reauthTimeoutInMs = timeout * 60 * 1000
  const logoutTimeoutInMs = modalTimeout * 60 * 1000

  // Timer periódico de reautenticação (a cada X minutos de uso)
  useEffect(() => {
    const startReauthTimer = () => {
      // Limpar timer anterior se existir
      if (reauthTimerRef.current) {
        clearTimeout(reauthTimerRef.current)
      }

      // Criar novo timer - após X minutos, mostrar modal
      reauthTimerRef.current = setTimeout(() => {
        showReauthModal()
      }, reauthTimeoutInMs)
    }

    // Iniciar timer ao montar
    startReauthTimer()

    // Cleanup
    return () => {
      if (reauthTimerRef.current) {
        clearTimeout(reauthTimerRef.current)
      }
    }
  }, [reauthTimeoutInMs, showReauthModal])

  // Timer de logout automático quando modal está aberto
  useEffect(() => {
    if (isReauthModalOpen) {
      // Quando modal abre, iniciar timer de logout (10 minutos)
      logoutTimerRef.current = setTimeout(async () => {
        // Fazer logout automático após timeout
        toast.error('Tempo esgotado! Você será desconectado.')

        // Limpar localStorage antes de fazer logout
        localStorage.removeItem('screen_locked')

        // Aguardar um pouco para o toast aparecer
        await new Promise(resolve => setTimeout(resolve, 1500))

        await logoutAction()
      }, logoutTimeoutInMs)
    } else {
      // Quando modal fecha, limpar timer de logout
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current)
        logoutTimerRef.current = null
      }
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current)
      }
    }
  }, [isReauthModalOpen, logoutTimeoutInMs])

  const handleSuccess = () => {
    // Fechar modal
    resolveReauth(true)

    // Reiniciar timer de reauth para mais 20 minutos
    if (reauthTimerRef.current) {
      clearTimeout(reauthTimerRef.current)
    }
    reauthTimerRef.current = setTimeout(() => {
      showReauthModal()
    }, reauthTimeoutInMs)
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
