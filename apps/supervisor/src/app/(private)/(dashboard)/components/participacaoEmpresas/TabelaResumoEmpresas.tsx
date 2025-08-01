"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@supervisor/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { TotaisPorEmpresa } from "../../types/typeDashboard";
import { chartColors } from "@supervisor/utils/dashColors";
import { ComparativoEmpresa } from "./mockComparativoTemporal";

interface Empresa {
  empr_codigo: string;
  empr_nomereduzido: string;
}

interface Props {
  data: TotaisPorEmpresa[];
  comparativo: ComparativoEmpresa[];
  empresas?: Empresa[];
}

function getVariacaoPercentual(atual: number, anterior: number): number {
  if (anterior === 0) return 0;
  return ((atual - anterior) / anterior) * 100;
}

export default function TabelaResumoEmpresas({ data, comparativo, empresas }: Props) {
  const totalVendas = data.reduce((sum, e) => sum + e.total_vendas, 0);
  const dataOrdenada = [...data].sort((a, b) => b.total_vendas - a.total_vendas);

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-auto w-full">
        <Table className="bg-background text-sm">
          <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow className="whitespace-nowrap">
              <TableHead>Cor</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead className="text-right">Part%</TableHead>
              <TableHead className="text-right">Cupons</TableHead>
              <TableHead className="text-right whitespace-nowrap">Ticket Médio</TableHead>
              <TableHead className="text-right">Mês Ant.</TableHead>
              <TableHead className="text-right">Variação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataOrdenada.map((e, idx) => {
              // Nome reduzido da empresa
              const codigo = e.lcpr_codempresa;
              const nome =
                empresas?.find((x) => x.empr_codigo === codigo)?.empr_nomereduzido ?? codigo;

              const dadoComparativo = comparativo.find((c) => c.empresa === codigo);


              const part = totalVendas > 0 ? ((e.total_vendas / totalVendas) * 100).toFixed(1) : "0";

              // Match com mockComparativoTemporal baseado no nome
              const anterior = dadoComparativo?.valorAnterior ?? 0;
              const variacao = getVariacaoPercentual(e.total_vendas, anterior);
              const isPositivo = variacao > 0;
              const isIgual = variacao === 0;

              return (
                <TableRow key={idx}>
                  <TableCell>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                    />
                  </TableCell>
                  <TableCell>{nome}</TableCell>
                  <TableCell className="text-right">
                    {e.total_vendas.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">{part}%</TableCell>
                  <TableCell className="text-right">
                    {e.total_cupons.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    {e.ticket_medio.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {anterior.toLocaleString("pt-BR", {
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
