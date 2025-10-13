'use server'

import { cookies } from 'next/headers'
import type { PedidoImpressao } from '@/types/impressao'

/**
 * Tipos para resposta da API
 */
interface ItemPedidoAPI {
  produto_descricao_snapshot?: string
  produto_nome?: string
  quantidade: number
  preco_unitario: number
  observacao?: string
}

interface EnderecoSelecionado {
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

interface EnderecoAPI {
  endereco_selecionado?: EnderecoSelecionado
}

interface EmpresaAPI {
  nome?: string
  cnpj?: string
  logradouro?: string
  numero?: string
  bairro?: string
  cidade?: string
  estado?: string
  telefone?: string
}

/**
 * Busca dados formatados de um pedido para impressão
 *
 * @param pedidoId - ID do pedido a ser impresso
 * @returns Dados do pedido formatados para impressão
 */
export async function buscarDadosImpressao(pedidoId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return {
      success: false,
      error: 'Não autenticado'
    }
  }

  try {
    // Busca os detalhes completos do pedido
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/pedidos/${pedidoId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // Não cachear dados de impressão
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao buscar dados do pedido',
      }
    }

    const pedidoDetalhes = await response.json()

    // Mapear itens do pedido
    const itens = pedidoDetalhes.itens?.map((item: ItemPedidoAPI) => ({
      descricao: item.produto_descricao_snapshot || item.produto_nome || 'Produto',
      quantidade: item.quantidade,
      preco: item.preco_unitario,
      observacao: item.observacao || '',
    })) || []

    // Calcular subtotal: soma de (quantidade × preço) de todos os itens
    const subtotal = itens.reduce((soma: number, item: { quantidade: number; preco: number }) => {
      return soma + (item.quantidade * item.preco)
    }, 0)

    // Formatar dados para impressão seguindo o schema da API
    const dadosImpressao: PedidoImpressao = {
      numero: pedidoDetalhes.id,
      status: pedidoDetalhes.status,
      cliente: pedidoDetalhes.cliente?.nome || 'Cliente não informado',
      telefone_cliente: pedidoDetalhes.cliente?.telefone || '',
      itens,
      subtotal,
      desconto: pedidoDetalhes.valor_desconto || 0,
      taxa_entrega: pedidoDetalhes.taxa_entrega || 0,
      taxa_servico: pedidoDetalhes.taxa_servico || 0,
      total: pedidoDetalhes.valor_total || 0,
      tipo_pagamento: pedidoDetalhes.meio_pagamento?.nome || 'Não informado',
      troco: pedidoDetalhes.troco_para || 0,
      observacao_geral: pedidoDetalhes.observacao_geral || '',
      endereco: formatarEndereco(pedidoDetalhes.endereco),
      data_criacao: pedidoDetalhes.data_criacao || new Date().toISOString(),
      empresa: {
        nome: pedidoDetalhes.empresa?.nome || 'NOME DA EMPRESA',
        cnpj: pedidoDetalhes.empresa?.cnpj || '',
        endereco: formatarEnderecoEmpresa(pedidoDetalhes.empresa),
        telefone: pedidoDetalhes.empresa?.telefone || '',
      },
    }

    return {
      success: true,
      data: dadosImpressao
    }
  } catch (error) {
    console.error('Erro ao buscar dados para impressão:', error)
    return {
      success: false,
      error: 'Erro ao buscar dados do pedido'
    }
  }
}

/**
 * Formata o endereço de entrega do pedido
 */
function formatarEndereco(endereco: EnderecoAPI | undefined): string {
  if (!endereco?.endereco_selecionado) return 'Endereço não informado'

  const { logradouro, numero, complemento, bairro, cidade, estado } = endereco.endereco_selecionado

  const partes = [
    logradouro,
    numero ? `nº ${numero}` : null,
    complemento,
    bairro,
    cidade,
    estado
  ].filter(Boolean)

  return partes.join(', ')
}

/**
 * Formata o endereço da empresa
 */
function formatarEnderecoEmpresa(empresa: EmpresaAPI | undefined): string {
  if (!empresa) return ''

  const { logradouro, numero, bairro, cidade, estado } = empresa

  const partes = [
    logradouro,
    numero ? `nº ${numero}` : null,
    bairro,
    cidade,
    estado
  ].filter(Boolean)

  return partes.join(', ')
}
