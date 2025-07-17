"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@cardapio/components/Shared/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@cardapio/components/Shared/ui/accordion";

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

const mockOrders: Order[] = [
  {
    id: "0001",
    empresa: 1,
    date: "2025-07-15 12:34",
    items: [
      { id: 1, name: "Whopper Duplo", quantity: 1, price: 28.9 },
      { id: 2, name: "Batata Média",   quantity: 1, price: 12.5, notes: "Sem sal" },
    ],
    deliveryFee: 5,
    total: 46.4,
    status: "P",
    address: "Av. Paulista, 1000, São Paulo, SP",
    paymentMethod: "Cartão de Crédito",
    estimatedTimeStart: 30,
    estimatedTimeEnd:   40,
  },
  {
    id: "0002",
    empresa: 1,
    date: "2025-07-16 14:20",
    items: [
      { id: 1, name: "Pizza Grande Calabresa", quantity: 1, price: 54.99 },
      { id: 2, name: "Refrigerante 2L",       quantity: 1, price: 12.0 },
    ],
    deliveryFee: 7,
    total: 73.99,
    status: "A",
    address: "Rua Oscar Freire, 200, São Paulo, SP",
    paymentMethod: "Dinheiro",
    estimatedTimeStart: 25,
    estimatedTimeEnd:   35,
  },
  {
    id: "0003",
    empresa: 1,
    date: "2025-07-17 16:05",
    items: [
      { id: 1, name: "Combinado Especial (20 unidades)", quantity: 1, price: 120.0 },
      { id: 2, name: "Missô Shiru", quantity: 2, price: 8.5 },
      { id: 3, name: "Missô Shiru", quantity: 2, price: 8.5 },
    ],
    deliveryFee: 10,
    total: 164.00,
    status: "E",
    address: "Av. Brigadeiro Faria Lima, 500, São Paulo, SP",
    paymentMethod: "Cartão de Débito",
    estimatedTimeStart: 45,
    estimatedTimeEnd:  55,
  },
];

const statusClasses: Record<OrderStatus, string> = {
  P: "bg-yellow-100 text-yellow-800",
  A: "bg-blue-100 text-blue-800",
  R: "bg-purple-100 text-purple-800",
  E: "bg-green-100 text-green-800",
};

// 2) Novo mapeamento de labels legíveis
const statusLabels: Record<OrderStatus, string> = {
  P: "Pendente",
  A: "Em preparo",
  R: "Em rota",
  E: "Entregue",
};

const RoutePedidos = () => {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Meus Pedidos</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {mockOrders.map((order) => (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger className="flex justify-between items-center px-4 py-3">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">#{order.id}</span>{" "}
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground">
                      R$ {order.total.toFixed(2)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusClasses[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="border-t p-3">
                  {/* Itens do pedido */}
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

                  {/* Resumo de preços */}
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

                  {/* Detalhes adicionais */}
                  <div className="mt-4 space-y-1 text-sm text-foreground">
                    <p>
                      <strong>Endereço:</strong> {order.address}
                    </p>
                    <p>
                      <strong>Pagamento:</strong> {order.paymentMethod}
                    </p>
                    <p>
                      <strong>Estimativa:</strong>{" "}
                      {order.status === "E" ? (
                        <span className="text-emerald-700 font-semibold">Entregue</span>
                      ) : (
                        <span>{order.estimatedTimeStart}–{order.estimatedTimeEnd} minutos</span>
                      )}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutePedidos;