"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { PieValueType } from "@mui/x-charts/models";
import { Card, CardContent, CardTitle } from "@supervisor/components/ui/card";
import { BarChart, legendClasses } from "@mui/x-charts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import TabelaParticipacaoDepartamentos from "./TabelaParticipacaoDepartamento";
import { chartColors } from "@supervisor/utils/dashColors";

// Tipo dos dados
export interface TotaisPorDepartamento {
  depto_codigo: string;
  total_vendas: number;
  depto_nome: string;
}

interface Props {
  data: TotaisPorDepartamento[];
}

export default function ComponentParticipacaoDepartamentos({ data }: Props) {
  const [typeChartSelected, setTypeChartSelected] = useState("Pizza");
  const isColunas = typeChartSelected === "Colunas";

  const labels = data.map((d) => d.depto_nome);
  const vendas = data.map((d) => d.total_vendas);

  const totalVendas = data.reduce((acc, d) => acc + d.total_vendas, 0);

  const chartPieData: PieValueType[] = data.map((d, idx) => {
    const percentual = ((d.total_vendas / totalVendas) * 100).toFixed(1);
    return {
      id: idx,
      value: d.total_vendas,
      label: `${d.depto_nome} (${percentual}%)`,
      color: chartColors[idx % chartColors.length],
    };
  });

  const theme = useTheme();

  return (
    <Card className="flex flex-col flex-1">
      <Select value={typeChartSelected} onValueChange={setTypeChartSelected}>
        <SelectTrigger className="w-[180px] ml-auto border-r-0 border-t-0 rounded-r-none rounded-t-none">
          <SelectValue placeholder="Tipo de gráfico" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pizza">Pizza</SelectItem>
          <SelectItem value="Colunas">Colunas</SelectItem>
        </SelectContent>
      </Select>

      <CardTitle className="mx-4">Participação por Departamento</CardTitle>

      <CardContent className="md:p-2 p-3">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full flex justify-center items-center">
            {isColunas ? (
              <BarChart
                xAxis={[{ data: labels }]}
                series={[{
                  id: "Vendas",
                  data: vendas,
                  color: "var(--chart-1)",
                }]}
                height={250}
                borderRadius={5}
                sx={{ width: "100%" }}
              />
            ) : (
              <PieChart
                height={200}
                series={[{
                  data: chartPieData,
                  cornerRadius: 3,
                  highlightScope: { fade: "global", highlight: "item" },
                }]}
                slotProps={{
                  legend: { direction: "vertical", markType: "circle" },
                }}
                sx={{
                  width: "100%",
                  margin: 3,
                  [`& .${legendClasses.root}`]: { display: "none" },
                  [`& .${legendClasses.mark}`]: { width: 16, height: 16 },
                }}
              />
            )}
          </div>

          <div className="w-full">
            <TabelaParticipacaoDepartamentos
              data={data}
              cores={chartColors}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
