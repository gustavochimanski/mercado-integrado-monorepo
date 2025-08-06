"use client";

import { CardContent } from "@supervisor/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";
import { TypeTotaisPorDepartamento } from "./ComponentPartPorDepartamento";

interface Props {
  data: TypeTotaisPorDepartamento[];
  cores?: string[]; 
}

export default function TabelaParticipacaoDepartamentos({ data }: Props) {
  const totalGeral = data.reduce((acc, item) => acc + item.total_vendas, 0);

  return (
    <div>
      <CardContent className="relative overflow-auto max-h-[300px]">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 bg-muted z-20">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((dep, idx) => {
              const percentual = ((dep.total_vendas / totalGeral) * 100).toFixed(1);
              // use seu array de cores, ou fallback
              const cor = `var(--chart-${(idx % 16) + 1})`;

              return (
                <TableRow key={idx}>
                  <TableCell>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cor }}
                    />
                  </TableCell>
                  <TableCell>{dep.departamento}</TableCell>
                  <TableCell className="text-right">
                    {dep.total_vendas.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">{percentual}%</TableCell>
                </TableRow>
              );
            })}

            {/* Linha do total, sticky no bottom */}
            <TableRow className="sticky bottom-0 font-bold border-t border-muted z-10">
              <TableCell />
              <TableCell className="text-primary bg-muted">Total</TableCell>
              <TableCell className="text-right text-primary bg-muted">
                {totalGeral.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell className="text-right text-primary bg-muted">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}
