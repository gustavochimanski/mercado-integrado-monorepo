"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@supervisor/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@supervisor/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";
import { TypeRelacao, TypeRelacaoEmpresa } from "../../types/typeDashboard";
import { Separator } from "@supervisor/components/ui/separator";

interface Props {
  relacaoGeral?: TypeRelacao;
  relacaoPorEmpresa: TypeRelacaoEmpresa[];
  className?: string;
}

// Tooltip customizado: inclui compras, vendas, relação valor e %
function CustomTooltip({ active, payload, chartData }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white shadow p-2 rounded">
        {/* Mantém o conteúdo básico de séries */}
        <ChartTooltipContent indicator="dashed" payload={payload} />
        {/* Compras e Vendas explicitas */}
        <div className="text-sm">
          <div className="flex font-semibold text-primary  gap-1 mb-2">
            <p className="">Empresa:</p>
            <span >{data.codEmpresa} - {data.empresa}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--chart-5)] inline-block" />
            <p className="text-muted-foreground font-semibold">Compras:</p>
            <span>
              {data.compra.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <Separator className="mt-2"/>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--chart-3)] inline-block" />
            <p className="text-muted-foreground  font-semibold">Vendas:</p>
            <span>
              {data.venda.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>
        <Separator className="mt-2"/>
        {/* Relação valor e percentual */}
        <div className="text-sm pl-3">
          <div className="flex gap-1">
            <p className="text-muted-foreground  font-semibold ">Lucro: </p>
            {data.relacaoValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
          <Separator className="mt-2"/>
          <div className="flex gap-1">
            <p className="text-muted-foreground  font-semibold">Lucro %: </p>
            {data.relacaoPorcentagem.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function DashCardRelacaoVendaCompra({
  relacaoGeral,
  relacaoPorEmpresa,
  className = "",
}: Props) {
  const chartData = relacaoPorEmpresa.map((item) => ({
    empresa: item.empresa,
    compra: item.total_compras,
    venda: item.total_vendas,
    relacaoValue: item.relacaoValue,
    relacaoPorcentagem: item.relacaoPorcentagem,
  }));

  const chartConfig = {
    compra: { label: "Compras", color: "var(--chart-5)" },
    venda: { label: "Vendas", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  const dadosTabela =
    relacaoPorEmpresa.length === 1
      ? {
          total_compras: relacaoPorEmpresa[0].total_compras,
          total_vendas: relacaoPorEmpresa[0].total_vendas,
          relacaoValue: relacaoPorEmpresa[0].relacaoValue,
          relacaoPorcentagem: relacaoPorEmpresa[0].relacaoPorcentagem,
        }
      : relacaoGeral;

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Venda vs Compra</h3>
      </CardHeader>

      <CardContent className="flex-grow overflow-x-auto">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="empresa" tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<CustomTooltip chartData={chartData} />} />
            <Bar dataKey="compra" fill={chartConfig.compra.color} radius={3} />
            <Bar dataKey="venda" fill={chartConfig.venda.color} radius={3} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <div className="mt-auto overflow-x-auto overflow-y-hidden h-20">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Compras</TableHead>
              <TableHead>Lucro</TableHead>
              <TableHead>Vendas</TableHead>
              <TableHead>Lucro %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                {dadosTabela?.total_compras?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }) || "--"}
              </TableCell>
              <TableCell>
                {typeof dadosTabela?.relacaoValue === "number"
                  ? dadosTabela.relacaoValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "--"}
              </TableCell>
              <TableCell>
                {dadosTabela?.total_vendas?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }) || "--"}
              </TableCell>
              <TableCell>
                {typeof dadosTabela?.relacaoPorcentagem === "number"
                  ? `${dadosTabela.relacaoPorcentagem.toFixed(3)}%`
                  : "--"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
