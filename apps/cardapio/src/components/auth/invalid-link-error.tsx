'use client'

import Image from 'next/image'
import { AlertCircle, Phone, ArrowLeft } from 'lucide-react'
import { Button } from '@cardapio/components/Shared/ui/button'
import { useRouter } from 'next/navigation'

const SUPPORT_PHONE = '11933787147' // Ajuste para o número do seu projeto

export function InvalidLinkError() {
  const router = useRouter()

  const handleCallSupport = () => {
    window.location.href = `tel:${SUPPORT_PHONE}`
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá, preciso de ajuda com acesso ao sistema.')
    window.open(`https://wa.me/55${SUPPORT_PHONE.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  return (
    <div className="relative w-full max-w-md px-10 py-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="object-contain"
          draggable={false}
          priority
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      {/* Ícone de erro */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse opacity-50" />
          <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-full p-4 border-4 border-red-100 shadow-lg">
            <AlertCircle className="h-12 w-12 text-red-500" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Mensagem principal */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Link Inválido
        </h1>
        <p className="text-slate-600 leading-relaxed">
          O link de acesso que você está utilizando não está configurado corretamente.
          <br />
          <span className="font-medium text-slate-700 mt-2 block">
            Entre em contato com o suporte para obter o link correto.
          </span>
        </p>
      </div>

      {/* Card de contato */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3 shadow-md">
            <Phone className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
              Suporte Técnico
            </p>
            <a 
              href={`tel:${SUPPORT_PHONE}`}
              className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {SUPPORT_PHONE.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
            </a>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          <Button
            onClick={handleCallSupport}
            className="w-full font-semibold h-12 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Phone className="mr-2 h-5 w-5" strokeWidth={2.5} />
            Ligar Agora
          </Button>
          
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="w-full font-semibold h-12 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border-2 border-green-500 text-green-700 hover:bg-green-50 hover:border-green-600 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg 
              className="mr-2 h-5 w-5" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              aria-label="WhatsApp"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Abrir WhatsApp
          </Button>
        </div>
      </div>

      {/* Botão voltar */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
    </div>
  )
}
