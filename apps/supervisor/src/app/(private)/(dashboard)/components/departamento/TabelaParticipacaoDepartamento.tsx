import { Card, CardContent, CardTitle } from "@supervisor/components/ui/card";
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
                <TableHead className="text-right">Vendas</TableHead>
                <TableHead className="text-right">%</TableHead>
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

              {/* Linha do total */}
              <TableRow className="font-bold border-t border-muted">
                <TableCell /> {/* coluna da bolinha vazia */}
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {totalGeral.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}
