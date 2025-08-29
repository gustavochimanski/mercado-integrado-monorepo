"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import {
  getTokenCliente,
  getEnderecoPadraoId,
  getMeioPagamentoId,
} from "@cardapio/stores/client/ClientStore";
import { FinalizarPedidoRequest } from "@cardapio/types/pedido";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";

interface UseFinalizarPedidoResult {
  loading: boolean;
  finalizarPedido: () => Promise<void>;
}

export function useFinalizarPedido(): UseFinalizarPedidoResult {
  const { items, observacao, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function finalizarPedido(): Promise<void> {
    setLoading(true); // garante que o botão fique em loading mesmo se algum check falhar

    try {
      // valida carrinho
      if (items.length === 0) {
        toast.warning("Carrinho vazio.");
        return;
      }

      // pega dados do cliente e pedido
      const empresa_id = getEmpresaId();
      const telefone_cliente = getTokenCliente();
      const endereco_id = getEnderecoPadraoId();
      const meio_pagamento_id = getMeioPagamentoId();

      console.log("Finalizando pedido:", { empresa_id, telefone_cliente, endereco_id, meio_pagamento_id, items });

      // valida dados obrigatórios
      if (!empresa_id || !telefone_cliente || !endereco_id || !meio_pagamento_id) {
        toast.error("Informações do cliente incompletas.");
        return;
      }

      // monta payload
      const payload: FinalizarPedidoRequest = {
        telefone_cliente,
        empresa_id,
        endereco_id,
        meio_pagamento_id,
        tipo_entrega: "DELIVERY",
        origem: "WEB",
        observacao_geral: observacao || undefined,
        cupom_id: undefined,
        troco_para: undefined,
        itens: items.map((i) => ({
          produto_cod_barras: i.cod_barras,
          quantidade: i.quantity,
          observacao: i.observacao,
        })),
      };

      // chama API
      const response = await apiClienteAdmin.post("/delivery/pedidos/checkout", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Pedido finalizado com sucesso!");
        clear();
      } else {
        toast.error("Não foi possível finalizar o pedido. Tente novamente.");
        console.error("Resposta inesperada da API:", response);
      }

    } catch (err: any) {
      console.error("Erro ao finalizar pedido:", err);
      toast.error(err?.response?.data?.detail || err.message || "Erro ao finalizar pedido.");
    } finally {
      setLoading(false); // garante que o loading volte para false em qualquer caso
    }
  }

  return { loading, finalizarPedido };
}
