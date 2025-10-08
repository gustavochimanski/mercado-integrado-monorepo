'use server'

import { cache } from 'react'
import { cookies } from 'next/headers'
import type { UserResponse } from '@/api'

export const getCurrentUser = cache(async (): Promise<UserResponse | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
})
