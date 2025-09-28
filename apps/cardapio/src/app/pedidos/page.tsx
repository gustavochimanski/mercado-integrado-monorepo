"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@cardapio/components/Shared/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@cardapio/components/Shared/ui/accordion";
import { Button } from "@cardapio/components/Shared/ui/button";
import { format, isToday, isYesterday, subDays, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pedido } from "@cardapio/types/pedido";
import { usePedidos } from "@cardapio/services/useQueryPedido";
import { Pencil, CircleArrowLeft } from "lucide-react";
import ModalEditarPedido from "@cardapio/components/Shared/pedidos/ModalEditarPedido";

const statusClasses: Record<Pedido["status"], string> = {
  I: "bg-gray-100 text-gray-600",
  D: "bg-orange-100 text-orange-600",
  P: "bg-yellow-100 text-yellow-600",
  R: "bg-purple-100 text-purple-600",
  S: "bg-blue-100 text-blue-600",
  E: "bg-green-100 text-green-600",
  C: "bg-red-100 text-red-600"
};

const statusLabels: Record<Pedido["status"], string> = {
  I: "Pendente Impressão",
  D: "Editado",
  P: "Pendente",
  R: "Em preparo",
  S: "Saiu para Entrega",
  E: "Entregue",
  C: "Cancelado"
};

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
  const router = useRouter();
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
      {/* Header com botão voltar */}
      <header className="w-full flex flex-row items-center sticky top-0 z-50 bg-background p-6 pb-4">
        <Button onClick={() => router.push('/')} variant="link" className="mr-auto cursor-pointer p-0">
          <CircleArrowLeft /> Voltar
        </Button>
      </header>

      <div className="h-full flex flex-col gap-6 p-6 pt-0 overflow-auto">
      {isLoading ? (
        <div>Carregando pedidos...</div>
      ) : groupedOrders.size === 0 ? (
        <div>Nenhum pedido encontrado.</div>
      ) : (
        sortGroups(groupedOrders).map(([group, orders]) => (
          <Card key={group} className="w-full flex flex-col p-0 gap-0 rounded-xl shadow">
            {/* Header do card */}
            <CardHeader className="p-4 bg-primary h-12 flex items-center rounded-t-xl text-background">
              <CardTitle>{group}</CardTitle>
            </CardHeader>

            {/* Conteúdo do card com scroll interno */}
            <CardContent className="p-4 space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {orders.map((order) => {
                  const date = new Date(order.data_criacao);
                  const formattedDate = isToday(date)
                    ? "Hoje"
                    : format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });

                  return (
                    <AccordionItem key={order.id} value={String(order.id)} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-white">
                        {/* Header com cliente e botão editar */}
                        <div className="flex justify-between items-center px-4 py-2">
                          <div className="flex flex-col gap-1 text-left flex-1">
                            <span className="text-xs text-muted-foreground">
                              {formattedDate} • {order.itens.length} itens
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Cliente: {order.cliente_nome}
                            </span>
                          </div>
                          {/* Botão Editar - apenas para pedidos que podem ser editados */}
                          {(order.status === "P" || order.status === "I") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarPedido(order)}
                              className="text-xs cursor-pointer"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>

                        {/* Trigger apenas para expandir */}
                        <AccordionTrigger className="flex justify-center items-center px-4 py-2 hover:bg-muted/50 border-t cursor-pointer">
                          <span className="text-sm text-muted-foreground">Ver detalhes</span>
                        </AccordionTrigger>

                        {/* Conteúdo expandido */}
                        <AccordionContent className="border-t p-4 space-y-4">
                          {/* Endereço */}
                          {order.endereco_snapshot && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Entrega em:</span>{" "}
                              {order.endereco_snapshot.logradouro}, {order.endereco_snapshot.numero} -{" "}
                              {order.endereco_snapshot.bairro}, {order.endereco_snapshot.cidade}/
                              {order.endereco_snapshot.estado}
                            </div>
                          )}

                          {/* Itens */}
                          <ul className="divide-y divide-muted">
                            {order.itens.map((item) => (
                              <li key={item.id} className="py-2 flex justify-between items-center">
                                <div className="flex-1">
                                  <p className="font-medium text-foreground">
                                    {item.produto_descricao_snapshot}
                                  </p>
                                  {item.observacao && (
                                    <p className="text-xs text-muted-foreground italic">
                                      {item.observacao}
                                    </p>
                                  )}
                                </div>
                                <div className="text-sm text-right min-w-[80px]">
                                  <span className="block">{item.quantidade}×</span>
                                  <span className="text-muted-foreground">
                                    R$ {item.preco_unitario.toFixed(2)}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>

                          {/* Totais detalhados */}
                          <div className="pt-3 border-t text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>R$ {order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.desconto > 0 && (
                              <div className="flex justify-between text-red-600">
                                <span>Desconto</span>
                                <span>- R$ {order.desconto.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Taxa de entrega</span>
                              <span>R$ {order.taxa_entrega.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxa de serviço</span>
                              <span>R$ {order.taxa_servico.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pagamento</span>
                              <span>{order.meio_pagamento_nome}</span>
                            </div>
                          </div>
                        </AccordionContent>

                        {/* Rodapé fixo fora do collapse */}
                        <div className="flex justify-between items-center px-4 py-3 bg-muted">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              Pedido #{order.id}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[order.status]}`}
                            >
                              {statusLabels[order.status] ?? order.status}
                            </span>
                          </div>
                          <span className="font-bold text-lg text-emerald-600">
                            Total: R$ {order.valor_total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        ))
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
