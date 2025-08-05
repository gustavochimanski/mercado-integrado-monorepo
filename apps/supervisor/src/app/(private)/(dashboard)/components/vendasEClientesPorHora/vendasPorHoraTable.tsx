"use client";

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
}

interface Props {
  data: LinhaAcumulada[];
}

export default function VendasPorHoraTable({ data }: Props) {
  return (
    <div className="w-full max-h-[350px] overflow-auto rounded-sm">
      <Table className="bg-background text-sm rounded-sm min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 z-10 bg-muted">Hora</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">
              Cupons da Hora
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">
              Cupons Acumulados
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">
              Total de Vendas
            </TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">
              Ticket Médio
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.hora}>
              <TableCell>{row.hora}</TableCell>
              <TableCell>{row.cupons_hora}</TableCell>
              <TableCell>{row.total_cupons}</TableCell>
              <TableCell>
                {row.total_vendas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell>
                {row.ticket_medio.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
