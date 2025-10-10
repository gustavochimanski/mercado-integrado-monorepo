"use client";

import React, { useMemo } from "react";
import { CodEmpresa, TypeDashboardResponse } from "../types/typeDashboard";
import ComponentMeioPagamento from "./meiosPagamento/DashCardMeioPagamento";
import ComponentParticipacaoDepartamentos, { TypeTotaisPorDepartamento } from "./departamento/ComponentPartPorDepartamento";
import VendasEClientesPorHoraContainer from "./vendasEClientesPorHora/vendasEClientesPorHoraContainer";
import { TypeVendaPorHoraResponse } from "../types/typeVendasPorHora";

interface Props {
  codEmpresa: CodEmpresa;
  dashboardData: TypeDashboardResponse;
}

export default function TabComponentDashboardByEmp({
  codEmpresa,
  dashboardData,
}: Props) {
  /** 1️⃣ Meios de Pagamento **/
  const meiosGerais = useMemo(
    () =>
      dashboardData.meios_pagamento.total_geral.map((item) => ({
        descricao: item.descricao,
        valorTotal: item.valor_total,
      })),
    [dashboardData]
  );

  const meiosEspecificos = useMemo(() => {
    return (
      dashboardData.meios_pagamento.por_empresa
        .find((m) => m.empresa === codEmpresa)
        ?.meios.map((item) => ({
          descricao: item.descricao,
          valorTotal: item.valor_total,
        })) || []
    );
  }, [dashboardData, codEmpresa]);

  const meiosPagamentoData =
    meiosEspecificos.length > 0 ? meiosEspecificos : meiosGerais;

  /** 2️⃣ Departamentos **/
  const departamentosGerais: TypeTotaisPorDepartamento[] = dashboardData.departamento_geral;
  const departamentosEspecificos: TypeTotaisPorDepartamento[] =
    dashboardData.departamento_empresa.find((d) => d.empresa === codEmpresa)
      ?.departamentos ?? [];
  const departamentosData =
    departamentosEspecificos.length > 0
      ? departamentosEspecificos
      : departamentosGerais;

  /** 3️⃣ Vendas por Hora **/
  const vendasPorHoraData: TypeVendaPorHoraResponse[] = dashboardData.vendaPorHora;

  return (
    <div className="flex flex-col gap-4">
      {/* 📊 Participação de Departamentos + Meios de Pagamento */}
      <div className="flex md:flex-row flex-col gap-4 h-full">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <ComponentParticipacaoDepartamentos data={departamentosData} />
        </div>
        <div className="md:w-1/2 md:ml-auto flex-1">
          <ComponentMeioPagamento data={meiosPagamentoData} />
        </div>
      </div>

      {/* 📈 Vendas e Clientes por Hora */}
      <div className="w-full flex flex-col gap-4">
        <VendasEClientesPorHoraContainer
          data={vendasPorHoraData}
          empresaSelecionada={codEmpresa}
        />
      </div>
    </div>
  );
}
