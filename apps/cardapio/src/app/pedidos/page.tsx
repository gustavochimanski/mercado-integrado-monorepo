"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@cardapio/components/Shared/ui/accordion";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Badge } from "@cardapio/components/Shared/ui/badge";
import { format, isToday, isYesterday, subDays, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pedido, AdicionalPedido, ComplementoPedido } from "@cardapio/types/pedido";
import { usePedidos } from "@cardapio/services/pedidos/useQueryPedido";
import { 
  Pencil, 
  CircleArrowLeft, 
  Clock, 
  User, 
  MapPin, 
  Package, 
  CreditCard,
  ChevronDown,
  Loader2,
  Truck,
  UtensilsCrossed,
  Coffee
} from "lucide-react";
import ModalEditarPedido from "@cardapio/components/Shared/pedidos/ModalEditarPedido";
import { getTipoPedido, getTipoPedidoBadge } from "@cardapio/utils/pedidoHelpers";
import { getStatusConfig, normalizeStatus } from "@cardapio/utils/statusHelpers";

function getDateGroupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Hoje";
  if (isYesterday(date)) return "Ontem";
  if (date > subDays(new Date(), 7)) return "Esta semana";
  if (date > subWeeks(new Date(), 4)) return "Mês passado";
  return "Mais antigos";
}

function groupOrdersByDate(orders: Pedido[]) {
  const groups = new Map<string, Pedido[]>();
  for (const order of orders) {
    const label = getDateGroupLabel(order.data_criacao);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(order);
  }
  return groups;
}

function sortGroups(groups: Map<string, Pedido[]>) {
  const order = ["Hoje", "Ontem", "Esta semana", "Mês passado", "Mais antigos"];
  return [...groups.entries()].sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
}

