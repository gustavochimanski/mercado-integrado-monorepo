"use client";

import React from "react";
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

  const total = data.reduce((acc, item) => acc + item.valorTotal, 0);
  const getChartColor = (index: number) =>
    altChartColors[index % altChartColors.length];

  const chartPieData: PieValueType[] = [...data]
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .map((item, idx) => ({
      id: idx,
      value: item.valorTotal,
      label: item.descricao,
      color: getChartColor(idx),
    }));

  function renderTabelaDetalhes() {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted-foreground px-2">
          Detalhamento
        </p>
        {/* container com scroll ao ultrapassar 300px */}
        <div className="relative overflow-auto max-h-[300px]">
          <Table className="bg-background text-sm min-w-[400px]">
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

              {/* Linha do TOTAL fixa no bottom */}
              <TableRow className="sticky bottom-0 z-20 font-bold">
                <TableCell className="bg-muted" />
                <TableCell className="bg-muted text-primary">Total</TableCell>
                <TableCell className="bg-muted text-center text-primary">
                  100%
                </TableCell>
                <TableCell className="bg-muted text-right text-primary">
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
          <div className="w-full flex justify-center items-center">
            <PieChart
              width={300}
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
                [`& .${legendClasses.root}`]: {
                  display: "none",
                },
              }}
            />
          </div>
          <div className="w-full">{renderTabelaDetalhes()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
