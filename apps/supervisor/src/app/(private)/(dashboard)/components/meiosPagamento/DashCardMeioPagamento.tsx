"use client";
import { useMediaQuery, useTheme } from "@mui/material";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@supervisor/components/ui/card";
import { PieChart, legendClasses } from "@mui/x-charts";
import { PieValueType } from "@mui/x-charts/models";

interface MeioPagamentoItem {
  empresa: string;
  valorTotal: number;
}

interface Props {
  data: MeioPagamentoItem[];
}

export default function ComponentMeioPagamento({ data }: Props) {

  const coresMeiosPagamento: Record<string, string> = {
    "PIX": "var(--chart-1)",
    "Crédito TEF": "var(--chart-2)",
    "Débito TEF": "var(--chart-3)",
    "Crédito POS": "var(--chart-4)",
    "Débito POS": "var(--chart-5)",
    "Dinheiro": "var(--chart-6)",
    "Alimentação": "var(--chart-7)",
  };



  const chartPieData: PieValueType[] = data.map((item, idx) => ({
    id: idx,
    value: item.valorTotal,
    label: item.empresa,
    color: coresMeiosPagamento[item.empresa] ?? undefined,
  }));

  // Detectando se é mobile (tela pequena)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card className="flex flex-col flex-1 min-h-[300px]">

      <CardHeader className="pb-0">
        <CardTitle className="mx-4">Meio de Pagamento</CardTitle>
      </CardHeader>

      <CardContent className="md:p-2 p-3 flex-1">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <PieChart
              height={200}
              series={[
                {
                  data: chartPieData,
                  cornerRadius: 3,
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              slotProps={{
                legend: {
                  direction: isMobile ? "horizontal" : "vertical",  // Mudando a direção da legenda com base no tamanho da tela
                  markType: "circle",
                },
              }}
              sx={{
                width: "100%",
                [`& .${legendClasses.root}`]: {
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px 24px",
                  maxHeight: 100,
                  flexDirection: isMobile ? "row" : "column",  // Se for mobile, a legenda vai ficar em linha (horizontal)
                },
                [`& .${legendClasses.mark}`]: {
                  width: 16,
                  height: 16,
                },
              }}
            />
        </div>
      </CardContent>
    </Card>
  );
}
