import { Card, CardContent, CardTitle } from "@supervisor/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";

import { TotaisPorDepartamento } from "./DashCardParticipacaoDepartamento";

interface Props {
  data: TotaisPorDepartamento[];
  cores: string[]; 
}


export default function TabelaParticipacaoDepartamentos({ data }: Props) {
  const totalGeral = data.reduce((acc, item) => acc + item.total_vendas, 0);

  return (
    <div >
      <CardContent className="overflow-auto max-h-[300px]">
        <Table>
            <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow>
                <TableHead></TableHead> {/* coluna da bolinha */}
                <TableHead>Departamento</TableHead>
                <TableHead className="text-right">Vendas (R$)</TableHead>
                <TableHead className="text-right">% Participação</TableHead>
            </TableRow>
            </TableHeader>

            <TableBody>
            {data.map((dep, idx) => {
                const percentual = ((dep.total_vendas / totalGeral) * 100).toFixed(1);
                const cor = `var(--chart-${(idx % 16) + 1})`;

                return (
                <TableRow key={idx}>
                    <TableCell>
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cor }}
                    ></div>
                    </TableCell>
                    <TableCell>{dep.depto_nome}</TableCell>
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
            </TableBody>


        </Table>
      </CardContent>
    </div>
  );
}
