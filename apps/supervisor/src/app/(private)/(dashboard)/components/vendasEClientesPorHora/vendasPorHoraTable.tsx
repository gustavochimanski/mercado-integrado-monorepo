"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";

interface LinhaAcumulada {
  hora: string;
  cupons_hora: number;
  total_cupons: number;
  total_vendas: number;
  ticket_medio: number;
  vendas_acumuladas?: number;
}

interface Props {
  data: LinhaAcumulada[];
}

export default function VendasPorHoraTable({ data }: Props) {
  const dataComAcumulado = data.reduce<LinhaAcumulada[]>((acc, linha, idx) => {
    const anterior = acc[idx - 1] ?? { vendas_acumuladas: 0, total_cupons: 0 } as LinhaAcumulada;
    const vendasAcum = anterior.vendas_acumuladas! + linha.total_vendas;
    const cuponsAcum = anterior.total_cupons + linha.cupons_hora;
    acc.push({
      ...linha,
      vendas_acumuladas: vendasAcum,
      total_cupons: cuponsAcum,
    });
    return acc;
  }, []);

  const totalCuponsHora = data.reduce((sum, row) => sum + row.cupons_hora, 0);
  const totalVendasHora = data.reduce((sum, row) => sum + row.total_vendas, 0);
  const ticketMedioTotal = totalCuponsHora > 0 ? totalVendasHora / totalCuponsHora : 0;

  return (
    <div className="relative w-full max-h-[350px] overflow-auto rounded-sm">
      <Table className="bg-background text-xs rounded-sm min-w-[700px]">
        <TableHeader className="sticky top-0 bg-muted z-10">
          <TableRow>
            <TableHead className="sticky top-0 z-10 bg-muted">Hora</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Total de Vendas</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Vendas Acumu</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Cupons</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Cupons Acumu</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Ticket Médio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataComAcumulado.map((row) => (
            <TableRow key={row.hora}>
              <TableCell>{row.hora}</TableCell>
              <TableCell>
                {row.total_vendas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>
                {row.vendas_acumuladas?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>{row.cupons_hora}</TableCell>
              <TableCell>{row.total_cupons}</TableCell>
              <TableCell>
                {row.ticket_medio.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
            </TableRow>
          ))}

          {/* Linha de totais fixa e opaca */}
          <TableRow className="sticky bottom-0 z-50 bg-muted font-semibold">
            <TableCell className="text-primary bg-muted">Total</TableCell>
            <TableCell className="text-primary bg-muted">
              {totalVendasHora.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
            <TableCell className="bg-muted"></TableCell> {/*============= Vazio =============*/}
            <TableCell className="text-primary bg-muted">{totalCuponsHora}</TableCell>
            <TableCell className="bg-muted"></TableCell> {/*============= Vazio =========*/}
            <TableCell className="text-primary bg-muted">
              {ticketMedioTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
