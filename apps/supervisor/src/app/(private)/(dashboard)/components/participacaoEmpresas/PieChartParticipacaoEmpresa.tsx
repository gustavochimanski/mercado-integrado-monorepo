"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { PieValueType } from "@mui/x-charts/models";
import { TotaisPorEmpresa } from "../../types/typeDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@supervisor/components/ui/card";
import { legendClasses } from "@mui/x-charts";
import {  useMemo } from "react";
import { chartColors } from "@supervisor/utils/dashColors";

interface Props {
  totais_por_empresa: TotaisPorEmpresa[];
  empresas?: { empr_codigo: string; empr_nomereduzido: string }[];
}

export default function PieChartParticipacaoEmpresa({
  totais_por_empresa,
  empresas,
}: Props) {

  const dataOrdenada = useMemo(
    () => [...totais_por_empresa].sort((a, b) => b.total_vendas - a.total_vendas),
    [totais_por_empresa]
  );
  const totalVendas = useMemo(
    () => totais_por_empresa.reduce((sum, e) => sum + e.total_vendas, 0),
    [totais_por_empresa]
  );

  const chartPieData: PieValueType[] = useMemo(
    () =>
      dataOrdenada.map((e, i) => {
        const nome =
          empresas?.find((x) => x.empr_codigo === e.lcpr_codempresa)
            ?.empr_nomereduzido ?? e.lcpr_codempresa;
        const pct = totalVendas > 0 ? ((e.total_vendas / totalVendas) * 100).toFixed(1) : "0";
        return {
          id: i,
          value: e.total_vendas,
          label: `${nome} (${pct}%)`,
          color: chartColors[i % chartColors.length],
        };
      }),
    [dataOrdenada, empresas, totalVendas]
  );

  return (
    <Card className="flex flex-col flex-1 h-full">

      <CardHeader>
        <CardTitle>Participação por Empresa</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 overflow-hidden flex-col md:flex-row gap-4">
        {/* Gráfico */}
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
            margin: 3,
            [`& .${legendClasses.root}`]: { display: "none" },
          }}
        />
        
      </CardContent>

    </Card>
  );
}
