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
  total_cupons: number; // acumulado
  total_vendas: number; // valor da hora
  ticket_medio: number; // da hora
  vendas_acumuladas?: number;
}

interface Props {
  data: LinhaAcumulada[];
}

export default function VendasPorHoraTable({ data }: Props) {
  const dataComAcumulado = data.reduce<LinhaAcumulada[]>((acc, linha, index) => {
    const anterior = acc[index - 1] ?? {
      vendas_acumuladas: 0,
      total_cupons: 0,
    };

    const vendasAcumuladas = anterior.vendas_acumuladas! + linha.total_vendas;
    const cuponsAcumulados = anterior.total_cupons + linha.cupons_hora;

    acc.push({
      ...linha,
      vendas_acumuladas: vendasAcumuladas,
      total_cupons: cuponsAcumulados,
    });

    return acc;
  }, []);

  return (
    <div className="w-full max-h-[350px] overflow-auto rounded-sm">
      <Table className="bg-background text-xs rounded-sm min-w-[700px]">
        <TableHeader className="sticky top-0 bg-muted z-10">
          <TableRow>
            <TableHead className="sticky top-0 z-10 bg-muted">Hora</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Cupons</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Cupons Acumu</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Total de Vendas</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Vendas Acumu</TableHead>
            <TableHead className="sticky top-0 z-10 bg-muted">Ticket Médio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataComAcumulado.map((row) => (
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
                {row.vendas_acumuladas?.toLocaleString("pt-BR", {
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
