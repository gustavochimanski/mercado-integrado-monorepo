// import { PedidoKanban } from "@supervisor/types/pedido";
// import React from "react";
// import { statusMap } from "./Kanban";
// import TempoPedidoBadge from "./TempoPedidoBadge";
// import { Checkbox } from "@supervisor/components/ui/checkbox";
// import { isToday, parseISO } from "date-fns";
// import { Button } from "@supervisor/components/ui/button";
// import { ChevronRight, CircleArrowRight, Eye, Printer } from "lucide-react";

// export const PedidoCard = React.memo(
//   ({
//     pedido,
//     selecionado,
//     onToggleSelecionado,
//     selectedDate, // <- adicionamos aqui
//   }: {
//     pedido: PedidoKanban;
//     selecionado: boolean;
//     onToggleSelecionado: (id: number) => void;
//     selectedDate: string; // formato "yyyy-MM-dd"
//   }) => {
//     const mostrarTempoBadge =
//       pedido.status !== "C" &&
//       pedido.status !== "E" &&
//       isToday(parseISO(selectedDate));

//     return (
//       <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col gap-2 text-sm">
//         {/* Header */}
//         <div className="flex items-center gap-2">
//           <Checkbox
//             checked={selecionado}
//             onCheckedChange={() => onToggleSelecionado(pedido.id)}
//           />
//           <div className="flex justify-between w-full">
//             <div className="flex gap-2">
//               <p className="font-semibold text-primary ">#{pedido.id}</p>
//               <p className="text-muted-foreground">{pedido.nome_cliente || "—"}</p>
//             </div>
//             <div className="flex mt-auto gap-2">
//               {mostrarTempoBadge && (
//                 <TempoPedidoBadge
//                   dataCriacao={pedido.data_criacao}
//                   limiteMinutos={30}
//                   />
//                 )}
//             </div>
//           </div>
//         </div>

//         {/* Informações do cliente */}
//         <div className="text-sm text-muted-foreground flex flex-col gap-1">
//           <span>
//             <strong>Telefone:</strong> {pedido.telefone_cliente || "—"}
//           </span>
//           {pedido.endereco_cliente && (
//             <span>
//               <strong>Endereço:</strong> {pedido.endereco_cliente}
//             </span>
//           )}
//           <span>
//             <strong>Meio de Pagamento:</strong>{" "}
//             {pedido.meio_pagamento_descricao || "—"}
//           </span>
//         </div>

//         {/* Valor total */}
//         <div className=" flex justify-between font-bold text-foreground">
//           R$ {pedido.valor_total.toFixed(2)}
//           <div className="flex gap-1">
//             <button className="bg-primary/20 text-primary rounded-full d px-2">
//               <Eye size={15} />
//             </button>
//             <button className="bg-primary/20 text-primary rounded-full px-2">
//               <Printer size={15} />
//             </button>
//             <button className="bg-primary/20 text-primary rounded-full px-2">
//               <ChevronRight size={15} />
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// PedidoCard.displayName = "PedidoCard";




"use client"

import type { PedidoKanban } from "@supervisor/types/pedido"
import React, { useState } from "react"
import TempoPedidoBadge from "./TempoPedidoBadge"
import { PedidoModal } from "./PedidoModal"
import { Checkbox } from "@supervisor/components/ui/checkbox"
import { isToday, parseISO } from "date-fns"
import { ChevronRight, Eye, Printer } from "lucide-react"

export const PedidoCard = React.memo(
  ({
    pedido,
    selecionado,
    onToggleSelecionado,
    selectedDate,
  }: {
    pedido: PedidoKanban
    selecionado: boolean
    onToggleSelecionado: (id: number) => void
    selectedDate: string
  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const mostrarTempoBadge = pedido.status !== "C" && pedido.status !== "E" && isToday(parseISO(selectedDate))

    return (
      <>
        <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col gap-2 text-sm">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Checkbox checked={selecionado} onCheckedChange={() => onToggleSelecionado(pedido.id)} />
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <p className="font-semibold text-primary ">#{pedido.id}</p>
                <p className="text-muted-foreground">{pedido.nome_cliente || "—"}</p>
              </div>
              <div className="flex mt-auto gap-2">
                {mostrarTempoBadge && <TempoPedidoBadge dataCriacao={pedido.data_criacao} limiteMinutos={30} />}
              </div>
            </div>
          </div>

          {/* Informações do cliente */}
          <div className="text-sm text-muted-foreground flex flex-col gap-1">
            <span>
              <strong>Telefone:</strong> {pedido.telefone_cliente || "—"}
            </span>
            {pedido.endereco_cliente && (
              <span>
                <strong>Endereço:</strong> {pedido.endereco_cliente}
              </span>
            )}
            <span>
              <strong>Meio de Pagamento:</strong> {pedido.meio_pagamento_descricao || "—"}
            </span>
            {(pedido.status === "S" || pedido.status === "E") && pedido.motoboy && (
              <span>
                <strong>Motoboy:</strong> {pedido.motoboy}
              </span>
            )}
          </div>

          {/* Valor total */}
          <div className="flex justify-between font-bold text-foreground">
            R$ {pedido.valor_total.toFixed(2)}
            <div className="flex gap-1">
              <button
                className="bg-primary/20 text-primary rounded-full px-2 hover:bg-primary/30 transition-colors"
                onClick={() => setIsModalOpen(true)}
                title="Visualizar pedido"
              >
                <Eye size={15} />
              </button>
              <button className="bg-primary/20 text-primary rounded-full px-2 hover:bg-primary/30 transition-colors">
                <Printer size={15} />
              </button>
              <button className="bg-primary/20 text-primary rounded-full px-2 hover:bg-primary/30 transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <PedidoModal pedido={pedido} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  },
)

PedidoCard.displayName = "PedidoCard"

