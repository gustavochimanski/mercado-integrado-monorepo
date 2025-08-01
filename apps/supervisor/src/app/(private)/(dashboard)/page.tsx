"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CardContent } from "@supervisor/components/ui/card";
import ComponentCardHeader from "./components/header/ComponentCardheader";
import { usePostDashboard } from "./hooks/useQueryDashboard";
import {
  TypeDashboardResponse,
  TypeFiltroDashboard,
} from "./types/typeDashboard";
import { formatDateToYYYYMMDD } from "@supervisor/utils/format/formatDate";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas";
import dynamic from "next/dynamic";
import TabComponentDashboardEmpresaGeral from "./components/TabComponentEmpresaGeral";

// Lazy load das tabs
const TabComponentDashboardByEmp = dynamic(
  () => import("./components/TabComponentDashboardByEmp"),
  { loading: () => <p>Carregando dados da empresa...</p>, ssr: false }
);

export default function PageDashboard() {
  const today = useMemo(() => new Date(), []);

  const [payload, setPayload] = useState<TypeFiltroDashboard>(() => ({
    empresas: [""],
    dataInicio: formatDateToYYYYMMDD(today),
    dataFinal: formatDateToYYYYMMDD(today),
  }));

  const [dashboardData, setDashboardData] = useState<TypeDashboardResponse | null>(null);

  const { data: dataEmpresas = [] } = useEmpresasDetalhes();
  const { mutateAsync, error } = usePostDashboard();

  const handleChangePayload = useCallback((newPayload: TypeFiltroDashboard) => {
    setPayload(newPayload);
  }, []);

  const mapaCodigosNomes: Record<string, string> = useMemo(() => {
    return dataEmpresas.reduce((acc, empresa) => {
      acc[empresa.empr_codigo] = empresa.empr_nomereduzido?.trim() || "Sem nome";
      return acc;
    }, {} as Record<string, string>);
  }, [dataEmpresas]);

  useEffect(() => {
    mutateAsync(payload)
      .then(setDashboardData)
      .catch(() => setDashboardData(null));
  }, [payload, mutateAsync]);


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
    <div className="mb-5 md:mb-0">
      <ComponentCardHeader
        initialPayload={payload}
        onChangePayload={handleChangePayload}
      />

      <CardContent className="flex-1">
        {error && <p>Erro ao carregar dashboard.</p>}
        {!dashboardData && <p>Carregando dados...</p>}
        {dashboardData && <TabsWrapper items={tabs} />}
      </CardContent>
    </div>
  );
}