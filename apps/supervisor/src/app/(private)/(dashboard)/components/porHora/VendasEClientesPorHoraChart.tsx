"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardHeader,
  CardContent,
} from "@supervisor/components/ui/card";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@supervisor/components/ui/chart";

import { TypeVendaPorHoraResponse } from "../../types/typeVendasPorHora";

interface Props {
  data: TypeVendaPorHoraResponse;
  empresaSelecionada: string;
}

export default function VendasEClientesPorHoraChart({
  data,
  empresaSelecionada,
}: Props) {
  const porEmpresa = data.porEmpresa;

  const chartData = (empresaSelecionada
    ? porEmpresa.find((e) => String(e.empresa) === String(empresaSelecionada))
        ?.vendasPorHora
    : data.totalGeral
  )?.map((v) => ({
    hora: `${v.hora.toString().padStart(2, "0")}:00`,
    total_vendas: v.total_vendas,
    total_clientes: v.total_cupons * 10,
  }));

  if (!chartData || chartData.length === 0) {
    return <p>Nenhum dado encontrado para a empresa {empresaSelecionada}.</p>;
  }

  // 🟢 Define o config para o gráfico e legenda
  const chartConfig = {
    total_vendas: {
      label: "Total de Vendas",
      color: "var(--chart-2)",
    },
    total_clientes: {
      label: "Total de Clientes",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="font-sans p-0">
      <CardHeader>
        <h6 className="font-sans font-semibold text-muted-foreground">
          Vendas e Clientes por Hora
        </h6>
      </CardHeader>

      <CardContent className="p-0 pb-2">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer className={"w-1/2"} height={200}>
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="hora"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const realValue =
                        name === "Total de Clientes"
                          ? (value as number) / 10
                          : (value as number);
                      return [realValue.toLocaleString("pt-BR"), name];
                    }}
                  />
                }
              />

              {/* Gradientes opcionais — pode deixar ou remover se usar fill direto */}
              <defs>
                <linearGradient id="fillTotalVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total_vendas)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-total_vendas)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillTotalClientes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total_clientes)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-total_clientes)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="total_vendas"
                stroke="var(--color-total_vendas)"
                fill="url(#fillTotalVendas)"
                name="Total de Vendas"
              />
              <Area
                type="monotone"
                dataKey="total_clientes"
                stroke="var(--color-total_clientes)"
                fill="url(#fillTotalClientes)"
                name="Total de Clientes"
              />

              {/* ✅ Legenda estilizada com cores e bolinhas */}
              <ChartLegend className="my-4" content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
