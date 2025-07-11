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
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@supervisor/components/ui/card";

import {
  ChartContainer,
  ChartTooltipContent,
} from "@supervisor/components/ui/chart";

import { TypeVendaPorHoraResponse } from "../../types/typeVendasPorHora";

interface Props {
  data: TypeVendaPorHoraResponse;
  empresaSelecionada: string;
}

export default function VendasPorHoraChart({ data, empresaSelecionada }: Props) {
  // Se empresaSelecionada estiver definida, vamos buscar os dados da empresa
  const porEmpresa = data.porEmpresa;

  let chartData;

  // Caso tenha empresaSelecionada, mostramos dados da empresa
  if (empresaSelecionada) {
    const empresaData = porEmpresa.find(
      (e) => String(e.empresa) === String(empresaSelecionada)
    );

    if (!empresaData) {
      return <p>Nenhum dado encontrado para a empresa {empresaSelecionada}.</p>;
    }

    // Mapeia os dados da empresa selecionada
    chartData = empresaData.vendasPorHora.map((v) => ({
      hora: `${v.hora.toString().padStart(2, "0")}:00`,
      total_vendas: v.total_vendas,
    }));
  } else {
    // Se não tiver empresaSelecionada, mostramos os dados gerais
    const totalGeral = data.totalGeral;

    chartData = totalGeral.map((v) => ({
      hora: `${v.hora.toString().padStart(2, "0")}:00`,
      total_vendas: v.total_vendas,
    }));
  }

  const chartConfig = {
    total_vendas: {
      label: "Total de Vendas",
      color: "var(--chart-2)",
    },
  };

  return (
    <Card className="font-sans ">
      <CardHeader>
        <h6 className="font-sans font-semibold text-muted-foreground">Vendas por Hora </h6>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
              <Tooltip
                cursor={true}
                
                content={<ChartTooltipContent />}
              />

              <defs>
                <linearGradient id="fillTotalVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_vendas)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_vendas)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="total_vendas"
                type="monotone"
                stroke="var(--color-total_vendas)"
                fill="url(#fillTotalVendas)"
                name="Total de Vendas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
