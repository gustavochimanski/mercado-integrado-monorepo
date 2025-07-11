import { TypeComprasGeralResponse } from "./typeCompras";
import { TypeDashboardMetaHeader } from "./typeMetas";
import { TypeVendaPorHoraResponse } from "./typeVendasPorHora";

/**
 * Totais por empresa retornados pela API do dashboard de vendas
 */
export type TotaisPorEmpresa = {
  lcpr_codempresa: string;
  total_cupons: number;
  total_vendas: number;
  ticket_medio: number;
};

/**
 * Totais gerais de vendas
 */
export type TotaisGerais = {
  total_cupons: number;
  total_vendas: number;
  ticket_medio: number;
};

type TypeRelacao = {
  relacaoValue: number
  relacaoPorcentagem: number
}

type TypeVendaDetalhadaByDate = {
  data: string
  valor: number
}

type TypeVendaDetalhadaEmpresas = {
  empresa: string
  dates: TypeVendaDetalhadaByDate[]
}

export type TypeVendaDetalhadaResponse = {
  empresas: string[]
  dataInicio: string
  dataFinal: string
  vendaEmpresas: TypeVendaDetalhadaEmpresas[]
}

/**
 * Header do dashboard de vendas
 */
export type TypeDashboardResponse = {
  totais_por_empresa: TotaisPorEmpresa[];
  total_geral: TotaisGerais;
  metas: TypeDashboardMetaHeader;
  relacao: TypeRelacao;
  compras: TypeComprasGeralResponse;
  vendaDetalhada: TypeVendaDetalhadaResponse;
  vendaPorHora: TypeVendaPorHoraResponse;  
};


/**
 * Filtros usados no dashboard (payload enviado)
 */
export type TypeFiltroDashboard = {
  empresas: any;
  dataInicio: string;
  dataFinal: string;
  situacao?: string;
  status_venda?: string;
  cod_vendedor?: string;
};
