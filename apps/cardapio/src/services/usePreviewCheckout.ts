import { useQuery } from "@tanstack/react-query";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import {
  getTokenCliente,
} from "@cardapio/stores/client/ClientStore";
import { previewCheckoutGateway } from "@cardapio/services/useGatewayCheckout";
import type { CheckoutGatewayRequest } from "@cardapio/types/pedido";

export interface PreviewCheckoutResult {
  subtotal: number;
  taxa_entrega: number;
  taxa_servico: number;
  valor_total: number;
  desconto: number;
}

/**
 * Hook para calcular preview do checkout (taxa de entrega, subtotal, etc.)
 * 
 * Usa o Gateway Orquestrador: POST /api/gateway/pedidos/checkout/preview
 * 
 * Calcula valores do pedido sem criar o pedido no banco de dados.
 * Retorna subtotal, taxas, desconto e total calculados.
 * 
 * Autenticação: Requer X-Super-Token no header (token do cliente)
 * 
 * Observação: Atualmente suporta apenas pedidos DELIVERY.
 * Para MESA/BALCAO, não há preview disponível.
 */
export function usePreviewCheckout(
  enderecoId: number | null, 
  meioPagamentoId: number | null,
  enabled: boolean = true
) {
  const { items, observacao } = useCart();
  
  const empresa_id = getEmpresaId();
  const telefone_cliente = getTokenCliente();
  
  return useQuery<PreviewCheckoutResult | null>({
    queryKey: ["preview-checkout", items.map(i => `${i.cod_barras}-${i.quantity}`).join(","), enderecoId, meioPagamentoId, observacao],
    queryFn: async () => {
      if (
        !empresa_id ||
        !telefone_cliente ||
        !enderecoId ||
        !meioPagamentoId ||
        items.length === 0
      ) {
        return null;
      }

      try {
        // Prepara payload para o gateway
        const payload: Omit<CheckoutGatewayRequest, "tipo_pedido"> & { tipo_pedido?: "DELIVERY" } = {
          tipo_pedido: "DELIVERY",
          empresa_id,
          endereco_id: enderecoId,
          meio_pagamento_id: meioPagamentoId,
          tipo_entrega: "DELIVERY",
          origem: "WEB",
          observacao_geral: observacao || null,
          itens: items.map((i) => ({
            produto_cod_barras: i.cod_barras,
            quantidade: i.quantity,
            observacao: i.observacao || undefined,
          })),
        };

        // Chama o gateway orquestrador para preview
        const result = await previewCheckoutGateway(payload);

        return result;
      } catch (error: any) {
        // Se der erro 400 (área de atendimento), retorna null
        if (error.response?.status === 400) {
          console.warn("Endereço fora da área de atendimento");
          return null;
        }
        console.error("Erro ao calcular preview do checkout:", error);
        return null;
      }
    },
    enabled: enabled && !!empresa_id && !!telefone_cliente && !!enderecoId && !!meioPagamentoId && items.length > 0,
    staleTime: 10000, // Cache por 10 segundos
    refetchOnWindowFocus: false,
  });
}
