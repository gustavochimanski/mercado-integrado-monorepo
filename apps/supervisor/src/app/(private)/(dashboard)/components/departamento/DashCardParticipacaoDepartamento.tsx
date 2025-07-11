"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { PieValueType } from "@mui/x-charts/models";
import { Card, CardContent, CardTitle } from "@supervisor/components/ui/card";
import { BarChart, legendClasses } from "@mui/x-charts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import TabelaParticipacaoDepartamentos from "./TabelaParticipacaoDepartamento";

// Definindo o tipo dos dados para o componente de departamentos
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

  // Labels e dados de vendas
  const labels = data.map((departamento) => departamento.depto_nome);
  const vendas = data.map((departamento) => departamento.total_vendas);

  // Dados para o gráfico de barras
  const chartBarData = [
    {
      id: "Vendas",
      data: vendas,
    },
  ];

  // Definindo cores dos departamentos para os gráficos
  const coresDepartamentos: string[] = [
    "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)",
    "var(--chart-5)", "var(--chart-6)", "var(--chart-7)", "var(--chart-8)",
    "var(--chart-9)", "var(--chart-10)", "var(--chart-11)", "var(--chart-12)",
    "var(--chart-13)", "var(--chart-14)", "var(--chart-15)", "var(--chart-16)",
  ];

  // Calculando o total de vendas para calcular os percentuais
  const totalVendas = data.reduce((acc, departamento) => acc + departamento.total_vendas, 0);

  // Dados para o gráfico de pizza
  const chartPieData: PieValueType[] = data.map((departamento, idx) => {
    const percentual = ((departamento.total_vendas / totalVendas) * 100).toFixed(1);

    return {
      id: idx,
      value: departamento.total_vendas,
      label: `${departamento.depto_nome} (${percentual}%)`,
      color: coresDepartamentos[idx % coresDepartamentos.length],
    };
  });

  // Detectando se é mobile (tela pequena)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card className="flex flex-col flex-1 min-h-[250px] max-h-[300px]">
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

      <CardContent className="md:p-2 p-3 flex-1">
        <div className="flex justify-center">
          {isColunas ? (
            <BarChart
              xAxis={[{ data: labels }]}
              series={[{
                id: "Vendas",
                data: vendas,
                color: "var(--chart-1)", // cor fixa para barras
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
                [`& .${legendClasses.root}`]: {
                  display: "none"
                },
                [`& .${legendClasses.mark}`]: {
                  width: 16,
                  height: 16,
                },
              }}
            />
          )}
        <TabelaParticipacaoDepartamentos data={data} cores={coresDepartamentos}/>
        </div>
      </CardContent>
    </Card>
  );
}
