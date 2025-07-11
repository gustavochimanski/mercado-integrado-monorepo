
import { TypeDashboardResponse } from "../types/typeDashboard";
import DashboardMetricCards from "./metrics/DashCardMetricCards";
import { useEmpresasDetalhes } from "@supervisor/services/global/useGetEmpresas";
import ComponentParticipacaoEmpresas from "./participacaoEmpresas/DashCardParticipacaoEmpresas";
import VendasPorHoraChart from "./vendasPorHora/ComponentChartVendasbyHour";
import DashCardClientesPorHoraChart from "./clientesPorHora/DashCardClientePorHora";
import ComponentParticipacaoDepartamentos, { TotaisPorDepartamento } from "./departamento/DashCardParticipacaoDepartamento";

interface Props { dashboardData: TypeDashboardResponse }

const mockDepartamentos: TotaisPorDepartamento[] = [
  { depto_codigo: "1", depto_nome: "Mercearia", total_vendas: 120000 },
  { depto_codigo: "2", depto_nome: "Açougue", total_vendas: 90000 },
  { depto_codigo: "3", depto_nome: "Hortifruti", total_vendas: 50000 },
  { depto_codigo: "4", depto_nome: "Padaria", total_vendas: 70000 },
  { depto_codigo: "5", depto_nome: "Laticinios", total_vendas: 30000 },
  { depto_codigo: "5", depto_nome: "Congelados", total_vendas: 15000 },
  { depto_codigo: "5", depto_nome: "Bomboniere", total_vendas: 10000 },
];




export default function TabComponentDashboardEmpresaGeral({ dashboardData }: Props) {
  const {data: empresasData} = useEmpresasDetalhes();
  
return (
  <div className="flex flex-col gap-4">
    {/* PRIMEIRA LINHA: MÉTRICAS GERAIS */}
    <DashboardMetricCards data={dashboardData} />

    {/* SEGUNDA LINHA */}
    <div className="flex md:flex-row flex-col gap-4 h-full">
      <div className="gap-2 flex flex-col w-full md:w-1/2">
        <ComponentParticipacaoEmpresas
          data={dashboardData.totais_por_empresa}
          empresas={empresasData}
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-1 md:flex-row flex-col gap-4">
        <VendasPorHoraChart
          data={dashboardData.vendaPorHora}
          empresaSelecionada={""}
        />
       <DashCardClientesPorHoraChart data={dashboardData.vendaPorHora} empresaSelecionada={""} />
      </div>
    </div>

    {/* TERCEIRA LINHA */}
    <div className="md:w-1/2 md:ml-auto flex-1">
      <ComponentParticipacaoDepartamentos data={mockDepartamentos} />
    </div>
  </div>
);

}
