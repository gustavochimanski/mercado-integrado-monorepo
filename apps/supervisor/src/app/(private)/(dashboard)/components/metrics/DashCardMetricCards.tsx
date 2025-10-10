// src/components/DashboardMetricCards.tsx
"use client";

import React from "react";
import {
  Card,
  CardTitle,
  CardContent,
} from "@supervisor/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@supervisor/components/ui/popover";
import { Info } from "lucide-react";
import { formatCurrency, formatInt } from "@supervisor/utils/format/formatNumber";
import { Table, TableBody, TableCell, TableRow } from "@supervisor/components/ui/table";
import {
  getProgressBar,
  getProgressValue,
} from "@supervisor/utils/progress/getProgressColor";
import { TypeDashboardResponse } from "../../types/typeDashboard";

type Props = { data: TypeDashboardResponse };

type Subvalor = {
  label: string;
  value1: string | number | React.ReactNode;
  value2?: React.ReactNode;
};

type CardProps = {
  label: string;
  value?: string | number;
  barra?: React.ReactNode;
  explicacao: string;
  subvalores?: Subvalor[];
};

const DashboardMetricCards = ({ data }: Props) => {
  const total = data.total_geral;
  const metas = data.metas;
  const compras = data.compras;
  const relacao = data.relacao

  const metaVendaValor = getProgressValue(metas.total_geral, "metaVenda");
  const limiteCompraValor = getProgressValue(metas.total_geral, "limiteCompra");
  const metaMargemValor = getProgressValue(metas.total_geral, "metaMargem");

  const progressoMetaVenda = metaVendaValor > 0 ? total.total_vendas / metaVendaValor : 0;
  const progressoMetaCompra = limiteCompraValor > 0 ? compras.total_geral / limiteCompraValor : 0;
  const progressoRelacao = metaMargemValor > 0 ? relacao.relacaoPorcentagem / metaMargemValor : 0;

  const cards: CardProps[] = [
    {
      label: "Total de Vendas",
      value: formatCurrency(total.total_vendas),
      barra: getProgressBar(progressoMetaVenda, `Meta: ${formatCurrency(metaVendaValor)}`),
      explicacao: "Soma total das vendas realizadas em relação à meta.",

    },
    {
      label: "Total de Compras",
      value: formatCurrency(compras.total_geral),
      barra: getProgressBar(progressoMetaCompra, `Limite: ${formatCurrency(limiteCompraValor)}`, true),
      explicacao: "Valor total gasto com compras no período em relação ao limite permitido.",

    },
    {
      label: "Lucro Bruto",
      value: formatCurrency(relacao.relacaoValue),
      explicacao: `Relação entre Venda e Compra. Meta de margem: ${metaMargemValor.toFixed(2)}%`,
      barra: getProgressBar(
        progressoRelacao,
        `Meta: ${metaMargemValor.toFixed(2)}% | Real: ${relacao.relacaoPorcentagem.toFixed(2)}%`,
        false,
        true
      ),

    },    
    {
      label: "Cupons",
      explicacao: "Quantidade de cupons emitidos e o ticket médio (valor médio por cupom).",
      subvalores: [
        { label: "Quantidade", value1: formatInt(total.total_cupons) },
        { label: "Ticket Médio", value1: formatCurrency(total.ticket_medio) },
        { label: "Ticket Máximo", value1: 649.99 },
      ],

    },
    {
      label: "Pdvs",
      explicacao:
        "⚠️ Atenção: Se algum PDV estiver offline, as vendas registradas nele não serão enviadas para o sistema até que a conexão seja restabelecida.",
      subvalores: [
        {
          label: "Conectado",
          value1: 25,
          value2: <span className="inline-block w-3 h-3 rounded-full bg-green-700" />,
        },
        {
          label: "Operando",
          value1: 15,
          value2: <span className="inline-block w-3 h-3 rounded-full bg-indigo-700" />,
        },
        {
          label: "Offline",
          value1: 2,
          value2: <span className="inline-block w-3 h-3 rounded-full bg-red-700" />,
        },
      ],

    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 flex-1">
      {cards.map((item, index) => (
        <Card key={index} className="relative overflow-hidden p-2 gap-1">
          <div className={`absolute top-0 left-0 w-full h-1 `} />
          <div className="flex items-center justify-between pr-2">
            <CardTitle className="text-base font-semibold">{item.label}</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
              </PopoverTrigger>
              <PopoverContent side="top" className="text-sm w-64">
                {item.explicacao || "Sem descrição disponível"}
              </PopoverContent>
            </Popover>
          </div>
          <CardContent>
            {item.subvalores ? (
              <Table>
                <TableBody>
                  {item.subvalores.map((sub, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium p-1">{sub.label}</TableCell>
                      <TableCell className="p-1 text-right">{sub.value1}</TableCell>
                      <TableCell className="p-1 text-right">{sub.value2}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <>
                <p className="text-xl font-semibold">{item.value}</p>
                {item.barra && item.barra}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetricCards;
