'use server'

import { cookies } from 'next/headers'
import type { LoginRequest, TokenResponse } from '@/api'

export async function loginAction(credentials: LoginRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Credenciais inválidas'
      }
    }

    const data: TokenResponse = await response.json()

    // Armazenar token em cookie httpOnly (mais seguro)
    const cookieStore = await cookies()
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 120, // 2 horas
      path: '/',
    })

    return { success: true, data }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Erro ao fazer login' }
  }
}
