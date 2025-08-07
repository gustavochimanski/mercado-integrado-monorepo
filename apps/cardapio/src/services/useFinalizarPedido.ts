// src/services/pedidos/useFinalizarPedido.ts
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useCart } from "@cardapio/stores/cart/useCart";
import { FinalizarPedidoPayload } from "@cardapio/types/pedido";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import apiAdmin from "@cardapio/app/api/apiAdmin";

interface UseFinalizarPedidoResult {
  loading: boolean;
  finalizarPedido: (opts: {
    cliente_id: string;
    meio_pagamento_id?: string;
    endereco_entrega_id?: string;
  }) => Promise<void>;
}

export function useFinalizarPedido(): UseFinalizarPedidoResult {
  const { items, observacao, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function finalizarPedido({
    cliente_id,
    meio_pagamento_id,
    endereco_entrega_id,
  }: {
    cliente_id: string;
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
      cliente_id,
      empresa_id,
      meio_pagamento_id,
      endereco_entrega_id,
      observacao_geral: observacao,
      itens: items.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantity,
        observacao: item.observacao,
      })),
    };

    try {
      setLoading(true);
      await apiAdmin.post("/api/delivery/pedido/finalizar", payload);
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
