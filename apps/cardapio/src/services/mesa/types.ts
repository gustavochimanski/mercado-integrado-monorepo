// @cardapio/services/mesa/types.ts

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

