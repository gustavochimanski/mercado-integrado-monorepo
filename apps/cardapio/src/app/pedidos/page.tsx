"use client";
import React from "react";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@cardapio/components/Shared/ui/card";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from "@cardapio/components/Shared/ui/accordion";
import { Button } from "@cardapio/components/Shared/ui/button";
import { CircleX, SquarePen } from "lucide-react";
import { format, isToday, isYesterday, subDays, subWeeks, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import mockPedidosJson from "./mock.json"

type OrderStatus = "P" | "A" | "R" | "E";
// "Pendente" | "Preparando" | "Em rota" | "Entregue";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  empresa: number;
  date: string;
  items: OrderItem[];
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  address: string;
  paymentMethod: string;
  estimatedTimeStart: number;  // início da estimativa
  estimatedTimeEnd: number;    // fim da estimativa
}

const statusClasses: Record<OrderStatus, string> = {
  P: "bg-yellow-100 text-yellow-800",
  R: "bg-blue-100 text-blue-800",
  A: "bg-purple-100 text-purple-800",
  E: "bg-green-100 text-green-800",
};

const statusLabels: Record<OrderStatus, string> = {
  P: "Pendente", A: "Em preparo", R: "Saiu para entrega", E: "Entregue",
};

function getDateGroupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Hoje";
  if (isYesterday(date)) return "Ontem";
  if (date > subDays(new Date(), 7)) return "Esta semana";
  if (date > subWeeks(new Date(), 4)) return "Mês passado";
  return "Mais antigos";
}

function sortGroups(groups: Map<string, Order[]>) {
  const order = ["Hoje", "Ontem", "Esta semana", "Mês passado", "Mais antigos"];
  return [...groups.entries()].sort(
    ([a], [b]) => order.indexOf(a) - order.indexOf(b)
  );
}


function groupOrdersByDate(orders: Order[]) {
  const groups = new Map<string, Order[]>();
  for (const order of orders) {
    const label = getDateGroupLabel(order.date);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(order);
  }
  return groups;
}

const RoutePedidos = () => {
  const mockPedidos: Order[] = mockPedidosJson.map((pedido) => ({
  ...pedido,
  status: pedido.status as OrderStatus,
}));
  const groupedOrders = groupOrdersByDate(mockPedidos);

  return (
    <div className="min-h-screen flex flex-col gap-6 p-6">
      {sortGroups(groupedOrders).map(([group, orders]) => (
        <Card key={group} className="w-full p-0 gap-0 ">
          <CardHeader className="p-2 bg-muted h-10 items-center ">
            <CardTitle >{group}</CardTitle>
          </CardHeader>

          <CardContent className="p-0 ">
            <Accordion type="single" collapsible className="w-full">
              {orders.map((order) => {
                const date = new Date(order.date);
                const formattedDate = isToday(date)
                  ? "Hoje"
                  : format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });

                return (
                  <AccordionItem key={order.id} value={order.id}>
                    <AccordionTrigger className="flex justify-between items-center px-4">
                      <div className="flex flex-col gap-2 text-left flex-1">
                        <span className="font-semibold text-foreground">Pedido #{order.id}</span>
                        <span className="text-xs text-muted-foreground">
                          {formattedDate} • {order.paymentMethod} • {order.address.split(",")[0]}
                        </span>
                      </div>

                      <div className="flex gap-2 items-start flex-col mt-1 mb-3">
                        <span className="text-sm font-bold text-foreground">
                          R$ {order.total.toFixed(2)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusClasses[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t p-3">
                      <ul className="divide-y divide-muted [&>li:nth-child(even)]:bg-muted">
                        {order.items.map((item) => (
                          <li key={item.id} className="p-2 flex items-center gap-4 rounded">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{item.name}</p>
                              {item.notes && (
                                <p className="text-xs text-muted-foreground">{item.notes}</p>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground text-right">
                              {item.quantity} × R$ {item.price.toFixed(2)}
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 space-y-1 text-sm text-foreground">
                        <div className="flex justify-between">
                          <span>Taxa de entrega</span>
                          <span>R$ {order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-600">
                          <span>Total</span>
                          <span>R$ {order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1 text-sm text-foreground">
                        <p><strong>Endereço:</strong> {order.address}</p>
                        <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
                        <p><strong>Estimativa:</strong>{" "}
                          {order.status === "E"
                            ? <span className="text-emerald-700 font-semibold">Entregue</span>
                            : <span>{order.estimatedTimeStart}–{order.estimatedTimeEnd} minutos</span>
                          }
                        </p>

                        {order.status === "A" && (
                          <div className="pt-4 flex justify-between">
                            <Button onClick={() => alert(`Cancelar Pedido #${order.id}`)} variant={"destructive"}>
                              <CircleX /> Cancelar
                            </Button>
                            <Button onClick={() => alert(`Editar pedido #${order.id}`)} variant={"default"}>
                              <SquarePen /> Editar Pedido
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoutePedidos;