"use client";

import { useState, useMemo } from "react";
import { CardContent } from "@supervisor/components/ui/card";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import ComponentCardHeader from "./components/header/ComponentCardheader";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresasPublic";
import { TypeDashboardResponse } from "./types/typeDashboard";
import dynamic from "next/dynamic";

// Lazy load dos componentes
const TabComponentDashboardByEmp = dynamic(
  () => import("./components/TabComponentDashboardByEmp"),
  { loading: () => <p>Carregando dados da empresa...</p>, ssr: false }
);

const TabComponentDashboardEmpresaGeral = dynamic(
  () => import("./components/TabComponentEmpresaGeral"),
  { loading: () => <p>Carregando dados gerais...</p>, ssr: false }
);

export default function PageDashboard() {
  const [dashboardData, setDashboardData] = useState<TypeDashboardResponse | null>(null);
  const { data: dataEmpresas = [] } = useEmpresasDetalhes();

  const mapaCodigosNomes = useMemo(() => {
    return dataEmpresas.reduce((acc, empresa) => {
      acc[empresa.empr_codigo] = empresa.empr_nomereduzido?.trim() || "Sem nome";
      return acc;
    }, {} as Record<string, string>);
  }, [dataEmpresas]);

  const tabs = useMemo(() => {
    if (!dashboardData) return [];

    return [
      {
        value: "geral",
        label: "Geral",
        Component: () => (
          <TabComponentDashboardEmpresaGeral dashboardData={dashboardData} />
        ),
      },
      ...dashboardData.totais_por_empresa.map((e) => ({
        value: e.lcpr_codempresa,
        label: `${e.lcpr_codempresa} - ${mapaCodigosNomes[e.lcpr_codempresa] || "Sem nome"}`,
        Component: () => (
          <TabComponentDashboardByEmp
            codEmpresa={e.lcpr_codempresa}
            dashboardData={dashboardData}
          />
        ),
      })),
    ];
  }, [dashboardData, mapaCodigosNomes]);

  return (
    <div className="mb-20 md:mb-0">
      <ComponentCardHeader
        empresasDetalhes={dataEmpresas}
        onSuccess={setDashboardData}
      />

      <CardContent className="flex-1">
        {!dashboardData && <p>Carregando dados...</p>}
        {dashboardData && <TabsWrapper items={tabs} />}
      </CardContent>
    </div>
  );
}
