"use client";

import React, { memo, useMemo } from "react";
import { TypeDashboardResponse } from "../types/typeDashboard";
import DashboardMetricCards from "./metrics/DashCardMetricCards";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas";
import dynamic from "next/dynamic";
import ComponentMeioPagamento from "./meiosPagamento/DashCardMeioPagamento";
import { mockDepartamentos } from "./porHora/mockDepartamento";

const ComponentParticipacaoEmpresas = dynamic(
  () => import("./participacaoEmpresas/DashCardParticipacaoEmpresas"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);
const ComponentParticipacaoDepartamentos = dynamic(
  () => import("./departamento/DashCardParticipacaoDepartamento"),
  { ssr: false, loading: () => <p>Carregando tabela...</p> }
);


interface Props {
  dashboardData: TypeDashboardResponse;
}

function TabComponentDashboardEmpresaGeral({ dashboardData }: Props) {
  const { data: empresasData = [] } = useEmpresasDetalhes();

  // Memoize empresasData to avoid unnecessary renders
  const empresasMemo = useMemo(() => empresasData, [empresasData]);
  const totaisPorEmpresa = useMemo(
    () => dashboardData.totais_por_empresa,
    [dashboardData.totais_por_empresa]
  );

  const meiosPagamentoData = dashboardData.meios_pagamento.total_geral.map(
    (item) => ({
      descricao: item.descricao,
      valorTotal: item.valor_total,
    })
  );

  return (
    <div className="flex flex-col gap-4">
      {/* <DashboardMetricCards data={dashboardData} /> */}
        <div className="flex flex-col gap-2 w-full">
          <ComponentParticipacaoEmpresas
            periodo_anterior={dashboardData.periodo_anterior}
            totais_por_empresa={dashboardData.totais_por_empresa}
            empresas={empresasMemo}
          />
        </div>

      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="md:w-1/2 md:ml-auto flex-1">
          <ComponentMeioPagamento data={meiosPagamentoData} />
        </div>
        <div className="flex-1 md:ml-auto md:w-1/2">
          <ComponentParticipacaoDepartamentos data={mockDepartamentos} />
        </div>
      </div>



    </div>
  );
}

export default memo(TabComponentDashboardEmpresaGeral);