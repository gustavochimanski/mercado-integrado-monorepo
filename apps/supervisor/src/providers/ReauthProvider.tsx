"use client"

import { createContext, useContext, ReactNode } from "react"
import { useReauth } from "@supervisor/hooks/useReauth"
import { ReauthModal } from "@supervisor/components/security/ReauthModal"

interface ReauthContextType {
  showReauthModal: () => Promise<boolean>
}

const ReauthContext = createContext<ReauthContextType | undefined>(undefined)

export function useReauthContext() {
  const context = useContext(ReauthContext)
  if (!context) {
    throw new Error("useReauthContext must be used within ReauthProvider")
  }
  return context
}

interface ReauthProviderProps {
  children: ReactNode
}

export function ReauthProvider({ children }: ReauthProviderProps) {
  const {
    reauthState,
    showReauthModal,
    handleReauthSuccess,
    handleReauthCancel,
    handleReauthError
  } = useReauth()

  return (
    <ReauthContext.Provider value={{ showReauthModal }}>
      {children}
      <ReauthModal
        isOpen={reauthState.isOpen}
        onSuccess={handleReauthSuccess}
        onCancel={handleReauthCancel}
        onError={handleReauthError}
        attempts={reauthState.attempts}
        maxAttempts={reauthState.maxAttempts}
      />
    </ReauthContext.Provider>
  )
}