export default function RoutePedidos() {
  const { data: pedidos = [], isLoading } = usePedidos();
  const [pedidoEdicao, setPedidoEdicao] = useState<Pedido | null>(null);
  const [modalEdicaoOpen, setModalEdicaoOpen] = useState(false);

  const handleEditarPedido = (pedido: Pedido) => {
    setPedidoEdicao(pedido);
    setModalEdicaoOpen(true);
  };

  const handleCloseModal = () => {
    setModalEdicaoOpen(false);
    setPedidoEdicao(null);
  };

  const groupedOrders = groupOrdersByDate(pedidos);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Carregando pedidos...</p>
          </div>
        ) : groupedOrders.size === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-12 w-12 text-primary/40 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Seus pedidos aparecerão aqui quando você fizer um novo pedido.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortGroups(groupedOrders).map(([group, orders]) => (
              <div key={group} className="space-y-3">
                {/* Título do grupo - minimalista */}
                <div className="flex items-center gap-3 px-1">
                  <h2 className="text-sm font-semibold text-primary tracking-tight">
                    {group}
                  </h2>
                  <div className="flex-1 h-px bg-primary/30"></div>
                  <span className="text-xs text-muted-foreground">
                    {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
                  </span>
                </div>

                {/* Lista de pedidos */}
                <div className="space-y-3">
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {orders.map((order) => {
                      const date = order.data_criacao ? new Date(order.data_criacao) : null;
                      const formattedDate = date
                        ? isToday(date)
                          ? format(date, "HH:mm", { locale: ptBR })
                          : isYesterday(date)
                            ? `Ontem ${format(date, "HH:mm", { locale: ptBR })}`
                            : format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })
                        : "Data indisponível";
                      
                      const tipoPedido = order.tipo_pedido ?? getTipoPedido(order);
                      const normalizedStatus = normalizeStatus(order.status);
                      const statusInfo = getStatusConfig(normalizedStatus);
                      const tipoBadge = getTipoPedidoBadge(tipoPedido);
                      const displayId = order.numero_pedido ?? String(order.id);

                      return (
                        <AccordionItem 
                          key={`${order.tipo_pedido ?? ""}-${order.id}`} 
                          value={String(order.id)} 
                          className={`border rounded-lg overflow-hidden hover:shadow-sm transition-all ${
                            tipoPedido === "DELIVERY" 
                              ? "border-blue-200/50 bg-blue-50/30 hover:bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-800/30"
                              : tipoPedido === "MESA"
                              ? "border-green-200/50 bg-green-50/30 hover:bg-green-50/50 dark:bg-green-950/10 dark:border-green-800/30"
                              : "border-purple-200/50 bg-purple-50/30 hover:bg-purple-50/50 dark:bg-purple-950/10 dark:border-purple-800/30"
                          }`}
                        >
                          {/* Header do pedido - sempre visível */}
                          <div className="px-4 py-3.5">
                            <div className="flex items-start justify-between gap-4">
                              {/* Informações principais */}
                              <div className="flex-1 min-w-0 space-y-2.5">
                                {/* Primeira linha: ID, Tipo e Status */}
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm font-medium text-primary">
                                    {displayId}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={`${tipoBadge.className} text-xs font-medium border`}
                                  >
                                    {tipoBadge.label}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={`${statusInfo.className} text-xs font-medium border`}
                                  >
                                    {statusInfo.label}
                                  </Badge>
                                </div>

                                {/* Segunda linha: Data e Cliente */}
                                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                    <span>{formattedDate}</span>
                                    <span>•</span>
                                    <Package className="h-3.5 w-3.5 text-primary" />
                                    <span>
                                      {Array.isArray(order.itens) ? order.itens.length : 0}{" "}
                                      {Array.isArray(order.itens) && order.itens.length === 1 ? "item" : "itens"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                    <span className="truncate">{order.cliente_nome}</span>
                                  </div>
                                </div>

                                {/* Valor total - destacado */}
                                <div className="pt-1">
                                  <span className="text-base font-semibold text-primary">
                                    R$ {order.valor_total.toFixed(2).replace('.', ',')}
                                  </span>
                                </div>
                              </div>

                              {/* Botões de ação */}
                              <div className="flex items-start gap-2 shrink-0">
                                {(tipoPedido === "DELIVERY") && (order.status === "P" || order.status === "I" || order.status === "R") && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditarPedido(order);
                                    }}
                                    className="h-8 w-8 p-0"
                                    title="Editar pedido"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Trigger para expandir */}
                          <AccordionTrigger className="px-4 py-2.5 border-t border-primary/20 hover:bg-primary/10 transition-colors">
                            <span className="text-xs text-primary/70 flex items-center gap-1.5">
                              <ChevronDown className="h-3.5 w-3.5" />
                              Ver detalhes
                            </span>
                          </AccordionTrigger>

                          {/* Conteúdo expandido */}
                          <AccordionContent className="px-4 py-4 border-t border-primary/20 bg-primary/6">
                            <div className="space-y-4">
                              {/* Endereço - apenas para Delivery */}
                              {tipoPedido === "DELIVERY" && order.endereco_snapshot && (
                                <div className="flex gap-2 text-sm">
                                  <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <span className="font-medium text-primary block mb-0.5">
                                      Endereço de Entrega
                                    </span>
                                    <span className="text-muted-foreground">
                                      {order.endereco_snapshot.logradouro}, {order.endereco_snapshot.numero}
                                      {order.endereco_snapshot.complemento && ` - ${order.endereco_snapshot.complemento}`}
                                      <br />
                                      {order.endereco_snapshot.bairro}, {order.endereco_snapshot.cidade}/{order.endereco_snapshot.estado}
                                    </span>
                                    {order.previsao_entrega && !Number.isNaN(new Date(order.previsao_entrega).getTime()) && (
                                      <div className="mt-1 text-xs text-primary/70">
                                        Previsão: {format(new Date(order.previsao_entrega), "HH:mm", { locale: ptBR })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Informação de Mesa - apenas para Mesa */}
                              {tipoPedido === "MESA" && order.observacao_geral && (
                                <div className="flex gap-2 text-sm">
                                  <UtensilsCrossed className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <span className="font-medium text-primary block mb-0.5">
                                      Mesa
                                    </span>
                                    <span className="text-muted-foreground">
                                      {order.observacao_geral.includes("Mesa-") 
                                        ? order.observacao_geral.split("Mesa-")[1]?.split(" ")[0] || "Não especificada"
                                        : "Não especificada"}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Informação de Balcão - apenas para Balcão */}
                              {tipoPedido === "BALCAO" && (
                                <div className="flex gap-2 text-sm">
                                  <Coffee className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <span className="font-medium text-primary block mb-0.5">
                                      Pedido de Balcão
                                    </span>
                                    <span className="text-muted-foreground">
                                      Pedido para retirada no balcão
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Observações gerais (se houver e não for info de tipo) */}
                              {order.observacao_geral && 
                               !order.observacao_geral.includes("Pedido de mesa") && 
                               !order.observacao_geral.includes("Pedido de balcão") && 
                               !order.observacao_geral.includes("BAL-") && (
                                <div className="flex gap-2 text-sm">
                                  <Package className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <span className="font-medium text-primary block mb-0.5">
                                      Observações
                                    </span>
                                    <span className="text-muted-foreground">
                                      {order.observacao_geral}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Itens */}
                              <div className="space-y-1">
                                <h4 className="text-sm font-medium text-primary mb-2">Itens</h4>
                                <ul className="space-y-2.5">
                                  {(() => {
                                    // Se produtos existe e tem conteúdo, usar produtos diretamente (para MESA e BALCÃO)
                                    // Para DELIVERY, order.itens geralmente tem conteúdo e usamos a lógica de correspondência
                                    const temProdutos = order.produtos && (
                                      (order.produtos.itens && order.produtos.itens.length > 0) ||
                                      (order.produtos.receitas && order.produtos.receitas.length > 0) ||
                                      (order.produtos.combos && order.produtos.combos.length > 0)
                                    );
                                    const usarProdutosDiretamente = temProdutos && (order.itens.length === 0 || tipoPedido === "MESA" || tipoPedido === "BALCAO");

                                    if (usarProdutosDiretamente && order.produtos) {
                                      // Renderizar diretamente de produtos (para MESA e BALCÃO)
                                      const todosItens: Array<{
                                        id: number | string;
                                        tipo: 'item' | 'receita' | 'combo';
                                        descricao: string;
                                        quantidade: number;
                                        preco_unitario: number;
                                        observacao?: string | null;
                                        complementos?: any[];
                                      }> = [];

                                      // Adicionar itens de produtos
                                      if (order.produtos.itens) {
                                        order.produtos.itens.forEach((item) => {
                                          todosItens.push({
                                            id: item.item_id,
                                            tipo: 'item',
                                            descricao: item.descricao,
                                            quantidade: item.quantidade,
                                            preco_unitario: item.preco_unitario,
                                            observacao: item.observacao,
                                            complementos: item.complementos,
                                          });
                                        });
                                      }

                                      // Adicionar receitas de produtos
                                      if (order.produtos.receitas) {
                                        order.produtos.receitas.forEach((receita) => {
                                          todosItens.push({
                                            id: receita.item_id || receita.receita_id,
                                            tipo: 'receita',
                                            descricao: receita.nome,
                                            quantidade: receita.quantidade,
                                            preco_unitario: receita.preco_unitario,
                                            observacao: receita.observacao,
                                            complementos: receita.complementos,
                                          });
                                        });
                                      }

                                      // Adicionar combos de produtos
                                      if (order.produtos.combos) {
                                        order.produtos.combos.forEach((combo) => {
                                          todosItens.push({
                                            id: combo.combo_id,
                                            tipo: 'combo',
                                            descricao: combo.nome,
                                            quantidade: combo.quantidade,
                                            preco_unitario: combo.preco_unitario,
                                            observacao: combo.observacao,
                                            complementos: combo.complementos,
                                          });
                                        });
                                      }

                                      return todosItens.map((item) => (
                                        <li key={`${item.tipo}-${item.id}`} className="flex gap-3 text-sm">
                                          <span className="text-muted-foreground font-medium shrink-0 min-w-[2rem]">
                                            {item.quantidade}×
                                          </span>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-foreground font-medium">
                                              {item.descricao}
                                            </p>
                                            {item.observacao && (
                                              <p className="text-xs text-muted-foreground italic mt-0.5">
                                                {item.observacao}
                                              </p>
                                            )}
                                            
                                            {/* Exibir adicionais/complementos */}
                                            {item.complementos && item.complementos.length > 0 && (
                                              <div className="mt-2 space-y-1.5">
                                                {item.complementos.map((complemento: ComplementoPedido) => (
                                                  <div key={complemento.complemento_id} className="pl-2 border-l-2 border-primary/20">
                                                    {complemento.adicionais && complemento.adicionais.length > 0 && (
                                                      <div className="space-y-0.5">
                                                        {complemento.adicionais.map((adicional: AdicionalPedido) => (
                                                          <p key={adicional.adicional_id} className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <span className="text-primary font-medium">+</span>
                                                            <span>{adicional.nome}</span>
                                                            {adicional.quantidade > 1 && (
                                                              <span className="text-primary/70">×{adicional.quantidade}</span>
                                                            )}
                                                            {adicional.preco_unitario > 0 && (
                                                              <span className="ml-auto text-primary/80">R$ {adicional.total.toFixed(2).replace('.', ',')}</span>
                                                            )}
                                                          </p>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                          <span className="text-muted-foreground font-medium shrink-0">
                                            R$ {(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}
                                          </span>
                                        </li>
                                      ));
                                    }

                                    // Lógica original para DELIVERY (usa order.itens e busca em order.produtos)
                                    return order.itens.map((item) => {
                                      // Buscar item (produto com código de barras) correspondente se houver produtos
                                      const itemProdutoCorrespondente = item.produto_cod_barras 
                                        ? order.produtos?.itens?.find(
                                            (i) => i.item_id === item.id && i.produto_cod_barras === item.produto_cod_barras
                                          )
                                        : null;

                                      // Buscar receita correspondente se houver produtos
                                      const receitaCorrespondente = order.produtos?.receitas?.find(
                                        (r) => r.item_id === item.id
                                      );

                                      // Buscar combo correspondente se houver produtos
                                      // Tenta encontrar combo pela observação, descrição e preço
                                      const combosDisponiveis = order.produtos?.combos || [];
                                      let comboCorrespondente = combosDisponiveis.find((c) => {
                                        // Se a observação do item menciona o combo (ex: "Combo #1")
                                        const observacaoMatch = item.observacao && c.combo_id && 
                                          item.observacao.match(/Combo\s*#(\d+)/i) &&
                                          Number(item.observacao.match(/Combo\s*#(\d+)/i)?.[1]) === c.combo_id;
                                        
                                        // Se a descrição corresponde ao nome do combo
                                        const nomeMatch = item.produto_descricao_snapshot && c.nome &&
                                          item.produto_descricao_snapshot.trim() === c.nome.trim();
                                        
                                        // Se o preço corresponde (para distinguir múltiplos combos do mesmo tipo)
                                        const precoMatch = Math.abs((item.preco_unitario || 0) - (c.preco_unitario || 0)) < 0.01;
                                        
                                        return (observacaoMatch || nomeMatch) && precoMatch;
                                      });

                                      return (
                                        <li key={item.id} className="flex gap-3 text-sm">
                                          <span className="text-muted-foreground font-medium shrink-0 min-w-[2rem]">
                                            {item.quantidade}×
                                          </span>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-foreground font-medium">
                                              {item.produto_descricao_snapshot}
                                            </p>
                                            {item.observacao && (
                                              <p className="text-xs text-muted-foreground italic mt-0.5">
                                                {item.observacao}
                                              </p>
                                            )}
                                            
                                            {/* Exibir adicionais/complementos de itens (produtos com código de barras) */}
                                            {itemProdutoCorrespondente && itemProdutoCorrespondente.complementos && itemProdutoCorrespondente.complementos.length > 0 && (
                                              <div className="mt-2 space-y-1.5">
                                                {itemProdutoCorrespondente.complementos.map((complemento: ComplementoPedido) => (
                                                  <div key={complemento.complemento_id} className="pl-2 border-l-2 border-primary/20">
                                                    {complemento.adicionais && complemento.adicionais.length > 0 && (
                                                      <div className="space-y-0.5">
                                                        {complemento.adicionais.map((adicional: AdicionalPedido) => (
                                                          <p key={adicional.adicional_id} className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <span className="text-primary font-medium">+</span>
                                                            <span>{adicional.nome}</span>
                                                            {adicional.quantidade > 1 && (
                                                              <span className="text-primary/70">×{adicional.quantidade}</span>
                                                            )}
                                                            {adicional.preco_unitario > 0 && (
                                                              <span className="ml-auto text-primary/80">R$ {adicional.total.toFixed(2).replace('.', ',')}</span>
                                                            )}
                                                          </p>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                            {/* Exibir adicionais/complementos de receitas */}
                                            {receitaCorrespondente && receitaCorrespondente.complementos && receitaCorrespondente.complementos.length > 0 && (
                                              <div className="mt-2 space-y-1.5">
                                                {receitaCorrespondente.complementos.map((complemento: ComplementoPedido) => (
                                                  <div key={complemento.complemento_id} className="pl-2 border-l-2 border-primary/20">
                                                    {complemento.adicionais && complemento.adicionais.length > 0 && (
                                                      <div className="space-y-0.5">
                                                        {complemento.adicionais.map((adicional: AdicionalPedido) => (
                                                          <p key={adicional.adicional_id} className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <span className="text-primary font-medium">+</span>
                                                            <span>{adicional.nome}</span>
                                                            {adicional.quantidade > 1 && (
                                                              <span className="text-primary/70">×{adicional.quantidade}</span>
                                                            )}
                                                            {adicional.preco_unitario > 0 && (
                                                              <span className="ml-auto text-primary/80">R$ {adicional.total.toFixed(2).replace('.', ',')}</span>
                                                            )}
                                                          </p>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                            {/* Exibir adicionais/complementos de combos */}
                                            {comboCorrespondente && comboCorrespondente.complementos && comboCorrespondente.complementos.length > 0 && (
                                              <div className="mt-2 space-y-1.5">
                                                {comboCorrespondente.complementos.map((complemento: ComplementoPedido) => (
                                                  <div key={complemento.complemento_id} className="pl-2 border-l-2 border-primary/20">
                                                    {complemento.adicionais && complemento.adicionais.length > 0 && (
                                                      <div className="space-y-0.5">
                                                        {complemento.adicionais.map((adicional: AdicionalPedido) => (
                                                          <p key={adicional.adicional_id} className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <span className="text-primary font-medium">+</span>
                                                            <span>{adicional.nome}</span>
                                                            {adicional.quantidade > 1 && (
                                                              <span className="text-primary/70">×{adicional.quantidade}</span>
                                                            )}
                                                            {adicional.preco_unitario > 0 && (
                                                              <span className="ml-auto text-primary/80">R$ {adicional.total.toFixed(2).replace('.', ',')}</span>
                                                            )}
                                                          </p>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                          <span className="text-muted-foreground font-medium shrink-0">
                                            R$ {(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}
                                          </span>
                                        </li>
                                      );
                                    });
                                  })()}
                                </ul>
                              </div>

                              {/* Divider */}
                              <div className="h-px bg-primary/30"></div>

                              {/* Totais detalhados */}
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span className="font-medium">R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
                                </div>
                                {order.desconto > 0 && (
                                  <div className="flex justify-between text-primary">
                                    <span>Desconto</span>
                                    <span className="font-medium">- R$ {order.desconto.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                )}
                                
                                {/* Taxa de entrega - apenas para Delivery */}
                                {tipoPedido === "DELIVERY" && order.taxa_entrega > 0 && (
                                  <div className="flex justify-between">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <Truck className="h-3.5 w-3.5" />
                                      <span>Taxa de entrega</span>
                                    </div>
                                    <span className="font-medium">R$ {order.taxa_entrega.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                )}

                                {/* Taxa de serviço - mostrar apenas se > 0 */}
                                {order.taxa_servico > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Taxa de serviço</span>
                                    <span className="font-medium">R$ {order.taxa_servico.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                )}

                                {/* Forma de pagamento */}
                                <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Pagamento</span>
                                  </div>
                                  <span className="font-medium text-primary">
                                    {order.meio_pagamento_nome || "Não informado"}
                                  </span>
                                </div>
                                {order.meio_pagamento_nome === "Dinheiro" && order.troco_para && order.troco_para > 0 && (
                                  <div className="flex justify-between text-primary">
                                    <span>Troco para</span>
                                    <span className="font-medium">R$ {order.troco_para.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Edição */}
        <ModalEditarPedido
          pedido={pedidoEdicao}
          isOpen={modalEdicaoOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
