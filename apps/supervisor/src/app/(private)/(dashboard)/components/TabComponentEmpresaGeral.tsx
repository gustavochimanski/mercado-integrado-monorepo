"use client";

import React, { memo, useMemo } from "react";
import { TypeDashboardResponse } from "../types/typeDashboard";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas";
import dynamic from "next/dynamic";
import ComponentMeioPagamento from "./meiosPagamento/DashCardMeioPagamento";
import { Card, CardContent, CardHeader } from "@supervisor/components/ui/card";

const ComponentParticipacaoEmpresas = dynamic(
  () => import("./participacaoEmpresas/DashCardParticipacaoEmpresas"),
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
    <div className="flex flex-col gap-4">
      {/* Bloco 1: Resumo + Participação Empresas */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* CARD lateral - ocupa 100% no mobile, 1/3 na horizontal */}
        <Card className="w-full md:w-1/3 flex flex-col max-h-[40vh]">
          <CardHeader>
            <h3 className="text-lg font-semibold">Resumo</h3>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-1">
            <div className="space-y-2">
              {[...Array(50)].map((_, i) => (
                <p key={i}>Linha {i + 1} - conteúdo exemplo</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PARTICIPAÇÃO - ocupa o restante da largura */}
        <div className="w-full md:w-2/3 flex h-full flex-col">
          <ComponentParticipacaoEmpresas
            periodo_anterior={dashboardData.periodo_anterior}
            totais_por_empresa={dashboardData.totais_por_empresa}
            empresas={empresasMemo}
          />
        </div>
      </div>

      {/* Bloco 2: Departamentos e Meios de Pagamento */}
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Departamentos primeiro no mobile */}
        <div className="flex-1 md:w-1/2 order-1 md:order-1">
          <ComponentParticipacaoDepartamentos data={dashboardData.departamento_geral} />
        </div>

        {/* Meios de pagamento abaixo no mobile, à direita no desktop */}
        <div className="flex-1 md:w-1/2 md:ml-auto order-2 md:order-2">
          <ComponentMeioPagamento data={meiosPagamentoData} />
        </div>
      </div>
    </div>
  );
}

export default memo(TabComponentDashboardEmpresaGeral);
