"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { PieValueType } from "@mui/x-charts/models";
import { TotaisPorEmpresa } from "../../types/typeDashboard";
import {
  Card,
  CardContent,
  CardTitle,
} from "@supervisor/components/ui/card";
import { BarChart, legendClasses } from "@mui/x-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@supervisor/components/ui/select";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supervisor/components/ui/table";
import { useMediaQuery, useTheme } from "@mui/material";

interface Props {
  data: TotaisPorEmpresa[];
  empresas: any[] | undefined;
}

export default function ComponentParticipacaoEmpresas({
  data,
  empresas,
}: Props) {
  const [typeChartSelected, setTypeChartSelected] = useState("Pizza");
  const isColunas = typeChartSelected === "Colunas";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const labels = data.map((empresa) => empresa.lcpr_codempresa);
  const dataOrdenada = [...data].sort(
    (a, b) => b.total_vendas - a.total_vendas
  );
  const vendas = data.map((empresa) => empresa.total_vendas);

  const coresEmpresas: string[] = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
    "var(--chart-9)",
    "var(--chart-10)",
    "var(--chart-11)",
    "var(--chart-12)",
    "var(--chart-13)",
    "var(--chart-14)",
    "var(--chart-15)",
    "var(--chart-16)",
  ];

  const findLabelEmp = (code_emp: string) => {
    return empresas?.find((e) => e.empr_codigo === code_emp)
      ?.empr_nomereduzido;
  };

  const totalVendas = data.reduce(
    (acc, empresa) => acc + empresa.total_vendas,
    0
  );

  const chartPieData: PieValueType[] = dataOrdenada.map((empresa, idx) => {
    const nome = findLabelEmp(empresa.lcpr_codempresa);
    const percentual = (
      (empresa.total_vendas / totalVendas) *
      100
    ).toFixed(1);

    return {
      id: idx,
      value: empresa.total_vendas,
      label: `${nome} (${percentual}%)`,
      color: coresEmpresas[idx % coresEmpresas.length],
    };
  });

  function renderTabelaDetalhes() {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted-foreground px-2">Detalhamento</p>
        <div className="overflow-auto max-h-[300px]">
          <Table className="bg-background text-sm">
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead>Cor</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead className="text-right">Margem%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartPieData.map((item, idx) => {
                const nome =
                  typeof item.label === "string"
                    ? item.label.split(" (")[0]
                    : "";

                const percentual =
                  typeof item.label === "string"
                    ? item.label.match(/\((.*?)%\)/)?.[1] ?? "0"
                    : "0";

                return (
                  <TableRow key={idx}>
                    <TableCell>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </TableCell>
                    <TableCell>{nome}</TableCell>
                    <TableCell className="text-right">
                      {item.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {percentual}%
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
        onValueChange={setTypeChartSelected}
      >
        <SelectTrigger className="w-[180px] ml-auto border-r-0 border-t-0 rounded-r-none rounded-t-none">
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
          <div className="w-full flex justify-center">
            {isColunas ? (
              <BarChart
                xAxis={[{ data: labels }]}
                margin={1}
                series={[
                  {
                    id: "Vendas",
                    data: vendas,
                    color: "var(--chart-1)",
                  },
                ]}
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
                  [`& .${legendClasses.root}`]: {
                    display: "none",
                  },
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
