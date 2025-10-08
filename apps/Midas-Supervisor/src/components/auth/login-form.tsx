'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { loginAction } from '@/actions/auth/login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const result = await loginAction(data)

      if (result.success) {
        toast.success('Login realizado com sucesso!')
        router.push('/')
        router.refresh()
      } else {
        const errorMessage = result.error || 'Erro ao fazer login'
        toast.error(errorMessage)
      }
    })
  }

  return (
    <div className="relative w-full max-w-md px-10 py-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/50">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/images/logo.png"
          alt="Logo UNITEC"
          width={100}
          height={100}
          className="object-contain"
          draggable={false}
          priority
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      <div className="text-center mb-8">       
        <p className="text-xs text-slate-500 font-medium tracking-widest mb-4">
          GESTÃO E TECNOLOGIA
        </p>
        <p className="text-sm text-slate-600">
          Faça login para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo Usuário */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-700 font-medium">Usuário</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              id="username"
              type="text"
              autoFocus
              autoComplete="off"
              placeholder="Digite seu usuário"
              disabled={isPending}
              className="pl-10 bg-white border-slate-300 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:outline-none"
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Campo Senha */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 font-medium">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Digite sua senha"
              disabled={isPending}
              className="pl-10 pr-10 bg-white border-slate-300 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:outline-none"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Botão Submit */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
