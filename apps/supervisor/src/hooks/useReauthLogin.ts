"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@supervisor/hooks/use-toast"
import { setCookie } from "cookies-next"
import apiMensura from "@supervisor/lib/api/apiMensura"

// Schema de validação para reautenticação
export const reauthLoginSchema = z.object({
  username: z.string().min(1, "Usuário obrigatório"),
  password: z.string().min(1, "Senha obrigatória"),
})

export type ReauthLoginFormValues = z.infer<typeof reauthLoginSchema>

export function useReauthLoginForm() {
  const { toast } = useToast()
  
  const form = useForm<ReauthLoginFormValues>({
    resolver: zodResolver(reauthLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: ReauthLoginFormValues) => {
    try {
      // Chamar diretamente a API usando axios (que lança erro para 401)
      const response = await apiMensura.post('/api/auth/token', {
        username: data.username,
        password: data.password
      })
      
      // Verificar se a resposta é válida
      if (!response.data || !response.data.access_token) {
        throw new Error("Resposta inválida da API")
      }
      
      // Atualizar o token no cookie
      setCookie("access_token", response.data.access_token, {
        path: "/",
        maxAge: 60 * 120, // 120 minutos
        sameSite: "lax",
        secure: false,
      })

      // Mostrar toast de sucesso
      toast({
        title: "Reautenticação realizada",
        description: "Sua sessão foi renovada com sucesso!",
      })
    } catch (error) {
      // Re-lançar o erro para que o modal possa capturar
      throw error
    }
  }

  return {
    form,
    onSubmit,
    isLoggingIn: false, // Sempre false para reautenticação
  }
}
