/**
 * Tipos TypeScript para o sistema de complementos
 * 
 * Este arquivo centraliza todas as interfaces relacionadas a complementos
 * para facilitar a manutenção e garantir consistência em todo o projeto.
 */

/**
 * Interface para um Adicional (Item) dentro de um Complemento
 * Corresponde ao AdicionalResponse da API
 */
export interface AdicionalComplementoResponse {
  id: number;                        // ID do adicional (usado como adicional_id nos pedidos)
  nome: string;                      // Nome do adicional (ex: "Pequeno", "Coca-Cola")
  descricao?: string | null;         // Descrição
  preco: number;                     // Preço adicional
  custo: number;                     // Custo (geralmente não usado no frontend)
  ativo: boolean;                   // Se está ativo
  ordem: number;                     // Ordem de exibição
  created_at: string;                // ISO 8601
  updated_at: string;                // ISO 8601
}

/**
 * Alias para compatibilidade com código existente
 * @deprecated Use AdicionalComplementoResponse em vez disso
 */
export type AdicionalComplemento = AdicionalComplementoResponse;

/**
 * Interface para um Complemento
 * Corresponde ao ComplementoResponse da API
 */
export interface ComplementoResponse {
  id: number;                        // ID do complemento
  empresa_id: number;                // ID da empresa
  nome: string;                      // Nome do complemento (ex: "Tamanho", "Bebida")
  descricao?: string | null;         // Descrição do complemento
  obrigatorio: boolean;              // Se é obrigatório selecionar
  quantitativo: boolean;             // Se permite quantidade > 1
  permite_multipla_escolha: boolean; // Se permite selecionar múltiplos adicionais
  minimo_itens?: number | null;      // Quantidade mínima de itens (se aplicável)
  maximo_itens?: number | null;      // Quantidade máxima de itens (se aplicável)
  ordem: number;                     // Ordem de exibição
  ativo: boolean;                   // Se está ativo
  adicionais: AdicionalComplementoResponse[]; // Lista de adicionais
  created_at: string;                // ISO 8601
  updated_at: string;                // ISO 8601
}

/**
 * Resultado da validação de complementos
 */
export interface ValidacaoComplementosResult {
  valido: boolean;
  erro?: string;
}

/**
 * Tipo do produto para buscar complementos
 * Corresponde ao TipoProdutoEnum do backend
 */
export type TipoProdutoEnum = "produto" | "combo" | "receita";

/**
 * Tipo de pedido para buscar complementos
 * Corresponde ao TipoPedidoEnum do backend (em minúsculas)
 */
export type TipoPedidoEnum = "balcao" | "mesa" | "delivery";

/**
 * Tipo de pedido usado no frontend (em maiúsculas)
 */
export type TipoPedidoFrontend = "DELIVERY" | "MESA" | "BALCAO";

/**
 * Converte o tipo de pedido do frontend (maiúsculas) para o formato do backend (minúsculas)
 * 
 * @param tipoPedido - Tipo de pedido do frontend: "DELIVERY", "MESA" ou "BALCAO"
 * @returns Tipo de pedido do backend: "delivery", "mesa" ou "balcao"
 * 
 * @example
 * ```ts
 * const tipoBackend = converterTipoPedidoParaBackend("DELIVERY"); // "delivery"
 * ```
 */
export function converterTipoPedidoParaBackend(tipoPedido: TipoPedidoFrontend | null | undefined): TipoPedidoEnum {
  if (!tipoPedido) {
    return "delivery"; // Default
  }
  
  const mapping: Record<TipoPedidoFrontend, TipoPedidoEnum> = {
    DELIVERY: "delivery",
    MESA: "mesa",
    BALCAO: "balcao",
  };
  
  return mapping[tipoPedido] || "delivery";
}

