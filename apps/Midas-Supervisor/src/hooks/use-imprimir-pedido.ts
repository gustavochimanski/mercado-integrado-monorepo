'use client'

import { useState } from 'react'
import { buscarDadosImpressao } from '@/actions/impressao/buscar-dados-impressao'
import type { PedidoImpressao } from '@/types/impressao'

interface UseImprimirPedidoReturn {
  imprimirCupom: (pedidoId: number) => Promise<void>
  dadosImpressao: PedidoImpressao | null
  isLoading: boolean
  error: string | null
}

/**
 * Hook para gerenciar impressão de cupom do pedido
 *
 * Fluxo:
 * 1. Busca dados formatados do pedido
 * 2. Abre janela de impressão
 * 3. Marca pedido como impresso
 */
export function useImprimirPedido(): UseImprimirPedidoReturn {
  const [dadosImpressao, setDadosImpressao] = useState<PedidoImpressao | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const imprimirCupom = async (pedidoId: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Buscar dados do pedido formatados para impressão
      const resultado = await buscarDadosImpressao(pedidoId)

      if (!resultado.success || !resultado.data) {
        const errorMsg = resultado.error || 'Erro ao buscar dados do pedido'
        setError(errorMsg)
        console.error('Erro ao buscar dados:', errorMsg)
        return
      }

      setDadosImpressao(resultado.data)

      // 2. Aguardar um frame para o estado atualizar
      await new Promise(resolve => setTimeout(resolve, 200))

      // 3. Abrir janela de impressão
      if (typeof window !== 'undefined') {
        window.print()
      }

      // Nota: Não marcamos como impresso automaticamente pois não há como
      // detectar se o usuário realmente imprimiu ou cancelou a janela

    } catch (err) {
      console.error('Erro ao imprimir cupom:', err)
      setError('Erro ao imprimir cupom')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    imprimirCupom,
    dadosImpressao,
    isLoading,
    error
  }
}
