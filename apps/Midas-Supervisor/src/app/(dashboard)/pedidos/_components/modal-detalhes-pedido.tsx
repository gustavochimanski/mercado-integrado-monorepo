'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/pedidos/status-badge'
import { buscarDetalhesPedido } from '@/actions/pedidos/buscar-detalhes'
import type { PedidoDetalhado } from '@/types/pedido'
import {
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Bike,
  FileText,
  Package,
  DollarSign,
  Receipt,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ModalDetalhesPedidoProps {
  pedidoId: number | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal que mostra todos os detalhes de um pedido
 * Busca informações completas via Server Action
 */
export function ModalDetalhesPedido({
  pedidoId,
  isOpen,
  onClose,
}: ModalDetalhesPedidoProps) {
  const [pedido, setPedido] = useState<PedidoDetalhado | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buscarDetalhes = useCallback(async () => {
    if (!pedidoId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await buscarDetalhesPedido(pedidoId)

      if (result.success) {
        setPedido(result.data)
      } else {
        setError(result.error || 'Erro ao buscar detalhes do pedido')
      }
    } catch (err) {
      setError('Erro ao buscar detalhes do pedido')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [pedidoId])

  // Buscar detalhes quando o modal abrir
  useEffect(() => {
    if (isOpen && pedidoId) {
      buscarDetalhes()
    } else {
      setPedido(null)
      setError(null)
    }
  }, [isOpen, pedidoId, buscarDetalhes])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            Detalhes do Pedido #{pedidoId}
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre o pedido
          </DialogDescription>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={buscarDetalhes} variant="outline" size="sm" className="mt-2">
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Conteúdo */}
        {pedido && !isLoading && (
          <div className="space-y-6">
            {/* Status e Data */}
            <div className="flex items-center justify-between">
              <StatusBadge status={pedido.status} className="text-sm px-4 py-2" />
              {pedido.data_pedido && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(pedido.data_pedido), 'PPP', { locale: ptBR })}
                </div>
              )}
            </div>

            <Separator />

            {/* Informações do Cliente */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Cliente
              </h3>
              <div className="grid gap-2 pl-7">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {pedido.cliente?.nome || pedido.nome_cliente}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {pedido.cliente?.telefone || pedido.telefone_cliente}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    {typeof pedido.endereco === 'string' ? (
                      pedido.endereco
                    ) : pedido.endereco?.endereco_selecionado ? (
                      <>
                        {pedido.endereco.endereco_selecionado.logradouro}
                        {pedido.endereco.endereco_selecionado.numero && `, ${pedido.endereco.endereco_selecionado.numero}`}
                        {pedido.endereco.endereco_selecionado.complemento && ` - ${pedido.endereco.endereco_selecionado.complemento}`}
                        <br />
                        {pedido.endereco.endereco_selecionado.bairro} - {pedido.endereco.endereco_selecionado.cidade}/{pedido.endereco.endereco_selecionado.estado}
                        <br />
                        CEP: {pedido.endereco.endereco_selecionado.cep}
                        {pedido.endereco.endereco_selecionado.ponto_referencia && (
                          <>
                            <br />
                            <span className="text-xs text-muted-foreground">
                              Ref: {pedido.endereco.endereco_selecionado.ponto_referencia}
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      'Endereço não informado'
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Itens do Pedido */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Itens ({pedido.itens.length})
              </h3>
              <div className="space-y-2">
                {pedido.itens.map((item) => (
                  <div
                    key={item.id}
                    className="bg-muted/50 rounded-lg p-3 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.produto_nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Cód: {item.produto_cod_barras}
                      </p>
                      {item.observacao && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          Obs: {item.observacao}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {item.quantidade}x R${' '}
                        {item.preco_unitario.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-sm font-semibold">
                        R${' '}
                        {(item.quantidade * item.preco_unitario)
                          .toFixed(2)
                          .replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pagamento */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Pagamento
              </h3>
              <div className="grid gap-2 pl-7">
                {pedido.meio_pagamento && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pedido.meio_pagamento.nome}</span>
                  </div>
                )}
                {pedido.troco_para && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Troco para: R$ {pedido.troco_para.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
                {pedido.cupom && (
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Cupom: {pedido.cupom.codigo} (-
                      {pedido.cupom.desconto.toFixed(2).replace('.', ',')}%)
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    R$ {pedido.valor_total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            {/* Entregador */}
            {pedido.entregador && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Bike className="h-5 w-5 text-primary" />
                    Entregador
                  </h3>
                  <div className="grid gap-2 pl-7">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{pedido.entregador.nome}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Observações */}
            {pedido.observacoes && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Observações
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm">{pedido.observacoes}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
