"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@supervisor/components/ui/chart";
import { useIsMobile } from "@supervisor/hooks/use-mobile";


interface ChartData {
  hora: string;
  total_vendas: number;
  total_clientes: number;
}

interface Props {
  chartData: ChartData[];
}

export default function VendasPorHoraChart({ chartData }: Props) {
  const isMobile = useIsMobile(); // 👈 usando seu hook aqui

  const chartConfig = {
    total_vendas: {
      label: "Total de Vendas",
      color: "var(--chart-2)",
    },
    total_clientes: {
      label: "Total de Clientes",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
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

          <CartesianGrid vertical={false} horizontal strokeDasharray="3 3" />
          <XAxis
            dataKey="hora"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />

          {!isMobile && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              width={30}
            />
          )}

          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

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

          <ChartLegend className="my-4" content={<ChartLegendContent />} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
