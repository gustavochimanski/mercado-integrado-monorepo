'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginAction } from '@/actions/auth/login'

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function useReauthLogin() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginAction({
      username: data.username,
      password: data.password,
    })

    if (!result.success) {
      throw new Error(result.error || 'Credenciais inválidas')
    }

    return result
  }

  return {
    form,
    onSubmit,
  }
}
