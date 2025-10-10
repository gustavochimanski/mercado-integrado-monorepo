"use client"

import { useEffect, useRef, useCallback } from "react"
import { getCookie } from "cookies-next"
import { jwtDecode } from "jwt-decode"
import { useReauthContext } from "@supervisor/providers/ReauthProvider"

interface TokenPayload {
  exp: number
  [key: string]: any
}

export function useTokenExpiration() {
  const { showReauthModal } = useReauthContext()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isCheckingRef = useRef(false)

  const checkTokenExpiration = useCallback(async () => {
    // Evitar múltiplas verificações simultâneas
    if (isCheckingRef.current) {
      return
    }

    try {
      isCheckingRef.current = true
      const token = getCookie("access_token")

      if (!token || typeof token !== "string") {
        return
      }

      // Decodificar token JWT para pegar expiração
      const decoded = jwtDecode<TokenPayload>(token)
      const currentTime = Math.floor(Date.now() / 1000) // Unix timestamp
      const timeUntilExpiry = decoded.exp - currentTime

      // Se está entre 20 e 29 minutos de uso, mostrar reauth
      // Se JWT expira em 89 min, então:
      // - 20 min de uso = 69 min restantes
      // - 29 min de uso = 60 min restantes
      if (timeUntilExpiry <= 4140 && timeUntilExpiry > 3600) { // Entre 69 e 60 min restantes
        const result = await showReauthModal()
      }
    } catch (error) {
    } finally {
      isCheckingRef.current = false
    }
  }, [showReauthModal])

  useEffect(() => {
    // Verificar a cada 1 minuto
    intervalRef.current = setInterval(checkTokenExpiration, 60000)

    // Verificação inicial
    checkTokenExpiration()

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checkTokenExpiration])

  return { checkTokenExpiration }
}