"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@supervisor/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { TotaisPorEmpresa, TypeRelacaoEmpresa } from "../../types/typeDashboard";
import { chartColors } from "@supervisor/utils/dashColors";
import { Card } from "@supervisor/components/ui/card";

interface Empresa {
  empr_codigo: string;
  empr_nomereduzido: string;
}

interface Props {
  totais_por_empresa: TotaisPorEmpresa[];
  periodo_anterior: TotaisPorEmpresa[];
  relacaoEmpresa: TypeRelacaoEmpresa[];
  empresas?: Empresa[];
}

function getVariacaoPercentual(atual: number, anterior: number): number {
  if (anterior === 0) return 0;
  return ((atual - anterior) / anterior) * 100;
}

export default function TabelaResumoEmpresas({
  totais_por_empresa,
  periodo_anterior,
  relacaoEmpresa,
  empresas,
}: Props) {
  // 1. Dados agregados: total geral para o footer
  const totalVendasGeral = totais_por_empresa.reduce((sum, e) => sum + e.total_vendas, 0);
  const totalCuponsGeral = totais_por_empresa.reduce((sum, e) => sum + e.total_cupons, 0);
  const totalAnteriorGeral = periodo_anterior.reduce((sum, e) => sum + e.total_vendas, 0);
  const ticketMedioGeral =
    totalCuponsGeral > 0 ? totalVendasGeral / totalCuponsGeral : 0;
  const variacaoTotalGeral = getVariacaoPercentual(
    totalVendasGeral,
    totalAnteriorGeral
  );
  const isPositivoTotal = variacaoTotalGeral > 0;
  const isIgualTotal = variacaoTotalGeral === 0;

  // 2. Construir array unificado para iteração
  const dataUnificada = totais_por_empresa.map((e) => {
    const codigo = e.lcpr_codempresa;
    const anteriorItem =
      periodo_anterior.find((p) => p.lcpr_codempresa === codigo)?.total_vendas ?? 0;
    const rel = relacaoEmpresa.find((r) => r.empresa === codigo);

    return {
      codigo,
      nome:
        empresas?.find((x) => x.empr_codigo === codigo)?.empr_nomereduzido ??
        codigo,
      total_vendas: e.total_vendas,
      total_cupons: e.total_cupons,
      ticket_medio: e.ticket_medio,
      total_vendas_anterior: anteriorItem,
      total_compras: rel?.total_compras ?? 0,
      relacaoPorcentagem: rel?.relacaoPorcentagem ?? 0,
    };
  });

  // 3. Se quiser incluir empresas que só constam em relacaoEmpresa, descomente:
// relacaoEmpresa.forEach((r) => {
//   if (!totais_por_empresa.some((e) => e.lcpr_codempresa === r.empresa)) {
//     dataUnificada.push({
//       codigo: r.empresa,
//       nome: r.empresa,
//       total_vendas: 0,
//       total_cupons: 0,
//       ticket_medio: 0,
//       total_vendas_anterior: 0,
//       total_compras: r.total_compras,
//       relacaoPorcentagem: r.relacaoPorcentagem,
//     });
//   }
// });

  // 4. Ordenar pelo total de vendas
  dataUnificada.sort((a, b) => b.total_vendas - a.total_vendas);

  return (
    <Card className="flex-1 bg-background border max-h-[350px] flex flex-col">
      <div className="overflow-auto flex-1">
        <Table className="bg-background text-sm w-full min-w-[800px]">
          <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow className="whitespace-nowrap">
              <TableHead>Cor</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="text-right">Compras</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead className="text-right">Mês Ant.</TableHead>
              <TableHead className="text-right">Variação</TableHead>
              <TableHead className="text-right">Ticket Médio</TableHead>
              <TableHead className="text-right">Cupons</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataUnificada.map((row, idx) => {
              const variacao = getVariacaoPercentual(
                row.total_vendas,
                row.total_vendas_anterior
              );
              const isPositivo = variacao > 0;
              const isIgual = variacao === 0;

              return (
                <TableRow key={idx}>
                  
                  <TableCell>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[idx % chartColors.length],
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {row.codigo} – {row.nome} (
                    {((row.total_vendas / totalVendasGeral) * 100).toFixed(1)}
                    %)
                  </TableCell>
                  <TableCell className="text-right">
                    {row.total_compras.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.total_vendas.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.total_vendas_anterior.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {isIgual ? (
                      <span className="text-muted-foreground">0,0%</span>
                    ) : (
                      <span
                        className={
                          isPositivo
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        <span className="inline-flex items-center gap-1">
                          {isPositivo ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                          {Math.abs(variacao).toFixed(1)}%
                        </span>
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.ticket_medio.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.total_cupons.toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Rodapé TOTAL */}
            <TableRow className="sticky bottom-0 z-20 font-bold">
              <TableCell />
              <TableCell className="bg-muted text-primary">Total</TableCell>
              <TableCell className="bg-muted text-right text-primary">
                {/* Soma total de compras */}
                {relacaoEmpresa
                  .reduce((sum, r) => sum + r.total_compras, 0)
                  .toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
              </TableCell>
              <TableCell className="bg-muted text-right text-primary">
                {totalVendasGeral.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell className="bg-muted text-right text-yellow-600">
                {totalAnteriorGeral.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell className="bg-muted text-right">
                {isIgualTotal ? (
                  <span className="text-muted-foreground">0,0%</span>
                ) : (
                  <span
                    className={
                      isPositivoTotal
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {isPositivoTotal ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )}
                      {Math.abs(variacaoTotalGeral).toFixed(1)}%
                    </span>
                  </span>
                )}
              </TableCell>
              <TableCell className="bg-muted text-right text-primary">
                {ticketMedioGeral.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="bg-muted text-right text-primary">
                {totalCuponsGeral.toLocaleString("pt-BR")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
