"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@supervisor/components/ui/card";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  TypeRelacao,
  TypeRelacaoEmpresa,
} from "../../types/typeDashboard";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";

interface Props {
  relacaoGeral?: TypeRelacao;
  relacaoPorEmpresa: TypeRelacaoEmpresa[];
  className?: string;
}

export default function DashCardRelacaoVendaCompra({
  relacaoGeral,
  relacaoPorEmpresa,
  className = "",
}: Props) {
  const dataset = relacaoPorEmpresa.map((item) => ({
    empresa: item.empresa,
    venda: item.total_vendas,
    compra: item.total_compras,
  }));

  const altura = Math.max(dataset.length * 25, 180);

  // Se tiver só 1 empresa, usamos ela na tabela. Senão usamos o total geral
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
        <BarChart
          dataset={dataset}
          layout="vertical"
          height={altura}
          margin={{ top: 20, left: 20, right: 20 }}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "empresa",
              categoryGapRatio: 0.3,
              barGapRatio: 0.2, // 👈 separa as barras
            },
          ]}
          yAxis={[
            {
              position: "none", // esconde os números do eixo Y
            },
          ]}
          series={[
            {
              dataKey: "compra",
              label: "Compras",
              color: "var(--chart-5)",
            },
            {
              dataKey: "venda",
              label: "Vendas",
              color: "var(--chart-3)",
            },
          ]}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: { vertical: "bottom", horizontal: "center" },
            },
          }}
        />
      </CardContent>

      <div className="mt-auto">
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
