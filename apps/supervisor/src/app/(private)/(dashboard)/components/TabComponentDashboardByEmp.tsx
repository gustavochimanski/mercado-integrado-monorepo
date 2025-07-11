"use client";

import { TypeDashboardResponse } from "../types/typeDashboard";
import CompanyMetricCards from "./metrics/DashCardCompanyMetricCards";
import { dashboardMock } from "./meiosPagamento/mock";
import { ComponentMeioPagamento } from "./meiosPagamento/DashCardMeioPagamento";
import VendasPorHoraChart from "./vendasPorHora/ComponentChartVendasbyHour";
import DashCardClientesPorHoraChart from "./clientesPorHora/DashCardClientePorHora";


interface Props {
  codEmpresa: string;
  dashboardData: TypeDashboardResponse;
}

export default function TabComponentDashboardByEmp({
  codEmpresa,
  dashboardData,
}: Props) {
  const compraItem = dashboardData.compras.por_empresa.find(
    (c) => String(c.empresa) === String(codEmpresa)
  );
  const compras = compraItem?.valorTotal ?? 0;

  const meiosEmpresa = dashboardMock.meiosPagamento.por_empresa.find(
    (m) => String(m.empresa) === String(codEmpresa)
  );
  
  const meiosPagamentoData = meiosEmpresa?.meios.map((m) => ({
    empresa: m.tipo,
    valorTotal: m.valorTotal,
  })) ?? [];
  

  return (
    <div className="flex flex-col gap-4">
      {/* PRIMEIRA LINHA: MÉTRICAS GERAIS */}
      <CompanyMetricCards codEmpresa={codEmpresa} data={dashboardData} />

      {/* SEGUNDA LINHA */}
      <div className="flex md:flex-row flex-col gap-4 h-full">
        {/* Gráficos de vendas e clientes por hora */}
        <div className="w-full md:w-1/2 flex md:flex-row  flex-col gap-4">
        </div>

        {/* Componentes de meios de pagamento */}
        <div className="w-full md:w-1/2 flex md:flex-row flex-col gap-4">

          <VendasPorHoraChart
            data={dashboardData.vendaPorHora}
            empresaSelecionada={codEmpresa}
          />
          <DashCardClientesPorHoraChart
            data={dashboardData.vendaPorHora}
            empresaSelecionada={codEmpresa}
          />
        </div>
      </div>

      {/* TERCEIRA LINHA */}
      <div className="md:w-1/2 md:ml-auto flex-1">
        <ComponentMeioPagamento data={meiosPagamentoData} />
      </div> 
    
    </div>

  );
}
