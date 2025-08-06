"use client";

import { Card, CardContent, CardHeader } from "@supervisor/components/ui/card";
import { TypeVendaPorHoraResponse } from "../../types/typeVendasPorHora";
import VendasPorHoraTable from "./vendasPorHoraTable";
import VendasPorHoraChart from "./vendasPorHoraChart";

interface Props {
  data: TypeVendaPorHoraResponse[]; // ⬅️ Correção aqui
  empresaSelecionada: string;
}

export default function VendasEClientesPorHoraContainer({
  data,
  empresaSelecionada,
}: Props) {
  const selectedData =
    empresaSelecionada !== ""
      ? data.find((e) => String(e.empresa) === String(empresaSelecionada))
          ?.vendasPorHora
      : [];

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
    total_clientes: v.total_cupons * 10, // mock visual
  }));

  const acumulado = [...selectedData]
    .sort((a, b) => a.hora - b.hora)
    .map((v) => ({
      hora: `${v.hora.toString().padStart(2, "0")}:00`,
      cupons_hora: v.total_cupons,
      total_cupons: 0, // será acumulado no componente da tabela
      total_vendas: v.total_vendas,
      ticket_medio: v.ticket_medio,
    }));

  return (
    <Card className="font-sans p-0">
      <CardHeader>
        <h6 className="font-sans font-semibold text-muted-foreground">
          Vendas e Clientes por Hora
        </h6>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div className="flex flex-col gap-2 pt-4 lg:flex-row">
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
