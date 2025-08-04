"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@supervisor/components/ui/card";
import { PieChart, legendClasses } from "@mui/x-charts";
import { PieValueType } from "@mui/x-charts/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";
import { altChartColors } from "@supervisor/utils/dashColors";

interface MeioPagamentoItem {
  descricao: string;
  valorTotal: number;
}

interface Props {
  data: MeioPagamentoItem[];
}

export default function ComponentMeioPagamento({ data }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Total geral para cálculo de %
  const total = data.reduce((acc, item) => acc + item.valorTotal, 0);

  // Cores
  const getChartColor = (index: number) =>
    altChartColors[index % altChartColors.length];

  // Dados pro gráfico
  const chartPieData: PieValueType[] = [...data]
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .map((item, idx) => ({
      id: idx,
      value: item.valorTotal,
      label: item.descricao,
      color: getChartColor(idx),
    }));

  // Tabela de detalhamento
  function renderTabelaDetalhes() {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted-foreground px-2">
          Detalhamento
        </p>
        <div className="overflow-auto h-full">
          <Table className="bg-background text-sm">
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead>Cor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">%</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartPieData.map((item) => {
                const percentual = ((item.value / total) * 100).toFixed(1);

                const labelText =
                  typeof item.label === "function"
                    ? item.label("legend")
                    : item.label ?? "";

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </TableCell>
                    <TableCell>{labelText}</TableCell>
                    <TableCell className="text-center">{percentual}%</TableCell>
                    <TableCell className="text-right">
                      {item.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Linha do TOTAL */}
              <TableRow className="font-bold border-t border-muted">
                <TableCell />
                <TableCell>Total</TableCell>
                <TableCell className="text-center">100%</TableCell>
                <TableCell className="text-right">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }



  return (
    <Card className="flex flex-col flex-1 min-h-[300px]">
      <CardHeader className="pb-0">
        <CardTitle className="mx-4">Meio de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex-1">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Gráfico sem legenda */}
          <div className="w-full flex justify-center items-center">
            <PieChart
              height={200}
              series={[
                {
                  data: chartPieData,
                  cornerRadius: 3,
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              sx={{
                width: "100%",
                // esconde toda a área de legenda
                [`& .${legendClasses.root}`]: {
                  display: "none",
                },
              }}
            />
          </div>

          {/* Tabela de Detalhes */}
          <div className="w-full h-full">{renderTabelaDetalhes()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
