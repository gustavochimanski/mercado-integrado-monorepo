'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseIdleTimerOptions {
  timeout: number // em milissegundos
  onIdle: () => void
  events?: string[]
}

export function useIdleTimer({ timeout, onIdle, events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'] }: UseIdleTimerOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onIdleRef = useRef(onIdle)

  // Atualizar ref quando onIdle mudar
  useEffect(() => {
    onIdleRef.current = onIdle
  }, [onIdle])

  const resetTimer = useCallback(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Criar novo timeout
    timeoutRef.current = setTimeout(() => {
      onIdleRef.current()
    }, timeout)
  }, [timeout])

  useEffect(() => {
    // Iniciar timer
    resetTimer()

    // Adicionar event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [resetTimer, events])

  return { resetTimer }
}
