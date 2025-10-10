import type { PedidoStatus } from '@/types/pedido'

// Configuração visual e de texto para cada status de pedido 
export const PEDIDO_STATUS = {  
  P: {
    label: 'Pendente',
    color: 'bg-yellow-500',
    textColor: 'text-white',
  },
  I: {
    label: 'Recebido',
    color: 'bg-blue-500',
    textColor: 'text-white',
  },
  R: {
    label: 'Preparando',
    color: 'bg-purple-600',
    textColor: 'text-white',
  },
  S: {
    label: 'Pronto',
    color: 'bg-primary',
    textColor: 'text-white',
  },
  E: {
    label: 'Saiu para entrega',
    color: 'bg-orange-500',
    textColor: 'text-white',
  },
  C: {
    label: 'Entregue',
    color: 'bg-green-600',
    textColor: 'text-white',
  },
  D: {
    label: 'Cancelado',
    color: 'bg-red-600',
    textColor: 'text-white',
  },
  X: {
    label: 'Especial',
    color: 'bg-slate-700',
    textColor: 'text-white',
  },
  A: {
    label: 'Aguardando',
    color: 'bg-gray-500',
    textColor: 'text-white',
  }
} as const


// Ordem de exibição das colunas no Kanban 
export const STATUS_ORDER: PedidoStatus[] = [
  'I',    
  'R',  
  'E',
  'C',
  'D',    
]
