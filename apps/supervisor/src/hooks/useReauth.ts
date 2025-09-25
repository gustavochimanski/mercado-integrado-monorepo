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
    const newAttempts = reauthState.attempts + 1
    
    if (newAttempts >= reauthState.maxAttempts) {
      // Máximo de tentativas atingido
      setReauthState(prev => ({
        ...prev,
        isOpen: false,
        attempts: 0,
        resolveReauth: null
      }))
      
      if (reauthState.resolveReauth) {
        reauthState.resolveReauth(false)
      }
      
      // Logout e redirecionar
      logoutService(true)
    } else {
      // Incrementar tentativas
      setReauthState(prev => ({
        ...prev,
        attempts: newAttempts
      }))
    }
  }, [reauthState.attempts, reauthState.maxAttempts, reauthState.resolveReauth])

  return {
    reauthState,
    showReauthModal,
    handleReauthSuccess,
    handleReauthCancel,
    handleReauthError
  }
}
