"use client"

import { useEffect, useRef } from "react"
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

  const checkTokenExpiration = async () => {
    // Evitar múltiplas verificações simultâneas
    if (isCheckingRef.current) {
      console.log("🔄 Verificação já em andamento, pulando...")
      return
    }

    try {
      isCheckingRef.current = true
      const token = getCookie("access_token")

      if (!token || typeof token !== "string") {
        console.warn("🔒 Token não encontrado")
        return
      }

      // Decodificar token JWT para pegar expiração
      const decoded = jwtDecode<TokenPayload>(token)
      const currentTime = Math.floor(Date.now() / 1000) // Unix timestamp
      const timeUntilExpiry = decoded.exp - currentTime

      console.log(`⏰ Token expira em ${Math.floor(timeUntilExpiry / 60)} minutos`)

      // Se está entre 20 e 29 minutos de uso, mostrar reauth
      // Se JWT expira em 89 min, então:
      // - 20 min de uso = 69 min restantes
      // - 29 min de uso = 60 min restantes
      if (timeUntilExpiry <= 4140 && timeUntilExpiry > 3600) { // Entre 69 e 60 min restantes
        console.warn("⚠️ Token está expirando, mostrando modal de reauth")
        console.log("🔄 Chamando showReauthModal...")
        const result = await showReauthModal()
        console.log("✅ showReauthModal retornou:", result)
      }

    } catch (error) {
      console.error("❌ Erro ao verificar expiração do token:", error)
    } finally {
      isCheckingRef.current = false
    }
  }

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
  }, [showReauthModal])

  return { checkTokenExpiration }
}