"use client";

import React, { memo, useMemo } from "react";
import { TypeDashboardResponse } from "../types/typeDashboard";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas";
import dynamic from "next/dynamic";
import ComponentMeioPagamento from "./meiosPagamento/DashCardMeioPagamento";
import { Card, CardContent, CardHeader } from "@supervisor/components/ui/card";
import DashCardRelacaoVendaCompra from "./vendaCompra/dashVendaCompra";

// Componentes dinâmicos
const ComponentParticipacaoEmpresas = dynamic(
  () => import("./participacaoEmpresas/ComponentPartEmpresas"),
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
  const { data: empresasData = [] } = useEmpresasDetalhes();

  const empresasMemo = useMemo(() => empresasData, [empresasData]);

  const meiosPagamentoData = dashboardData.meios_pagamento.total_geral.map(
    (item) => ({
      descricao: item.descricao,
      valorTotal: item.valor_total,
    })
  );

  return (
    <div className="flex flex-col gap-4 w-full px-2 md:px-0">
      {/* Bloco 1: Rel. Venda/Compra + Participação Empresas */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="w-full md:w-1/3 h-[300px] md:h-[45vh]">
          <DashCardRelacaoVendaCompra
            className="h-full"
            relacaoGeral={dashboardData.relacao}
            relacaoPorEmpresa={dashboardData.relacao_por_empresa}
          />
        </div>

        <div className="w-full md:w-2/3 h-[450px] md:h-[45vh]">
          <ComponentParticipacaoEmpresas
            periodo_anterior={dashboardData.periodo_anterior}
            totais_por_empresa={dashboardData.totais_por_empresa}
            empresas={empresasMemo}
          />
        </div>
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
