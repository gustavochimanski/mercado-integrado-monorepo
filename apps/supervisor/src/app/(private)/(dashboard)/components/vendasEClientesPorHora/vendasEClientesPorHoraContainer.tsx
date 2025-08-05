"use client";

import { Card, CardContent, CardHeader } from "@supervisor/components/ui/card";
import { TypeVendaPorHoraResponse } from "../../types/typeVendasPorHora";
import VendasPorHoraTable from "./vendasPorHoraTable";
import VendasPorHoraChart from "./vendasPorHoraChart";

interface Props {
  data: TypeVendaPorHoraResponse;
  empresaSelecionada: string;
}

export default function VendasEClientesPorHoraContainer({
  data,
  empresaSelecionada,
}: Props) {
  const porEmpresa = data.porEmpresa;

  const selectedData =
    empresaSelecionada !== ""
      ? porEmpresa.find((e) => String(e.empresa) === String(empresaSelecionada))
          ?.vendasPorHora
      : data.totalGeral;

  if (!selectedData || selectedData.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nenhum dado encontrado para a empresa {empresaSelecionada}.
      </p>
    );
  }

  const chartData = selectedData.map((v) => ({
    hora: `${v.hora.toString().padStart(2, "0")}:00`,
    total_vendas: v.total_vendas,
    total_clientes: v.total_cupons * 10,
  }));

  const acumulado = selectedData.reduce(
    (acc, curr) => {
      const ultima = acc.data.at(-1);
      const vendasHora = curr.total_vendas;
      const cuponsHora = curr.total_cupons;

      const total_vendas = (ultima?.total_vendas ?? 0) + vendasHora;
      const total_cupons = (ultima?.total_cupons ?? 0) + cuponsHora;
      const ticket_medio =
        total_cupons > 0 ? total_vendas / total_cupons : 0;

      acc.data.push({
        hora: `${curr.hora.toString().padStart(2, "0")}:00`,
        cupons_hora: cuponsHora,
        total_cupons,
        total_vendas,
        ticket_medio,
      });

      return acc;
    },
    {
      data: [] as {
        hora: string;
        cupons_hora: number;
        total_cupons: number;
        total_vendas: number;
        ticket_medio: number;
      }[],
    }
  ).data;

  return (
    <Card className="font-sans p-0">
    <CardHeader>
        <h6 className="font-sans font-semibold text-muted-foreground">
        Vendas e Clientes por Hora
        </h6>
    </CardHeader>
    <CardContent className="p-0 pb-4">
        <div className="flex flex-col gap-6 pt-4 lg:flex-row">
        <div className="w-full lg:w-1/2 min-w-0">
            <VendasPorHoraChart chartData={chartData} />
        </div>
        <div className="w-full lg:w-1/2 min-w-0 overflow-x-auto">
            <VendasPorHoraTable data={acumulado} />
        </div>
        </div>
    </CardContent>
    </Card>
  );
}
