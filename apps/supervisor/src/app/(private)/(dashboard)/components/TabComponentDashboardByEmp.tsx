"use client";

import React, { useMemo } from "react";
import { TypeDashboardResponse, CodEmpresa } from "../types/typeDashboard";
import CompanyMetricCards from "./metrics/DashCardCompanyMetricCards";
import ComponentMeioPagamento from "./meiosPagamento/DashCardMeioPagamento";
import ComponentParticipacaoDepartamentos from "./departamento/DashCardParticipacaoDepartamento";
import { mockDepartamentos } from "./porHora/mockDepartamento";
import VendasEClientesPorHoraChart from "./porHora/VendasEClientesPorHoraChart";

interface Props {
  codEmpresa: CodEmpresa;
  dashboardData: TypeDashboardResponse;
}

export default function TabComponentDashboardByEmp({
  codEmpresa,
  dashboardData,
}: Props) {
  // 1️⃣ Meios de pagamento: geral vs. específico da empresa
  const meiosGerais = dashboardData.meios_pagamento.total_geral.map((item) => ({
    descricao: item.descricao,
    valorTotal: item.valor_total,
  }));

  const meiosEspecificos =
    dashboardData.meios_pagamento.por_empresa
      .find((m) => String(m.empresa) === String(codEmpresa))
      ?.meios.map((item) => ({
        descricao: item.descricao,
        valorTotal: item.valor_total,
      })) || [];

  const meiosPagamentoData =
    meiosEspecificos.length > 0 ? meiosEspecificos : meiosGerais;

  // 2️⃣ Vendas por hora: usar a propriedade correta do TypeDashboardResponse
  const vendasPorHoraData = useMemo(
    () => dashboardData.vendaPorHora,
    [dashboardData.vendaPorHora]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Cartões de métricas */}
      <CompanyMetricCards codEmpresa={codEmpresa} data={dashboardData} />

      {/* Linha com Participação de Departamentos e Gráfico de Vendas/Clientes por Hora */}
      <div className="flex md:flex-row flex-col gap-4 h-full">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <ComponentParticipacaoDepartamentos data={mockDepartamentos} />
        </div>

        <div className="md:w-1/2 md:ml-auto flex-1">
        <ComponentMeioPagamento data={meiosPagamentoData} />
      </div>

      </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <VendasEClientesPorHoraChart
            data={vendasPorHoraData}
            empresaSelecionada={codEmpresa}
          />
        </div>

    </div>
  );
}
