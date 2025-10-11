'use client'

import { useEffect, useRef } from 'react'

interface UsePollingOptions {
  /**
   * Intervalo em milissegundos entre cada polling
   * @default 10000 (10 segundos)
   */
  interval?: number
  /**
   * Se o polling está ativo
   * @default true
   */
  enabled?: boolean
  /**
   * Se deve pausar polling quando a aba não está visível
   * @default true
   */
  pauseOnInactive?: boolean
}

/**
 * Hook para polling inteligente
 *
 * @param callback - Função a ser executada em cada intervalo
 * @param options - Opções de configuração
 *
 * @example
 * ```tsx
 * usePolling(async () => {
 *   await fetchNovoPedidos()
 * }, { interval: 10000, enabled: true })
 * ```
 */
export function usePolling(
  callback: () => void | Promise<void>,
  options: UsePollingOptions = {}
) {
  const {
    interval = 10000, // 10 segundos por padrão
    enabled = true,
    pauseOnInactive = true,
  } = options

  const savedCallback = useRef(callback)
  const isPollingRef = useRef(false)

  // Sempre mantém a referência atualizada do callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    // Não inicia polling se não estiver habilitado
    if (!enabled) return

    const executePolling = async () => {
      // Evita execuções simultâneas
      if (isPollingRef.current) return

      // Se deve pausar quando inativo e a aba não está visível, pula
      if (pauseOnInactive && document.visibilityState !== 'visible') return

      try {
        isPollingRef.current = true
        await savedCallback.current()
      } catch (error) {
        console.error('Erro no polling:', error)
      } finally {
        isPollingRef.current = false
      }
    }

    // Executa imediatamente na primeira vez (opcional)
    // executePolling()

    // Configura intervalo
    const intervalId = setInterval(executePolling, interval)

    // Listener para pausar/retomar quando muda visibilidade da aba
    const handleVisibilityChange = () => {
      if (pauseOnInactive && document.visibilityState === 'visible') {
        // Quando a aba volta a ficar visível, executa imediatamente
        executePolling()
      }
    }

    if (pauseOnInactive) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    // Cleanup
    return () => {
      clearInterval(intervalId)
      if (pauseOnInactive) {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [interval, enabled, pauseOnInactive])
}
