"use client";

import React, { memo, useMemo } from "react";
import { TypeDashboardResponse } from "../types/typeDashboard";
import DashboardMetricCards from "./metrics/DashCardMetricCards";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas";
import dynamic from "next/dynamic";
import { TotaisPorDepartamento } from "./departamento/DashCardParticipacaoDepartamento";

// Imports dinâmicos para separar chunk e reduzir bundle inicial
const ComponentParticipacaoEmpresas = dynamic(
  () => import("./participacaoEmpresas/DashCardParticipacaoEmpresas"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);
const VendasPorHoraChart = dynamic(
  () => import("./vendasPorHora/ComponentChartVendasbyHour"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);
const DashCardClientesPorHoraChart = dynamic(
  () => import("./clientesPorHora/DashCardClientePorHora"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);
const ComponentParticipacaoDepartamentos = dynamic(
  () => import("./departamento/DashCardParticipacaoDepartamento"),
  { ssr: false, loading: () => <p>Carregando tabela...</p> }
);

// Dados mock movidos para fora do componente
const mockDepartamentos: TotaisPorDepartamento[] = [
  { depto_codigo: "1", depto_nome: "Mercearia", total_vendas: 120000 },
  { depto_codigo: "2", depto_nome: "Açougue", total_vendas: 90000 },
  { depto_codigo: "3", depto_nome: "Hortifruti", total_vendas: 50000 },
  { depto_codigo: "4", depto_nome: "Padaria", total_vendas: 70000 },
  { depto_codigo: "5", depto_nome: "Laticinios", total_vendas: 30000 },
  { depto_codigo: "6", depto_nome: "Congelados", total_vendas: 15000 },
  { depto_codigo: "7", depto_nome: "Bomboniere", total_vendas: 10000 },
];

interface Props {
  dashboardData: TypeDashboardResponse;
}

function TabComponentDashboardEmpresaGeral({ dashboardData }: Props) {
  // Fetch de empresas com fallback vazio
  const { data: empresasData = [] } = useEmpresasDetalhes();

  // Memoriza slices de dados para evitar recriações
  const totaisPorEmpresa = useMemo(
    () => dashboardData.totais_por_empresa,
    [dashboardData.totais_por_empresa]
  );
  const vendaPorHora = useMemo(
    () => dashboardData.vendaPorHora,
    [dashboardData.vendaPorHora]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Linha 1: métricas gerais */}
      <DashboardMetricCards data={dashboardData} />

      {/* Linha 2: participação e vendas/cliente por hora */}
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <ComponentParticipacaoEmpresas
            data={totaisPorEmpresa}
            empresas={empresasData}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
          <VendasPorHoraChart
            data={vendaPorHora}
            empresaSelecionada=""
          />
          <DashCardClientesPorHoraChart
            data={vendaPorHora}
            empresaSelecionada=""
          />
        </div>
      </div>

      {/* Linha 3: departamentos */}
      <div className="flex-1 md:ml-auto md:w-1/2">
        <ComponentParticipacaoDepartamentos data={mockDepartamentos} />
      </div>
    </div>
  );
}

// React.memo para evitar re-render quando props não mudam
export default memo(TabComponentDashboardEmpresaGeral);
