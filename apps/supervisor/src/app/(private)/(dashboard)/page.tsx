"use client"; 


import { useMemo, useState, useEffect } from "react";
import {  CardContent } from "@supervisor/components/ui/card"; 
import ComponentCardHeader from "./components/header/ComponentCardheader"; // Header com filtros (ex: datas e empresas)
import { usePostDashboard } from "./hooks/useQueryDashboard"; // Hook para enviar o payload e receber os dados do dashboard
import { TypeDashboardResponse, TypeFiltroDashboard } from "./types/typeDashboard"; // Tipagens utilizadas no dashboard
import { formatDateToYYYYMMDD } from "@supervisor/utils/format/formatDate"; // Função para formatar data para "yyyy-mm-dd"
import TabComponentDashboardEmpresaGeral from "./components/TabComponentEmpresaGeral"; // Aba com dados gerais
import TabComponentDashboardByEmp from "./components/TabComponentDashboardByEmp"; // Aba com dados por empresa
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"; // Componente de abas/tabulação
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas"; // Hook que busca as empresas no backend
import { TypeEmpresas } from "@supervisor/types/empresas/TypeEmpresas"; // Tipagem da empresa

export default function PageDashboard() {
  const today = new Date();

  // 🧾 Payload padrão com datas de hoje e array de empresa vazio
  const defaultPayload: TypeFiltroDashboard = {
    empresas: [""],
    dataInicio: formatDateToYYYYMMDD(today),
    dataFinal: formatDateToYYYYMMDD(today),
  };

  // 🎯 Estados principais do componente
  const [payload, setPayload] = useState<TypeFiltroDashboard>(defaultPayload); // Filtros atuais
  const [dashboardData, setDashboardData] = useState<TypeDashboardResponse | null>(null); // Resposta da API

  // 🏢 Busca empresas (já com fallback para array vazio)
  const { data: dataEmpresas = [] } = useEmpresasDetalhes();

  // 🚀 Hook para enviar o filtro e buscar dados do dashboard
  const { mutateAsync, error } = usePostDashboard();

  // 🔁 Dispara a busca dos dados sempre que o payload mudar
  useEffect(() => {
    mutateAsync(payload)
      .then(setDashboardData) // Se der certo, atualiza os dados
      .catch(() => setDashboardData(null)); // Se der erro, zera
  }, [payload, mutateAsync]);

  // 📥 Atualiza o payload a partir do componente de filtros (header)
  const handleChangePayload = (newPayload: TypeFiltroDashboard) => {
    setPayload(newPayload);
  };

  // 🧠 Cria um mapa do código da empresa para o nome reduzido (otimizado com useMemo para não recalcular sempre)
  const mapaCodigosNomes: Record<string, string> = useMemo(() => {
    return dataEmpresas.reduce((acc: Record<string, string>, empresa: TypeEmpresas) => {
      acc[empresa.empr_codigo] = empresa.empr_nomereduzido?.trim() || "Sem nome";
      return acc;
    }, {});
  }, [dataEmpresas]);

  // 💬 Estados de carregamento, erro ou sem dados
  if (error) return <p>Deu ruim ao buscar dados.</p>;
  if (!dashboardData) return <p>Nenhum dado.</p>;

  // 🧩 Monta dinamicamente as abas: uma geral + uma para cada empresa
  const tabs = [
    {
      value: "geral", // ID da aba
      label: "Geral", // Nome exibido
      Component: <TabComponentDashboardEmpresaGeral dashboardData={dashboardData} />, // Componente que renderiza o conteúdo da aba GERAL
    },
    ...dashboardData.totais_por_empresa.map((e) => ({
      value: e.lcpr_codempresa,
      label: `${e.lcpr_codempresa} - ${mapaCodigosNomes[e.lcpr_codempresa] || "Sem nome"}`, // Nome da aba com código e nome da empresa
      Component: (
        <TabComponentDashboardByEmp
          codEmpresa={e.lcpr_codempresa}
          dashboardData={dashboardData}
        /> // Componente que renderiza o conteúdo de cada EMPRESA
      ),
    })),
  ];

  // 📦 Renderiza o componente final
  return (
    <div>
      {/* Header com formulário de filtros (datas, empresas etc.) */}
      <ComponentCardHeader
        initialPayload={payload}
        onChangePayload={handleChangePayload}
      />

      {/* TABS */}
      <CardContent className="flex-1">
        <TabsWrapper items={tabs} />
      </CardContent>
    </div>
  );
}
