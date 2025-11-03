"use client";

import { useState, useEffect } from "react";
import { Loader2, Clock, User, AlertCircle } from "lucide-react";
import { useQueryHistoricoPedidoBalcao } from "@cardapio/services/useQueryBalcao";
import { Card, CardContent, CardHeader, CardTitle } from "@cardapio/components/Shared/ui/card";
import { Badge } from "@cardapio/components/Shared/ui/badge";
import { getStatusDescricao, normalizeStatus } from "@cardapio/utils/statusHelpers";

interface PedidoBalcaoHistoricoProps {
  pedidoId: number;
}

/**
 * Componente para exibir o histórico de alterações de um pedido de balcão
 * 
 * Mostra timeline de todas as operações realizadas no pedido incluindo:
 * - Criação do pedido
 * - Adição/remoção de itens
 * - Mudanças de status
 * - Fechamento
 * - Reabertura
 */
export default function PedidoBalcaoHistorico({ pedidoId }: PedidoBalcaoHistoricoProps) {
  const { data: historicoData, isLoading, error } = useQueryHistoricoPedidoBalcao(pedidoId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm text-muted-foreground">Carregando histórico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertCircle size={20} />
            <p className="text-sm">Erro ao carregar histórico do pedido</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!historicoData || historicoData.historicos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-sm text-muted-foreground text-center">
            Nenhum histórico disponível para este pedido
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historicoData.historicos.map((item, index) => (
            <HistoricoItem
              key={item.id}
              item={item}
              isLast={index === historicoData.historicos.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface HistoricoItemProps {
  item: {
    id: number;
    tipo_operacao: string;
    tipo_operacao_descricao: string;
    resumo_operacao: string;
    status_anterior?: string | null;
    status_novo?: string | null;
    descricao?: string | null;
    observacoes?: string | null;
    usuario?: string | null;
    created_at: string;
  };
  isLast: boolean;
}

/**
 * Item individual do histórico
 */
function HistoricoItem({ item, isLast }: HistoricoItemProps) {
  const corOperacao = getCorPorOperacao(item.tipo_operacao);
  
  return (
    <div className="relative">
      {/* Linha vertical */}
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
      )}
      
      <div className="flex gap-4">
        {/* Ícone circular */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${corOperacao.bg}`}>
          <div className={`w-3 h-3 rounded-full ${corOperacao.dot}`} />
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1 pb-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {item.tipo_operacao_descricao}
              </Badge>
              {item.status_anterior && item.status_novo && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {getStatusDescricao(normalizeStatus(item.status_anterior))}
                  </Badge>
                  <span>→</span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {getStatusDescricao(normalizeStatus(item.status_novo))}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <Clock size={12} />
              <span>{formatarData(item.created_at)}</span>
            </div>
          </div>
          
          {/* Resumo */}
          <p className="text-sm font-medium mb-1">{item.resumo_operacao}</p>
          
          {/* Descrição detalhada */}
          {item.descricao && (
            <p className="text-xs text-muted-foreground mb-1">{item.descricao}</p>
          )}
          
          {/* Observações (pagamento, etc) */}
          {item.observacoes && (
            <div className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 mb-1">
              {item.observacoes}
            </div>
          )}
          
          {/* Usuário responsável */}
          {item.usuario && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <User size={12} />
              <span>{item.usuario}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Retorna cor e estilos baseados no tipo de operação
 */
function getCorPorOperacao(tipoOperacao: string): { bg: string; dot: string } {
  const cores: Record<string, { bg: string; dot: string }> = {
    PEDIDO_CRIADO: { bg: "bg-blue-50", dot: "bg-blue-500" },
    PEDIDO_CONFIRMADO: { bg: "bg-green-50", dot: "bg-green-500" },
    PEDIDO_CANCELADO: { bg: "bg-red-50", dot: "bg-red-500" },
    PEDIDO_FECHADO: { bg: "bg-purple-50", dot: "bg-purple-500" },
    ITEM_ADICIONADO: { bg: "bg-orange-50", dot: "bg-orange-500" },
    ITEM_REMOVIDO: { bg: "bg-amber-50", dot: "bg-amber-500" },
    PEDIDO_REABERTO: { bg: "bg-yellow-50", dot: "bg-yellow-500" },
    STATUS_ALTERADO: { bg: "bg-indigo-50", dot: "bg-indigo-500" },
  };
  
  return cores[tipoOperacao] || { bg: "bg-gray-50", dot: "bg-gray-400" };
}


/**
 * Formata data e hora para exibição
 */
function formatarData(dataISO: string): string {
  try {
    const data = new Date(dataISO);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffMinutos = Math.floor(diffMs / 60000);
    
    // Se for há menos de 1 hora, mostra "há X minutos"
    if (diffMinutos < 60) {
      if (diffMinutos < 1) return "agora";
      return `há ${diffMinutos} min`;
    }
    
    // Se for hoje, mostra hora
    if (data.toDateString() === agora.toDateString()) {
      return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    
    // Caso contrário, mostra data e hora
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dataISO;
  }
}

