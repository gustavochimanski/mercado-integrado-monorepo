"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { logoutService } from "@supervisor/services/Auth/authenticate"

interface ReauthState {
  isOpen: boolean
  attempts: number
  maxAttempts: number
  resolveReauth: ((success: boolean) => void) | null
}

export function useReauth() {
  const [reauthState, setReauthState] = useState<ReauthState>({
    isOpen: false,
    attempts: 0,
    maxAttempts: 3,
    resolveReauth: null
  })

  const router = useRouter()

  const showReauthModal = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      setReauthState(prev => ({
        ...prev,
        isOpen: true,
        attempts: 0, // RESETAR tentativas quando modal abre
        resolveReauth: resolve
      }))
    })
  }, [])

  const handleReauthSuccess = useCallback(() => {
    setReauthState(prev => ({
      ...prev,
      isOpen: false,
      attempts: 0,
      resolveReauth: null
    }))
    
    if (reauthState.resolveReauth) {
      reauthState.resolveReauth(true)
    }
  }, [reauthState.resolveReauth])

  const handleReauthCancel = useCallback(() => {
    setReauthState(prev => ({
      ...prev,
      isOpen: false,
      attempts: 0,
      resolveReauth: null
    }))
    
    if (reauthState.resolveReauth) {
      reauthState.resolveReauth(false)
    }
  }, [reauthState.resolveReauth])

  const handleReauthError = useCallback(() => {
    setReauthState(prev => {
      const newAttempts = prev.attempts + 1
      
      if (newAttempts >= prev.maxAttempts) {
        // Máximo de tentativas atingido
        if (prev.resolveReauth) {
          prev.resolveReauth(false)
        }
        
        // Logout e redirecionar
        logoutService(true)
        
        return {
          ...prev,
          isOpen: false,
          attempts: 0,
          resolveReauth: null
        }
      } else {
        // Incrementar tentativas mas MANTER modal aberto
        return {
          ...prev,
          attempts: newAttempts,
          // isOpen permanece true
        }
      }
    })
  }, [])

  return {
    reauthState,
    showReauthModal,
    handleReauthSuccess,
    handleReauthCancel,
    handleReauthError
  }
}
