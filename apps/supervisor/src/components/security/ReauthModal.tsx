"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog"
import { Button } from "@supervisor/components/ui/button"
import { Input } from "@supervisor/components/ui/input"
import { Label } from "@supervisor/components/ui/label"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useReauthLoginForm } from "@supervisor/hooks/useReauthLogin"

interface ReauthModalProps {
  isOpen: boolean
  onSuccess: () => void
  onCancel: () => void
  onError: () => void
  attempts: number
  maxAttempts: number
}

export function ReauthModal({ isOpen, onSuccess, onCancel, onError, attempts, maxAttempts }: ReauthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { form, onSubmit } = useReauthLoginForm()

  const { register, handleSubmit, formState: { errors }, reset } = form

  // Reset form quando modal abre
  useEffect(() => {
    if (isOpen) {
      reset()
      setLoginError("")
      setIsLoading(false)
    }
  }, [isOpen, reset])

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true)
    setLoginError("")
    
    try {
      await onSubmit(data)
      onSuccess()
    } catch (error) {
      // Mostrar erro e incrementar tentativas
      setLoginError("Usuário ou senha incorretos")
      onError()
      // NÃO fechar o modal, apenas mostrar erro
    } finally {
      setIsLoading(false)
    }
  }

  const remainingAttempts = maxAttempts - attempts

  return (
    <Dialog open={isOpen} onOpenChange={() => {      
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            Sessão Expirada
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Sua sessão expirou. Por favor, faça login novamente para continuar.
            </p>
            {remainingAttempts > 0 && (
              <p className="text-xs text-orange-600">
                Tentativas restantes: {remainingAttempts}
              </p>
            )}
            {loginError && (
              <p className="text-xs text-red-600 mt-2">
                {loginError}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                placeholder="Digite seu usuário"
                {...register("username")}
                disabled={isLoading}
                className="mt-1"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  {...register("password")}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
