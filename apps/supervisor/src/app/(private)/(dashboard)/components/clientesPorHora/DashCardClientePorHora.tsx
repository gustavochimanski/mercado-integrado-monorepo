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
} from "@supervisor/components/ui/chart";

import { TypeVendaPorHoraResponse } from "../../types/typeVendasPorHora";

interface Props {
  data: TypeVendaPorHoraResponse;
}

export default function DashCardClientesPorHoraChart({ data }: Props) {
  const chartData = data.vendasPorHora.map((v) => ({
    hora: `${v.hora.toString().padStart(2, "0")}:00`,
    total_clientes: v.total_cupons,
  }));

  const chartConfig = {
    total_clientes: {
      label: "Total de Clientes",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="font-sans p-0">
      <CardHeader>
        <h6 className="font-sans font-semibold text-muted-foreground">
          Clientes por Hora - {data.empresa}
        </h6>
      </CardHeader>
      <CardContent className="p-0 min-h-[200px]">
        <ChartContainer className="m-0" config={chartConfig}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="hora"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} />
              <Tooltip cursor={true} content={<ChartTooltipContent />} />

              <defs>
                <linearGradient id="fillTotalClientes" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_clientes)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_clientes)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="total_clientes"
                type="monotone"
                stroke="var(--color-total_clientes)"
                fill="url(#fillTotalClientes)"
                name="Total de Clientes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
