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

interface Empresa {
  empr_codigo: string;
  empr_nomereduzido: string;
}

interface Props {
  totais_por_empresa: TotaisPorEmpresa[];
  periodo_anterior: TotaisPorEmpresa[];
  empresas?: Empresa[];
}

function getVariacaoPercentual(atual: number, anterior: number): number {
  if (anterior === 0) return 0;
  return ((atual - anterior) / anterior) * 100;
}

export default function TabelaResumoEmpresas({
  totais_por_empresa,
  periodo_anterior,
  empresas,
}: Props) {
  const totalVendas = totais_por_empresa.reduce((sum, e) => sum + e.total_vendas, 0);
  const totalCupons = totais_por_empresa.reduce((sum, e) => sum + e.total_cupons, 0);
  const totalAnterior = periodo_anterior.reduce((sum, e) => sum + e.total_vendas, 0);

  const ticketMedioGeral = totalCupons > 0 ? totalVendas / totalCupons : 0;
  const variacaoTotal = getVariacaoPercentual(totalVendas, totalAnterior);
  const isPositivo = variacaoTotal > 0;
  const isIgual = variacaoTotal === 0;

  const dataOrdenada = [...totais_por_empresa].sort((a, b) => b.total_vendas - a.total_vendas);

return (
  <div className="flex-1">
    <div className=" rounded-md border border-muted">
      <Table className="bg-background text-sm w-full">
        <TableHeader className="sticky top-0 bg-muted z-10">
          <TableRow className="whitespace-nowrap">
            <TableHead>Cor</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead className="text-right">Part%</TableHead>
            <TableHead className="text-right">Vendas</TableHead>
            <TableHead className="text-right">Mês Ant.</TableHead>
            <TableHead className="text-right">Variação</TableHead>
            <TableHead className="text-right whitespace-nowrap">Ticket Médio</TableHead>
            <TableHead className="text-right">Cupons</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataOrdenada.map((e, idx) => {
            const codigo = e.lcpr_codempresa;
            const nome =
              empresas?.find((x) => x.empr_codigo === codigo)?.empr_nomereduzido ?? codigo;

            const dadoAnterior = periodo_anterior.find((c) => c.lcpr_codempresa === codigo);
            const anterior = dadoAnterior?.total_vendas ?? 0;

            const part =
              totalVendas > 0 ? ((e.total_vendas / totalVendas) * 100).toFixed(1) : "0";
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
                <TableCell className="text-right">{part}%</TableCell>
                <TableCell className="text-right">
                  {e.total_vendas.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
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
                        isPositivo ? "text-green-600 font-medium" : "text-red-600 font-medium"
                      }
                    >
                      <span className="inline-flex items-center gap-1">
                        {isPositivo ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(variacao).toFixed(1)}%
                      </span>
                    </span>
                  )}
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
                  {e.total_cupons.toLocaleString("pt-BR")}
                </TableCell>
              </TableRow>
            );
          })}

          {/* Linha TOTAL */}
          <TableRow className="font-bold border-t border-muted">
            <TableCell />
            <TableCell>Total</TableCell>
            <TableCell className="text-right">100%</TableCell>
            <TableCell className="text-right">
              {totalVendas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
            <TableCell className="text-right">
              {totalAnterior.toLocaleString("pt-BR", {
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
                    isPositivo ? "text-green-600 font-medium" : "text-red-600 font-medium"
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {isPositivo ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {Math.abs(variacaoTotal).toFixed(1)}%
                  </span>
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {ticketMedioGeral.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>

            <TableCell className="text-right">
              {totalCupons.toLocaleString("pt-BR")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
);

}
