import type { PedidoStatus } from "@cardapio/types/pedido";

/**
 * Enum de status de pedido padronizado pelo Gateway
 * 
 * Todos os pedidos (Delivery, Balcão e Mesa) usam este enum unificado.
 * O backend faz a conversão automática dos status originais.
 */
export const PedidoStatusEnum = {
  P: "P",  // PENDENTE
  I: "I",  // PENDENTE_IMPRESSAO
  R: "R",  // EM_PREPARO
  S: "S",  // SAIU_PARA_ENTREGA
  E: "E",  // ENTREGUE
  C: "C",  // CANCELADO
  D: "D",  // EDITADO
  X: "X",  // EM_EDITACAO
  A: "A"   // AGUARDANDO_PAGAMENTO
} as const;

/**
 * Retorna a descrição legível de um status
 * 
 * @param status - Status do pedido (PedidoStatusEnum)
 * @returns Descrição legível do status
 */
export function getStatusDescricao(status: PedidoStatus): string {
  const map: Record<PedidoStatus, string> = {
    [PedidoStatusEnum.P]: "Pendente",
    [PedidoStatusEnum.I]: "Pendente Impressão",
    [PedidoStatusEnum.R]: "Em Preparo",
    [PedidoStatusEnum.S]: "Saiu para Entrega",
    [PedidoStatusEnum.E]: "Entregue",
    [PedidoStatusEnum.C]: "Cancelado",
    [PedidoStatusEnum.D]: "Editado",
    [PedidoStatusEnum.X]: "Em Edição",
    [PedidoStatusEnum.A]: "Aguardando Pagamento"
  };
  
  return map[status] || "Desconhecido";
}

/**
 * Retorna as classes CSS para estilização do badge de status
 * 
 * @param status - Status do pedido (PedidoStatusEnum)
 * @returns Objeto com className para o badge
 */
export function getStatusBadgeStyles(status: PedidoStatus): { className: string } {
  const map: Record<PedidoStatus, string> = {
    [PedidoStatusEnum.P]: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
    [PedidoStatusEnum.I]: "bg-muted text-muted-foreground border-muted-foreground/20",
    [PedidoStatusEnum.R]: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
    [PedidoStatusEnum.S]: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
    [PedidoStatusEnum.E]: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
    [PedidoStatusEnum.C]: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
    [PedidoStatusEnum.D]: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
    [PedidoStatusEnum.X]: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
    [PedidoStatusEnum.A]: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300"
  };
  
  return { className: map[status] || "bg-gray-50 text-gray-700 border-gray-200" };
}

/**
 * Retorna um objeto com label e className para uso em badges
 * 
 * @param status - Status do pedido (PedidoStatusEnum)
 * @returns Objeto com label e className
 */
export function getStatusConfig(status: PedidoStatus): { label: string; className: string } {
  return {
    label: getStatusDescricao(status),
    ...getStatusBadgeStyles(status)
  };
}

/**
 * Valida se um string é um status válido
 * 
 * @param status - String a ser validada
 * @returns true se for um status válido, false caso contrário
 */
export function isValidStatus(status: string): status is PedidoStatus {
  const validStatuses: PedidoStatus[] = ["P", "I", "R", "S", "E", "C", "D", "X", "A"];
  return validStatuses.includes(status as PedidoStatus);
}

/**
 * Normaliza um status, retornando um valor padrão se for inválido
 * 
 * @param status - Status a ser normalizado
 * @param defaultStatus - Status padrão se inválido (padrão: "P")
 * @returns Status válido ou o padrão
 */
export function normalizeStatus(status: string, defaultStatus: PedidoStatus = "P"): PedidoStatus {
  return isValidStatus(status) ? status : defaultStatus;
}
