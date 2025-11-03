import type { Pedido } from "@cardapio/types/pedido";

/**
 * Identifica o tipo de pedido baseado nas propriedades do pedido retornado pelo gateway
 * 
 * Lógica:
 * - Se tiver endereco_snapshot → DELIVERY
 * - Se observacao_geral contém "Pedido de mesa" → MESA
 * - Se observacao_geral contém "Pedido de balcão" ou "BAL-" → BALCAO
 * - Fallback: se não tem endereço e não é mesa, provavelmente é balcão
 * 
 * @param pedido - Pedido retornado pelo gateway
 * @returns Tipo do pedido: 'DELIVERY' | 'MESA' | 'BALCAO'
 */
export function getTipoPedido(pedido: Pedido): 'DELIVERY' | 'MESA' | 'BALCAO' {
  const obs = pedido.observacao_geral || '';
  
  // Se tem endereço = delivery
  if (pedido.endereco_snapshot) {
    return 'DELIVERY';
  }
  
  // Se observação menciona mesa
  if (obs.includes('Pedido de mesa') || obs.includes('Mesa-')) {
    return 'MESA';
  }
  
  // Se observação menciona balcão
  if (obs.includes('Pedido de balcão') || obs.includes('BAL-')) {
    return 'BALCAO';
  }
  
  // Fallback: se não tem endereço e não é mesa, provavelmente é balcão
  return 'BALCAO';
}

/**
 * Retorna informações de badge para o tipo de pedido
 * 
 * @param tipo - Tipo do pedido
 * @returns Objeto com label, ícone e estilos
 */
export function getTipoPedidoBadge(tipo: 'DELIVERY' | 'MESA' | 'BALCAO') {
  const badges = {
    DELIVERY: {
      label: '🚚 Delivery',
      className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
    },
    MESA: {
      label: '🍽️ Mesa',
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
    },
    BALCAO: {
      label: '🥤 Balcão',
      className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
    },
  };
  
  return badges[tipo];
}
