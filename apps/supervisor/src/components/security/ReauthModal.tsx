"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog"
import { Button } from "@supervisor/components/ui/button"
import { Input } from "@supervisor/components/ui/input"
import { Label } from "@supervisor/components/ui/label"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useLoginForm } from "@supervisor/hooks/use-login"

interface ReauthModalProps {
  isOpen: boolean
  onSuccess: () => void
  onCancel: () => void
  attempts: number
  maxAttempts: number
}

export function ReauthModal({ isOpen, onSuccess, onCancel, attempts, maxAttempts }: ReauthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { form, onSubmit, isLoggingIn } = useLoginForm()

  const { register, handleSubmit, formState: { errors }, reset } = form

  // Reset form quando modal abre
  useEffect(() => {
    if (isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      onSuccess()
    } catch (error) {
      // Erro já é tratado pelo hook
    }
  }

  const remainingAttempts = maxAttempts - attempts

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
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
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                placeholder="Digite seu usuário"
                {...register("username")}
                disabled={isLoggingIn}
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
                  disabled={isLoggingIn}
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
                disabled={isLoggingIn}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="flex-1"
              >
                {isLoggingIn ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
