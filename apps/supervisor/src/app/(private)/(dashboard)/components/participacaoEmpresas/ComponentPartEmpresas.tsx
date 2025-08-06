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
import { chartColors } from "@supervisor/utils/dashColors";
import TabelaResumoEmpresas from "./TabelaResumoEmpresas";

interface Props {
  totais_por_empresa: TotaisPorEmpresa[];
  periodo_anterior: TotaisPorEmpresa[];
  empresas?: { empr_codigo: string; empr_nomereduzido: string }[];
}

export default function ComponentParticipacaoEmpresas({
  totais_por_empresa,
  periodo_anterior,
  empresas,
}: Props) {
  const [typeChartSelected, setTypeChartSelected] = useState<"Pizza" | "Colunas">("Pizza");
  const isColunas = typeChartSelected === "Colunas";

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

      <CardContent className="flex flex-1 overflow-hidden flex-col md:flex-row gap-4">
        {/* Gráfico */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          {isColunas ? (
            <BarChart
              xAxis={[{ data: totais_por_empresa.map((e) => e.lcpr_codempresa) }]}
              series={[{ id: "Vendas", data: totais_por_empresa.map((e) => e.total_vendas) }]}
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

        {/* Tabela com scroll e altura controlada */}
        <div className="w-full  overflow-auto">
          <TabelaResumoEmpresas
            periodo_anterior={periodo_anterior}
            totais_por_empresa={totais_por_empresa}
            empresas={empresas}
          />
        </div>
      </CardContent>

    </Card>
  );
}
