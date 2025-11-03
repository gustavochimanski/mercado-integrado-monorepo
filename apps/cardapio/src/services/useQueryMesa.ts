// src/services/useQueryMesa.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";

// Tipos baseados na API OpenAPI fornecida
export type StatusMesaEnum = "D" | "O" | "R"; // Disponível, Ocupada, Reservada

export interface MesaOut {
  id: number;
  numero: string;
  descricao?: string | null;
  capacidade: number;
  status: StatusMesaEnum;
  status_descricao: string;
  ativa: string; // "S" | "N"
  label: string;
  is_ocupada: boolean;
  is_disponivel: boolean;
  is_reservada: boolean;
}

export interface MesaListOut {
  id: number;
  numero: string;
  descricao?: string | null;
  capacidade: number;
  status: StatusMesaEnum;
  status_descricao: string;
  ativa: string;
  label: string;
  num_pessoas_atual?: number | null;
  pedidos_abertos?: MesaPedidoResumo[];
}

export interface MesaPedidoResumo {
  id: number;
  numero_pedido: string;
  status: string;
  num_pessoas?: number | null;
  valor_total: number;
}

export interface MesaStatsOut {
  total: number;
  disponiveis: number;
  ocupadas: number;
  reservadas: number;
  ativas: number;
  inativas: number;
}

// Buscar mesas disponíveis (apenas mesas ativas e disponíveis)
export function useQueryMesasDisponiveis(enabled: boolean = true) {
  const empresaId = getEmpresaId();
  
  return useQuery<MesaListOut[]>({
    queryKey: ["mesas", "disponiveis", empresaId],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get("/api/mesas/admin/mesas", {
        params: {
          ativa: true, // Apenas mesas ativas
        },
      });
      
      // Filtrar apenas mesas disponíveis (status "D")
      const mesas: MesaListOut[] = data || [];
      return mesas.filter((m) => m.status === "D");
    },
    enabled: enabled && !!empresaId,
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
  });
}

// Buscar todas as mesas (incluindo ocupadas)
export function useQueryMesas(enabled: boolean = true) {
  const empresaId = getEmpresaId();
  
  return useQuery<MesaListOut[]>({
    queryKey: ["mesas", "todas", empresaId],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get("/api/mesas/admin/mesas", {
        params: {
          ativa: true,
        },
      });
      return data as MesaListOut[];
    },
    enabled: enabled && !!empresaId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

// Buscar uma mesa específica por ID
export function useQueryMesaById(mesaId: number | null, enabled: boolean = true) {
  return useQuery<MesaOut>({
    queryKey: ["mesa", mesaId],
    queryFn: async () => {
      if (!mesaId) throw new Error("Mesa ID é obrigatório");
      const { data } = await apiClienteAdmin.get(`/api/mesas/admin/mesas/${mesaId}`);
      return data as MesaOut;
    },
    enabled: enabled && !!mesaId,
    staleTime: 30 * 1000,
  });
}

// Buscar estatísticas de mesas
export function useQueryMesaStats(enabled: boolean = true) {
  const empresaId = getEmpresaId();
  
  return useQuery<MesaStatsOut>({
    queryKey: ["mesas", "stats", empresaId],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get("/api/mesas/admin/mesas/stats");
      return data as MesaStatsOut;
    },
    enabled: enabled && !!empresaId,
    staleTime: 30 * 1000,
  });
}

