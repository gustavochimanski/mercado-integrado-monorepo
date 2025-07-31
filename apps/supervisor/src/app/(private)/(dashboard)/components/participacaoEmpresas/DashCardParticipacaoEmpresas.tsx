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

  function renderTabelaDetalhes() {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted-foreground px-2">
          Detalhamento
        </p>
        <div className="overflow-auto w-full">
          <Table className="bg-background text-sm">
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead>Cor</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Part%</TableHead>
                <TableHead>Cupons</TableHead>
                <TableHead>Ticket Médio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartPieData.map((item, idx) => {
                const e = dataOrdenada[idx];
                const labelStr =
                  typeof item.label === "string"
                    ? item.label
                    : typeof item.label === "function"
                    ? item.label("legend")
                    : "";
                const nome = labelStr.split(" (")[0];
                const pctMatch = labelStr.match(/\((.*?)%\)/);
                const pct = pctMatch ? pctMatch[1] : "0";

                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </TableCell>
                    <TableCell>{nome}</TableCell>
                    <TableCell>
                      {item.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell>{pct}%</TableCell>
                    <TableCell>
                      {e.total_cupons.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {e.ticket_medio.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <Card className="flex flex-col flex-1 min-h-[250px] max-h-[500px]">
      <Select
        value={typeChartSelected}
        onValueChange={(v) => setTypeChartSelected(v as "Pizza" | "Colunas")}
      >
        <SelectTrigger className="w-[180px] ml-auto">
          <SelectValue placeholder="Tipo de Gráfico" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pizza">Pizza</SelectItem>
          <SelectItem value="Colunas">Colunas</SelectItem>
        </SelectContent>
      </Select>

      <CardTitle className="mx-4">Participação por Empresa</CardTitle>
      <CardContent className="flex-1">
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div className="w-full md:w-1/2 flex justify-center">
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
          <div className="w-full">{renderTabelaDetalhes()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
