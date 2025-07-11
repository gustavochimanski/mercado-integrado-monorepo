// src/components/metrics/CompanyMetricCards.tsx
"use client";

import React from "react";
import { Card, CardTitle, CardContent } from "@supervisor/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@supervisor/components/ui/popover";
import { Info } from "lucide-react";
import { formatCurrency, formatInt } from "@supervisor/utils/format/formatNumber";
import { TypeDashboardResponse } from "../../types/typeDashboard";
import { getProgressBar } from "@supervisor/utils/progress/getProgressColor";
import { getCompanyMetaValue } from "../../utils/dashboardMetaUtils";
import { Table, TableBody, TableCell, TableRow } from "@supervisor/components/ui/table";

type Subvalor = {
  label: string;
  value1: string | number;
  value2?: React.ReactNode;
};

type CardProps = {
  label: string;
  value?: string | number;
  barra?: React.ReactNode;
  explicacao: string;
  subvalores?: Subvalor[];
};

interface Props {
  codEmpresa: string;
  data: TypeDashboardResponse;
}

export default function CompanyMetricCards({ codEmpresa, data }: Props) {
  const totalObj = data.totais_por_empresa.find(e => e.lcpr_codempresa === codEmpresa);
  if (!totalObj) return <p>Empresa {codEmpresa} não encontrada.</p>;

  const compraObj = data.compras.por_empresa.find(c => c.empresa === codEmpresa);
  const totalCompras = compraObj?.valorTotal ?? 0;
  const lucroBruto = totalObj.total_vendas - totalCompras;
  const margemPct = totalObj.total_vendas > 0 ? (lucroBruto / totalObj.total_vendas) * 100 : 0;

  const metaVenda = getCompanyMetaValue(data.metas.totais_por_empresa, codEmpresa, "metaVenda");
  const limiteCompra = getCompanyMetaValue(data.metas.totais_por_empresa, codEmpresa, "limiteCompra");
    const metaMargem = getCompanyMetaValue(data.metas.totais_por_empresa, codEmpresa, "metaMargem");


  const cards: CardProps[] = [
    {
      label: "Total de Vendas",
      value: formatCurrency(totalObj.total_vendas),
      barra: metaVenda > 0
        ? getProgressBar(totalObj.total_vendas / metaVenda, `Meta: ${formatCurrency(metaVenda)}`)
        : undefined,
      explicacao: "Total de vendas desta empresa no período.",
    },
    {
        label: "Total de Compras",
        value: formatCurrency(totalCompras),
        barra: limiteCompra > 0
          ? getProgressBar(totalCompras / limiteCompra, `Limite: ${formatCurrency(limiteCompra)}`, true)
          : undefined,
        explicacao: "Total de compras desta empresa no período.",
      },
      {
        label: "Lucro Bruto",
        value: formatCurrency(lucroBruto),
        barra: metaMargem > 0
          ? getProgressBar(margemPct / metaMargem, `Meta: ${metaMargem.toFixed(2)}% | Real: ${margemPct.toFixed(2)}%`, false, true)
          : undefined,
        explicacao: "Diferença entre vendas e compras (lucro bruto) e percentual de margem.",
      },
      
    {
      label: "Cupons",
      subvalores: [
        { label: "Quantidade", value1: formatInt(totalObj.total_cupons) },
        { label: "Ticket Médio", value1: formatCurrency(totalObj.ticket_medio) },
      ],
      explicacao: "Número de cupons emitidos e valor médio por cupom.",
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
          <div className="absolute top-0 left-0 w-full h-1" />
          <div className="flex items-center justify-between pr-2">
            <CardTitle className="text-base font-semibold">{item.label}</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
              </PopoverTrigger>
              <PopoverContent side="top" className="text-sm w-64">
                {item.explicacao}
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
                {item.barra}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
