// src/services/pedidos/useFinalizarPedido.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@cardapio/stores/cart/useCart";
import { FinalizarPedidoPayload } from "@cardapio/types/pedido";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { api } from "@cardapio/app/api/api";

interface UseFinalizarPedidoResult {
  loading: boolean;
  finalizarPedido: (opts: {
    telefone_cliente: string;
    meio_pagamento_id?: string;
    endereco_entrega_id?: string;
  }) => Promise<void>;
}

export function useFinalizarPedido(): UseFinalizarPedidoResult {
  const { items, observacao, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function finalizarPedido({
    telefone_cliente,
    meio_pagamento_id,
    endereco_entrega_id,
  }: {
    telefone_cliente: string;
    meio_pagamento_id?: string;
    endereco_entrega_id?: string;
  }) {
    if (items.length === 0) {
      toast.warning("Seu carrinho está vazio.");
      return;
    }

    // pega empresaId do primeiro item (supõe que todos são da mesma loja)
    const empresa_id = getEmpresaId();
    if (!empresa_id) {
      toast.error("Não foi possível identificar a empresa.");
      return;
    }

    const payload: FinalizarPedidoPayload = {
      telefone_cliente,
      empresa_id,
      meio_pagamento_id,
      endereco_entrega_id,
      observacao_geral: observacao,
      itens: items.map((item) => ({
        produto_cod_barras: item.cod_barras,
        quantidade: item.quantity,
        observacao: item.observacao,
      })),
    };

    try {
      setLoading(true);
      await api.post("/delivery/pedidos/finalizar", payload);
      toast.success("Pedido finalizado com sucesso!");
      clear();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err.message || "Erro ao finalizar pedido.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, finalizarPedido };
}
