"use client";

import React, { memo, useMemo } from "react";
import { TypeDashboardResponse } from "../types/typeDashboard";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas";
import dynamic from "next/dynamic";
import ComponentMeioPagamento from "./meiosPagamento/DashCardMeioPagamento";
import DashCardRelacaoVendaCompra from "./vendaCompra/dashVendaCompra";
import { useIsMobile } from "@supervisor/hooks/use-mobile";
import TabelaResumoEmpresas from "./participacaoEmpresas/TabelaResumoEmpresas";

// Componentes dinâmicos
const PieChartParticipacaoEmpresa = dynamic(
  () => import("./participacaoEmpresas/PieChartParticipacaoEmpresa"),
  { ssr: false, loading: () => <p>Carregando gráfico...</p> }
);
const ComponentParticipacaoDepartamentos = dynamic(
  () => import("./departamento/ComponentPartPorDepartamento"),
  { ssr: false, loading: () => <p>Carregando tabela...</p> }
);

interface Props {
  dashboardData: TypeDashboardResponse;
}

function TabComponentDashboardEmpresaGeral({ dashboardData }: Props) {
  const isMobile = useIsMobile()
  const { data: empresasData = [] } = useEmpresasDetalhes();

  const empresasMemo = useMemo(() => empresasData, [empresasData]);

  const meiosPagamentoData = dashboardData.meios_pagamento.total_geral.map(
    (item) => ({
      descricao: item.descricao,
      valorTotal: item.valor_total,
    })
  );

  function getLarguraPercentual(qtd: number): string {
    if (qtd < 4) return "35%";
    if (qtd < 6) return "33%";
    if (qtd < 8) return "37%";
    return "40%";
  }



  return (
    <div className="flex flex-col gap-4 w-full px-2 md:px-0">
      {/* Bloco 1: Rel. Venda/Compra + Participação Empresas */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {dashboardData.relacao_por_empresa.length > 0 && (
          <div
            className="w-full md:h-[45vh] flex-shrink-0"
            style={!isMobile ? { maxWidth: getLarguraPercentual(dashboardData.relacao_por_empresa.length) } : {}}
          >
            <DashCardRelacaoVendaCompra
              className="h-full"
              relacaoGeral={dashboardData.relacao}
              relacaoPorEmpresa={dashboardData.relacao_por_empresa}
            />
          </div>
        )}


        <div className="flex justify-between w-full gap-2">
            <div className="w-full md:h-[45vh]">
            <PieChartParticipacaoEmpresa
              totais_por_empresa={dashboardData.totais_por_empresa}
              empresas={empresasMemo}
            />
          </div>

          <div className="w-full md:h-[45vh]">
            <PieChartParticipacaoEmpresa
              totais_por_empresa={dashboardData.totais_por_empresa}
              empresas={empresasMemo}
            />
          </div>
        </div>
      </div>

      {/* Tabela com scroll e altura controlada */}
      <div className="w-full  overflow-auto">
        <TabelaResumoEmpresas
          periodo_anterior={dashboardData.periodo_anterior}
          totais_por_empresa={dashboardData.totais_por_empresa}
          empresas={empresasMemo}
        />
      </div>

      {/* Bloco 2: Departamentos + Meios de Pagamento */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="w-full md:w-1/2">
          <ComponentParticipacaoDepartamentos data={dashboardData.departamento_geral} />
        </div>

        <div className="w-full md:w-1/2">
          <ComponentMeioPagamento data={meiosPagamentoData} />
        </div>
      </div>
    </div>
  );
}


export default memo(TabComponentDashboardEmpresaGeral);
