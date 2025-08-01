"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { PieValueType } from "@mui/x-charts/models";
import { TotaisPorEmpresa } from "../../types/typeDashboard";
import { Card, CardContent, CardTitle } from "@supervisor/components/ui/card";
import { BarChart, legendClasses } from "@mui/x-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@supervisor/components/ui/select";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";
import { chartColors } from "@supervisor/utils/dashColors";
import { mockComparativoTemporal } from "./mockComparativoTemporal";
import TabelaResumoEmpresas from "./TabelaResumoEmpresas";

interface Props {
  data: TotaisPorEmpresa[];
  empresas?: { empr_codigo: string; empr_nomereduzido: string }[];
}

export default function ComponentParticipacaoEmpresas({
  data,
  empresas,
}: Props) {
  const [typeChartSelected, setTypeChartSelected] = useState<"Pizza" | "Colunas">("Pizza");
  const isColunas = typeChartSelected === "Colunas";

  const dataOrdenada = useMemo(
    () => [...data].sort((a, b) => b.total_vendas - a.total_vendas),
    [data]
  );
  const totalVendas = useMemo(
    () => data.reduce((sum, e) => sum + e.total_vendas, 0),
    [data]
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
  <Card className="flex flex-col flex-1 min-h-[250px] max-h-[1000px]">
    <Select
      value={typeChartSelected}
      onValueChange={(v) => setTypeChartSelected(v as "Pizza" | "Colunas")}
    >
      <SelectTrigger className="w-[180px] ml-auto">
        <SelectValue>{typeChartSelected}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pizza">Pizza</SelectItem>
        <SelectItem value="Colunas">Colunas</SelectItem>
      </SelectContent>
    </Select>


    <CardTitle className="mx-4">Participação por Empresa</CardTitle>

    <CardContent className="flex-1">
      {/* Container das 3 colunas */}
      <div className="flex flex-col gap-4 md:flex-row md:gap-6 items-center">
        {/* Comparativo Temporal */}
        <div className="w-full ">
          <TabelaResumoEmpresas
              data={data}
              comparativo={mockComparativoTemporal}
              empresas={empresas}
            />
        </div>

        {/* Gráfico */}
        <div className="w-full flex justify-center items-center">
          {isColunas ? (
            <BarChart
              xAxis={[{ data: data.map((e) => e.lcpr_codempresa) }]}
              series={[{ id: "Vendas", data: data.map((e) => e.total_vendas) }]}
              height={250}
              borderRadius={5}
              sx={{ width: "100%" }}
            />
          ) : (
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
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

}
