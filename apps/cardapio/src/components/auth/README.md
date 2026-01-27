# Sistema de Verificação de Link Inválido

Este sistema verifica se há configuração válida da API (tenant na URL, cookies, etc.) e exibe uma tela de erro quando não há configuração.

## 📁 Arquivos Criados

- `src/actions/auth/check-api-config.ts` - Server Action para verificar configuração
- `src/components/auth/invalid-link-error.tsx` - Componente de erro visual
- `src/components/auth/api-config-checker.tsx` - Wrapper para verificação automática
- `src/components/Shared/ui/spinner.tsx` - Componente de loading

## 🚀 Como Usar

### Opção 1: Usar o Wrapper Automático (Recomendado)

Envolva seu conteúdo com o `ApiConfigChecker`:

```tsx
import { ApiConfigChecker } from '@cardapio/components/auth/api-config-checker'

export default function MinhaPagina() {
  return (
    <ApiConfigChecker>
      {/* Seu conteúdo aqui */}
      <div>Conteúdo da página</div>
    </ApiConfigChecker>
  )
}
```

### Opção 2: Uso Manual em Componente

```tsx
'use client'

import { useEffect, useState } from 'react'
import { checkApiConfig } from '@cardapio/actions/auth/check-api-config'
import { InvalidLinkError } from '@cardapio/components/auth/invalid-link-error'
import { Spinner } from '@cardapio/components/Shared/ui/spinner'

export function MeuComponente() {
  const [isCheckingConfig, setIsCheckingConfig] = useState(true)
  const [isInvalidLink, setIsInvalidLink] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkConfig = async () => {
      try {
        const result = await checkApiConfig()
        if (isMounted) {
          setIsCheckingConfig(false)
          if (!result.configured) {
            setIsInvalidLink(true)
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsCheckingConfig(false)
          setIsInvalidLink(true)
        }
      }
    }

    void checkConfig()

    return () => {
      isMounted = false
    }
  }, [])

  if (isCheckingConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner className="mb-4" size="lg" />
        <p className="text-sm text-slate-600">Verificando configuração...</p>
      </div>
    )
  }

  if (isInvalidLink) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <InvalidLinkError />
      </div>
    )
  }

  return <div>Seu conteúdo</div>
}
```

## 🔧 Customização

### Alterar número de suporte

Edite `src/components/auth/invalid-link-error.tsx`:

```tsx
const SUPPORT_PHONE = 'SEU_NUMERO_AQUI'
```

### Alterar mensagens

Modifique os textos dentro do componente `InvalidLinkError`.

### Alterar logo

O componente usa `/logo.png` por padrão. Ajuste o caminho se necessário.

## 📋 Lógica de Verificação

A função `checkApiConfig` verifica nesta ordem:

1. **Se está logado** (`access_token` cookie) → sempre válido
2. **Cookie `api_base_url`** → válido se existir
3. **Cookie `tenant_slug`** → válido se existir e for válido
4. **Caso contrário** → inválido

## ✅ Vantagens

- ✅ **Server-side**: Verificação acontece no servidor
- ✅ **Reutilizável**: Pode ser usado em qualquer componente
- ✅ **Bonito**: Design moderno e responsivo
- ✅ **Interativo**: Botões funcionais para ligar e WhatsApp
