"use client"

import { useEffect } from "react"
import { useReauthContext } from "@supervisor/providers/ReauthProvider"

// Hook para expor a função globalmente
export function useGlobalReauth() {
  const { showReauthModal } = useReauthContext()

  useEffect(() => {
    // Expor a função globalmente para o interceptor
    if (typeof window !== "undefined") {
      (window as any).showReauthModal = showReauthModal
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).showReauthModal
      }
    }
  }, [showReauthModal])
}
