'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, User, KeyRound } from 'lucide-react'
import { useReauthLogin } from '@/hooks/use-reauth-login'
import { logoutAction } from '@/actions/auth/logout'
import { toast } from 'sonner'

interface LockScreenModalProps {
  isOpen: boolean
  onSuccess: () => void
  maxAttempts?: number
}

export function LockScreenModal({
  isOpen,
  onSuccess,
  maxAttempts = 3,
}: LockScreenModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const { form, onSubmit } = useReauthLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  // Reset form quando modal abre
  useEffect(() => {
    if (isOpen) {
      reset()
      setIsLoading(false)
      setAttempts(0)
    }
  }, [isOpen, reset])

  const handleFormSubmit = async (data: { username: string; password: string }) => {
    setIsLoading(true)

    try {
      await onSubmit(data)
      toast.success('Login realizado com sucesso!')
      onSuccess()
      setAttempts(0)
    } catch {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= maxAttempts) {
        // Máximo de tentativas atingido - deslogar
        toast.error('Número máximo de tentativas excedido. Você será deslogado.')
        setTimeout(async () => {
          await logoutAction()
        }, 2000)
      } else {
        toast.error('Usuário ou senha incorretos')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const remainingAttempts = maxAttempts - attempts

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
        blur={true}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-center">
            <Lock className="w-6 h-6 text-orange-500" />
            <span>Tela Bloqueada por Inatividade</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">
              Sua sessão foi bloqueada por inatividade. Faça login novamente para
              continuar.
            </p>
            {remainingAttempts > 0 && attempts > 0 && (
              <p className="text-xs text-orange-600 font-medium">
                Tentativas restantes: {remainingAttempts}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Usuário
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  placeholder="Digite seu usuário"
                  {...register('username')}
                  disabled={isLoading || attempts >= maxAttempts}
                  className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                  autoComplete="off"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  {...register('password')}
                  disabled={isLoading || attempts >= maxAttempts}
                  className="pl-10 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={attempts >= maxAttempts}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || attempts >= maxAttempts}
                className="w-full cursor-pointer"
              >
                {isLoading ? 'Entrando...' : 'Desbloquear'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
