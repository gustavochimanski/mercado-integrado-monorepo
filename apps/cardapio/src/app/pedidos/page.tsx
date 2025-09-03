"use client";

import React from "react";
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
import { format, isToday, isYesterday, subDays, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pedido } from "@cardapio/types/pedido";
import { usePedidos } from "@cardapio/services/useQueryPedido";

const statusClasses: Record<Pedido["status"], string> = {
  P: "bg-yellow-100 text-yellow-600",
  R: "bg-purple-100 text-purple-600",
  S: "bg-blue-100 text-blue-600",
  E: "bg-green-100 text-green-600",
  C: "bg-red-100 text-red-600"
};

const statusLabels: Record<Pedido["status"], string> = {
  P: "Pendente",
  R: "Em preparo",
  E: "Entregue",
  S: "Saiu para Entrega",
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
  const { data: pedidos = [], isLoading } = usePedidos(); // pega todos os pedidos

  const groupedOrders = groupOrdersByDate(pedidos);

  return (
    <div className="min-h-screen flex flex-col gap-6 p-6">
      {isLoading ? (
        <div>Carregando pedidos...</div>
      ) : groupedOrders.size === 0 ? (
        <div>Nenhum pedido encontrado.</div>
      ) : (
        sortGroups(groupedOrders).map(([group, orders]) => (
          <Card key={group} className="w-full p-0 gap-0">
            <CardHeader className="p-4 bg-primary h-12 items-center rounded-t-xl text-background">
              <CardTitle>{group}</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {orders.map((order) => {
                  const date = new Date(order.data_criacao);
                  const formattedDate = isToday(date)
                    ? "Hoje"
                    : format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });

                  return (
                    <AccordionItem key={order.id} value={String(order.id)}>
                      <AccordionTrigger className="flex justify-between items-center px-4">
                        <div className="flex flex-col gap-2 text-left flex-1">
                          <span className="font-semibold text-foreground">Pedido #{order.id}</span>
                          <span className="text-xs text-muted-foreground">
                            {formattedDate} • {order.itens.length} itens
                          </span>
                        </div>

                        <div className="flex gap-2 items-start flex-col mt-1 mb-3">
                          <span className="text-sm font-bold text-foreground">
                            R$ {order.valor_total.toFixed(2)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusClasses[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="border-t p-3">
                        <ul className="divide-y divide-muted [&>li:nth-child(even)]:bg-muted">
                          {order.itens.map((item) => (
                            <li key={item.id} className="p-2 flex items-center gap-4 rounded">
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{item.produto_descricao_snapshot}</p>
                                {item.observacao && <p className="text-xs text-muted-foreground">{item.observacao}</p>}
                              </div>
                              <div className="text-sm text-muted-foreground text-right">
                                {item.quantidade} × R$ {item.preco_unitario.toFixed(2)}
                              </div>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 space-y-1 text-sm text-foreground">
                          <div className="flex justify-between">
                            <span>Taxa de entrega</span>
                            <span>R$ {order.taxa_entrega.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-emerald-600">
                            <span>Total</span>
                            <span>R$ {order.valor_total.toFixed(2)}</span>
                            
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
