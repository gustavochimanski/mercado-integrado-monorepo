// src/lib/auth/middlewareAuth.ts
import { NextRequest } from "next/server";

export interface TokenValidationResult {
  isValid: boolean;
  timeUntilExpiry: number; // em segundos
  shouldShowReauth: boolean;
}

export function validateToken(request: NextRequest): TokenValidationResult {
  try {
    const token = request.cookies.get("access_token")?.value;
    
    if (!token) {
      return {
        isValid: false,
        timeUntilExpiry: 0,
        shouldShowReauth: false
      };
    }

    // Decodificar JWT para verificar expiração
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;

    // Token é válido se ainda não expirou
    const isValid = timeUntilExpiry > 0;
    
    // Deve mostrar reauth se restam entre 20 e 29 minutos (do início da sessão)
    // Se JWT expira em 89 min, então:
    // - 20 min de uso = 69 min restantes
    // - 29 min de uso = 60 min restantes
    const shouldShowReauth = timeUntilExpiry <= 4140 && timeUntilExpiry > 3600; // Entre 69 e 60 min restantes

    return {
      isValid,
      timeUntilExpiry,
      shouldShowReauth
    };
  } catch (error) {
    // Se houver erro ao decodificar, considerar inválido
    return {
      isValid: false,
      timeUntilExpiry: 0,
      shouldShowReauth: false
    };
  }
}

// Função de compatibilidade
export function isTokenValid(request: NextRequest): boolean {
  return validateToken(request).isValid;
}
