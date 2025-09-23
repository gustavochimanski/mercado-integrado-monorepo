// Propriedades e Tipos para os Componentes do Modal de Pedidos
import { PedidoKanban } from "@supervisor/types/pedido"

// Define as propriedades esperadas pelo componente ClienteTab
export interface ClienteTabProps {
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  pedidoCompleto: any
  getEnderecoCompleto: () => string
}

// Define as propriedades esperadas pelo componente EntregaTab
export interface EntregaTabProps {
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  pedidoCompleto: any
  formatDateTime: (date: string) => string
}

// Define as propriedades esperadas pelo componente HistoricoTab
export interface HistoricoTabProps {
  pedidoCompleto: any
  formatDateTime: (date: string) => string
}

// Define as propriedades esperadas pelo componente ItensTab
export interface ItensTabProps {
  pedidoCompleto: any
  itensEditados: any[]
  isEditingItens: boolean
  isSavingItens: boolean
  canEdit: () => boolean
  handleEditarItens: () => void
  handleCancelarEdicaoItens: () => void
  handleSalvarItens: () => void
  handleQuantidadeChange: (index: number, novaQuantidade: number) => void
  handleObservacaoChange: (index: number, novaObservacao: string) => void
  handleRemoverItem: (index: number) => void
  formatCurrency: (value: number) => string
}

// Define as propriedades esperadas pelo componente PagamentoTab
export interface PagamentoTabProps {
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  pedidoCompleto: any
  meiosPagamento: any[]
  getMeioPagamentoNome: (id: number | null) => string
  isMeioPagamentoDinheiro: () => boolean
  handleTrocoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formatCurrency: (value: number) => string
}

// Define as propriedades esperadas pelo componente PedidosModal
export interface PedidoModalProps {
  pedido: PedidoKanban | null
  isOpen: boolean
  onClose: () => void
}

// Define a estrutura dos dados do formulário de pedido
export interface PedidoFormData {
  meio_pagamento_id: number | null
  observacao_geral: string
  troco_para: number
  entregador_id: number | null
  nome_cliente: string
  cpf_cliente: string
  telefone_cliente: string
  email_cliente: string
  data_nascimento_cliente: string
}