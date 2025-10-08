'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'

interface ReauthContextType {
  isReauthModalOpen: boolean
  showReauthModal: () => Promise<boolean>
  hideReauthModal: () => void
  resolveReauth: (success: boolean) => void
}

const ReauthContext = createContext<ReauthContextType | undefined>(undefined)

const LOCK_STORAGE_KEY = 'screen_locked'

export function ReauthProvider({ children }: { children: ReactNode }) {
  const [isReauthModalOpen, setIsReauthModalOpen] = useState(false)
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null)

  // Verificar se estava bloqueado ao carregar
  useEffect(() => {
    const wasLocked = localStorage.getItem(LOCK_STORAGE_KEY) === 'true'
    if (wasLocked) {
      setIsReauthModalOpen(true)
    }
  }, [])

  const showReauthModal = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      localStorage.setItem(LOCK_STORAGE_KEY, 'true')
      setIsReauthModalOpen(true)
      setResolveCallback(() => resolve)
    })
  }, [])

  const hideReauthModal = useCallback(() => {
    localStorage.removeItem(LOCK_STORAGE_KEY)
    setIsReauthModalOpen(false)
  }, [])

  const resolveReauth = useCallback((success: boolean) => {
    if (resolveCallback) {
      resolveCallback(success)
      setResolveCallback(null)
    }
    hideReauthModal()
  }, [resolveCallback, hideReauthModal])

  return (
    <ReauthContext.Provider
      value={{
        isReauthModalOpen,
        showReauthModal,
        hideReauthModal,
        resolveReauth,
      }}
    >
      {children}
    </ReauthContext.Provider>
  )
}

export function useReauthContext() {
  const context = useContext(ReauthContext)
  if (context === undefined) {
    throw new Error('useReauthContext must be used within a ReauthProvider')
  }
  return context
}
