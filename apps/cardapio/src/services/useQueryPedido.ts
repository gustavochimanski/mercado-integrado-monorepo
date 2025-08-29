import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { Pedido } from "@cardapio/types/pedido";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";

/** 🔎 Tipo de um pedido resumido */
export interface PedidoItem {
  id: number;
  cliente_nome: string;
  status: string;
  valor_total: number;
  data_criacao: string;
}

/** ⏳ debounce simples para evitar flood no servidor enquanto digita */
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ==========================================================================
// ================= Listar pedidos =================
// ==========================================================================
export function usePedidos() {
  return useQuery<Pedido[]>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get<Pedido[]>("/delivery/pedidos/");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ==========================================================================
// ================= Hook para buscar pedido por ID =========================
// ==========================================================================
export function usePedidoById(pedidoId: number | null, opts?: { enabled?: boolean }) {
  const qc = useQueryClient();
  const seed = pedidoId ? qc.getQueryData<PedidoItem>(["pedido", pedidoId]) : undefined;

  return useQuery({
    queryKey: ["pedido", pedidoId],
    queryFn: async () => {
      const { data } = await apiAdmin.get<PedidoItem>(`/delivery/pedidos/${pedidoId}`);
      return data;
    },
    initialData: seed,
    enabled: !!pedidoId && (opts?.enabled ?? true),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// ==========================================================================
// =========== Buscar pedidos com filtro q (server-side) ====================
// ==========================================================================
export function usePedidosSearch(
  q: string,
  opts: {
    limit?: number;
    offset?: number;
    enabled?: boolean;
    minLength?: number;
    debounceMs?: number;
    allowEmpty?: boolean;
  } = {}
) {
  const {
    limit = 30,
    offset = 0,
    enabled = true,
    minLength = 2,
    debounceMs = 300,
    allowEmpty = false,
  } = opts;

  const qDeb = useDebounced(q ?? "", debounceMs);
  const hasTerm = qDeb.trim().length >= minLength;
  const canRun = enabled && (allowEmpty || hasTerm);

  return useQuery({
    queryKey: ["pedidos_search", allowEmpty ? qDeb : hasTerm ? qDeb : "", limit, offset],
    queryFn: async () => {
      const params: Record<string, any> = { limit, offset };
      if (allowEmpty || hasTerm) params.q = qDeb.trim();
      const { data } = await apiAdmin.get<PedidoItem[]>("/delivery/pedidos/search", { params });
      return data;
    },
    enabled: canRun,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (old) => old,
  });
}


// ==========================================================================
// ==========  Mutations para criar/atualizar/remover pedidos ===============
// ==========================================================================
export function useMutatePedido() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos"] });
    qc.invalidateQueries({ queryKey: ["pedidos_search"] });
  };

  const reloadPage = () => {
    invalidate();
    window.location.reload();
  };

  const create = useMutation({
    mutationFn: (body: Partial<PedidoItem>) => apiAdmin.post("/delivery/pedidos", body),
    onSuccess: () => {
      toast.success("Pedido criado com sucesso!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiAdmin.patch(`api/delivery/pedidos/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Status do pedido atualizado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiAdmin.delete(`/delivery/pedidos/${id}`),
    onSuccess: () => {
      toast.success("Pedido removido!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, updateStatus, remove };
}
