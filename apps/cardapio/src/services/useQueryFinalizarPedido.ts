import { useState } from "react";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import {
  getTokenCliente,
  getEnderecoPadraoId,
  getMeioPagamentoId,
  getCliente,
} from "@cardapio/stores/client/ClientStore";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useQueryClient } from "@tanstack/react-query";
import { checkoutGateway } from "@cardapio/services/useGatewayCheckout";
import type { TipoPedidoGateway, CheckoutGatewayRequest } from "@cardapio/types/pedido";

type TipoPedido = "DELIVERY" | "MESA" | "BALCAO";

interface UseFinalizarPedidoResult {
  loading: boolean;
  finalizarPedido: (trocoPara?: number | null, tipoPedido?: TipoPedido | null, mesaId?: number) => Promise<"sucesso" | { status: "erro"; message: string }>;
}

export function useFinalizarPedido(): UseFinalizarPedidoResult {
  const { items, observacao, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function finalizarPedido(
    trocoPara?: number | null,
    tipoPedido: TipoPedido | null = "DELIVERY",
    mesaId?: number
  ): Promise<"sucesso" | { status: "erro"; message: string }> {
    setLoading(true);

    try {
      if (items.length === 0) {
        return { status: "erro", message: "Carrinho vazio. Adicione itens antes de finalizar o pedido." };
      }

      const empresa_id = getEmpresaId();
      const telefone_cliente = getTokenCliente();
      const cliente = getCliente();
      const endereco_id = getEnderecoPadraoId();
      const meio_pagamento_id = getMeioPagamentoId();

      if (!empresa_id) {
        return { status: "erro", message: "Empresa não encontrada. Recarregue a página e tente novamente." };
      }

      const tipo = tipoPedido || "DELIVERY";

      // Token obrigatório apenas para DELIVERY
      if (tipo === "DELIVERY" && !telefone_cliente) {
        return { status: "erro", message: "Cliente não identificado. Faça login novamente." };
      }

      // Validações específicas por tipo
      if (tipo === "DELIVERY") {
        if (!endereco_id) {
          return { status: "erro", message: "Endereço não selecionado. Selecione um endereço de entrega." };
        }
      }

      // Validação de mesa: apenas para MESA (BALCAO não precisa)
      if (tipo === "MESA") {
        if (!mesaId) {
          return { status: "erro", message: "Mesa não selecionada. Selecione uma mesa." };
        }
      }

      // Validação de meios de pagamento apenas para DELIVERY
      if (tipo === "DELIVERY" && !meio_pagamento_id) {
        return { status: "erro", message: "Forma de pagamento não selecionada. Escolha uma forma de pagamento." };
      }

      // Monta os itens do pedido
      const itensPedido = items.map((i) => ({
        produto_cod_barras: i.cod_barras,
        quantidade: i.quantity,
        observacao: i.observacao || undefined,
      }));

      // Prepara payload base para o gateway
      const payloadBase: CheckoutGatewayRequest = {
        tipo_pedido: tipo as TipoPedidoGateway,
        empresa_id,
        itens: itensPedido,
        observacao_geral: observacao || null,
        cliente_id: cliente?.id ? Number(cliente.id) : null,
      };

      // Adiciona campos específicos por tipo de pedido
      if (tipo === "DELIVERY") {
        payloadBase.endereco_id = endereco_id;
        payloadBase.meio_pagamento_id = meio_pagamento_id || null;
        payloadBase.tipo_entrega = "DELIVERY";
        payloadBase.origem = "WEB";
        payloadBase.cupom_id = null; // Pode ser expandido no futuro
        payloadBase.troco_para = trocoPara || null;
      } else if (tipo === "MESA") {
        payloadBase.mesa_id = mesaId || null;
        payloadBase.num_pessoas = null; // Pode ser expandido no futuro
        payloadBase.meio_pagamento_id = meio_pagamento_id || null;
        payloadBase.troco_para = trocoPara || null;
      } else if (tipo === "BALCAO") {
        // BALCAO não precisa de mesa_id (ou usa mesa reservada para balcão se informada)
        payloadBase.mesa_id = mesaId || null;
        payloadBase.meio_pagamento_id = meio_pagamento_id || null;
        payloadBase.troco_para = trocoPara || null;
      }

      // Remove campos undefined (mas mantém null explicitamente)
      Object.keys(payloadBase).forEach(key => {
        if (payloadBase[key as keyof CheckoutGatewayRequest] === undefined) {
          delete payloadBase[key as keyof CheckoutGatewayRequest];
        }
      });

      // Chama o gateway orquestrador
      // Endpoint: POST /api/gateway/pedidos/checkout
      // O gateway redireciona automaticamente para o sistema apropriado baseado no tipo_pedido
      const response = await checkoutGateway(payloadBase);

      if (response.success) {
        clear();
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
        
        // Invalida cache de mesas para pedidos de MESA/BALCAO
        if (tipo === "MESA" || tipo === "BALCAO") {
          queryClient.invalidateQueries({ queryKey: ["mesas"] });
        }
        
        return "sucesso";
      }
      
      return { 
        status: "erro", 
        message: response.message || "Erro ao processar pedido. Tente novamente." 
      };
    } catch (error: any) {
      console.error("Erro ao finalizar pedido:", error);

      // Verifica se é erro 400 (área de atendimento)
      if (error.response?.status === 400) {
        const apiMessage = error.response?.data?.message || error.response?.data?.detail;
        if (apiMessage && apiMessage.includes("área")) {
          return { status: "erro", message: "❌ Endereço fora da área de atendimento. Selecione outro endereço ou verifique se a empresa atende sua região." };
        }
      }

      // Usa a função extractErrorMessage para extrair a mensagem de erro
      const errorMessage = extractErrorMessage(error, "Erro inesperado ao finalizar pedido");

      return { status: "erro", message: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  return { loading, finalizarPedido };
}
