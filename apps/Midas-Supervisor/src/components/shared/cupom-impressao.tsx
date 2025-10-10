'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PedidoImpressao } from '@/types/impressao'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CupomImpressaoProps {
  dados: PedidoImpressao
}

/**
 * Template de cupom para impressão
 * Otimizado para impressora térmica 80mm
 */
export function CupomImpressao({ dados }: CupomImpressaoProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatarData = (dataISO: string) => {
    try {
      return format(new Date(dataISO), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch {
      return dataISO
    }
  }

  // Não renderizar no servidor para evitar hydration errors
  if (!isMounted) {
    return null
  }

  const cupomContent = (
    <div className="cupom-container" id="cupom-impressao">
      {/* Cabeçalho da Empresa */}
      <div className="cupom-header">
        <div className="cupom-logo">
          {/* Aqui pode adicionar logo da empresa */}
        </div>
        <h1 className="cupom-empresa-nome">{dados.empresa.nome}</h1>
        {dados.empresa.cnpj && (
          <p className="cupom-info">CNPJ: {dados.empresa.cnpj}</p>
        )}
        {dados.empresa.endereco && (
          <p className="cupom-info">{dados.empresa.endereco}</p>
        )}
        {dados.empresa.telefone && (
          <p className="cupom-info">Tel: {dados.empresa.telefone}</p>
        )}
      </div>

      <div className="cupom-divider">{'='.repeat(42)}</div>

      {/* Informações do Pedido */}
      <div className="cupom-section">
        <h2 className="cupom-pedido-numero">PEDIDO #{dados.numero}</h2>
        <p className="cupom-data">Data: {formatarData(dados.data_criacao)}</p>
        <p className="cupom-aviso">*** NÃO É DOCUMENTO FISCAL ***</p>
      </div>

      <div className="cupom-divider-thin">{'-'.repeat(42)}</div>

      {/* Informações do Cliente */}
      <div className="cupom-section">
        <p><strong>Cliente:</strong> {dados.cliente}</p>
        {dados.telefone_cliente && (
          <p><strong>Telefone:</strong> {dados.telefone_cliente}</p>
        )}
        {dados.endereco && (
          <p><strong>Endereço:</strong> {dados.endereco}</p>
        )}
      </div>

      <div className="cupom-divider-thin">{'-'.repeat(42)}</div>

      {/* Lista de Itens */}
      <div className="cupom-section">
        <h3 className="cupom-section-title">ITENS</h3>
        {dados.itens.map((item, index) => (
          <div key={index} className="cupom-item">
            <div className="cupom-item-header">
              <span>{item.quantidade}x {item.descricao}</span>
              <span>{formatarMoeda(item.preco * item.quantidade)}</span>
            </div>
            <div className="cupom-item-details">
              <span>Preço unit: {formatarMoeda(item.preco)}</span>
            </div>
            {item.observacao && (
              <div className="cupom-item-obs">
                Obs: {item.observacao}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="cupom-divider-thin">{'-'.repeat(42)}</div>

      {/* Totais */}
      <div className="cupom-section cupom-totais">
        <div className="cupom-total-line">
          <span>Subtotal</span>
          <span>{formatarMoeda(dados.subtotal)}</span>
        </div>

        {dados.taxa_entrega > 0 && (
          <div className="cupom-total-line">
            <span>Taxa de entrega</span>
            <span>{formatarMoeda(dados.taxa_entrega)}</span>
          </div>
        )}

        {dados.taxa_servico > 0 && (
          <div className="cupom-total-line">
            <span>Taxa de serviço</span>
            <span>{formatarMoeda(dados.taxa_servico)}</span>
          </div>
        )}

        {dados.desconto > 0 && (
          <div className="cupom-total-line cupom-desconto">
            <span>Desconto</span>
            <span>-{formatarMoeda(dados.desconto)}</span>
          </div>
        )}

        <div className="cupom-divider">{'='.repeat(42)}</div>

        <div className="cupom-total-line cupom-total-final">
          <span>TOTAL</span>
          <span>{formatarMoeda(dados.total)}</span>
        </div>
      </div>

      <div className="cupom-divider">{'='.repeat(42)}</div>

      {/* Pagamento */}
      <div className="cupom-section">
        <div className="cupom-pagamento">
          <p><strong>Forma de Pagamento:</strong> {dados.tipo_pagamento}</p>
          {dados.troco > 0 && (
            <>
              <p><strong>Troco para:</strong> {formatarMoeda(dados.troco)}</p>
              <p><strong>Troco:</strong> {formatarMoeda(dados.troco - dados.total)}</p>
            </>
          )}
        </div>
      </div>

      {/* Observações */}
      {dados.observacao_geral && (
        <>
          <div className="cupom-divider-thin">{'-'.repeat(42)}</div>
          <div className="cupom-section">
            <p><strong>Observações:</strong></p>
            <p className="cupom-observacao">{dados.observacao_geral}</p>
          </div>
        </>
      )}

      <div className="cupom-divider">{'='.repeat(42)}</div>

      {/* Rodapé */}
      <div className="cupom-footer">
        <p>Obrigado pela preferência!</p>
        <p>Volte sempre!</p>
      </div>

      <style jsx global>{`
        /* Estilos para tela */
        .cupom-container {
          display: none;
        }

        /* Estilos para impressão */
        @media print {
          /* Ocultar TUDO da página */
          body > *:not(#cupom-impressao) {
            display: none !important;
            visibility: hidden !important;
          }

          /* Ocultar elementos específicos do Next.js e React */
          #__next,
          [id^="radix-"],
          [data-radix-portal],
          header,
          nav,
          aside,
          footer,
          .modal,
          [role="dialog"],
          [role="presentation"] {
            display: none !important;
            visibility: hidden !important;
          }

          /* Reset do HTML e Body */
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100% !important;
            height: auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
          }

          /* Mostrar APENAS o cupom */
          #cupom-impressao,
          .cupom-container {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 5mm !important;
            margin: 0 auto !important;
            font-family: 'Courier New', monospace !important;
            font-size: 9pt !important;
            line-height: 1.4 !important;
            color: #000 !important;
            background: #fff !important;
          }

          /* Cabeçalho */
          .cupom-header {
            text-align: center;
            margin-bottom: 8px;
          }

          .cupom-empresa-nome {
            font-size: 12pt;
            font-weight: bold;
            margin: 4px 0;
          }

          .cupom-info {
            font-size: 8pt;
            margin: 2px 0;
          }

          /* Divisores */
          .cupom-divider {
            margin: 8px 0;
            font-size: 8pt;
            text-align: center;
            overflow: hidden;
          }

          .cupom-divider-thin {
            margin: 4px 0;
            font-size: 8pt;
            text-align: center;
            overflow: hidden;
          }

          /* Seções */
          .cupom-section {
            margin: 6px 0;
          }

          .cupom-section-title {
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 4px;
            text-align: center;
          }

          .cupom-pedido-numero {
            font-size: 11pt;
            font-weight: bold;
            text-align: center;
          }

          .cupom-data {
            font-size: 8pt;
            text-align: center;
            margin-top: 2px;
          }

          .cupom-aviso {
            font-size: 8pt;
            text-align: center;
            margin-top: 4px;
            font-weight: bold;
          }

          /* Itens */
          .cupom-item {
            margin-bottom: 6px;
          }

          .cupom-item-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
          }

          .cupom-item-details {
            font-size: 8pt;
            color: #666;
            margin-top: 2px;
          }

          .cupom-item-obs {
            font-size: 8pt;
            font-style: italic;
            margin-top: 2px;
          }

          /* Totais */
          .cupom-totais {
            margin-top: 8px;
          }

          .cupom-total-line {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }

          .cupom-total-final {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 4px;
          }

          .cupom-desconto {
            color: #d32f2f;
          }

          /* Pagamento */
          .cupom-pagamento p {
            margin: 2px 0;
          }

          /* Observações */
          .cupom-observacao {
            margin-top: 4px;
            font-style: italic;
          }

          /* Rodapé */
          .cupom-footer {
            text-align: center;
            margin-top: 8px;
            font-size: 8pt;
          }

          .cupom-footer p {
            margin: 2px 0;
          }

          /* Configuração da página para impressora térmica */
          @page {
            margin: 0;
            padding: 0;
            size: 80mm auto; /* Largura fixa 80mm, altura automática (papel contínuo) */
          }

          /* Remove quebras de página dentro do cupom */
          .cupom-container,
          .cupom-section,
          .cupom-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )

  // Renderizar o cupom direto no body usando portal
  return createPortal(cupomContent, document.body)
}
