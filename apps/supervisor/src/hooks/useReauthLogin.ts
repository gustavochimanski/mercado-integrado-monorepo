"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginService } from "@supervisor/services/Auth/authenticate"
import { useToast } from "@supervisor/hooks/use-toast"

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
    // Chamar diretamente o loginService sem redirecionamento
    await loginService(data.username, data.password)
    
    // Mostrar toast de sucesso
    toast({
      title: "Reautenticação realizada",
      description: "Sua sessão foi renovada com sucesso!",
    })
  }

  return {
    form,
    onSubmit,
    isLoggingIn: false, // Sempre false para reautenticação
  }
}
